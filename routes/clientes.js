const express = require('express');
const router = express.Router();
const db = require('../database/database');

// Obtener todos los clientes
router.get('/', (req, res) => {
  const query = `
    SELECT c.*, 
           COUNT(p.id) as total_prestamos,
           SUM(CASE WHEN p.estado = 'activo' THEN 1 ELSE 0 END) as prestamos_activos
    FROM clientes c
    LEFT JOIN prestamos p ON c.id = p.cliente_id
    GROUP BY c.id
    ORDER BY c.fecha_registro DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Obtener cliente por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM clientes WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(row);
  });
});

// Crear nuevo cliente
router.post('/', (req, res) => {
  const { nombre, apellido, dni, telefono, email, direccion } = req.body;
  
  if (!nombre || !apellido || !dni) {
    return res.status(400).json({ error: 'Nombre, apellido y DNI son obligatorios' });
  }
  
  const query = `
    INSERT INTO clientes (nombre, apellido, dni, telefono, email, direccion)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [nombre, apellido, dni, telefono, email, direccion], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'El DNI ya está registrado' });
      }
      return res.status(500).json({ error: err.message });
    }
    
    res.status(201).json({
      id: this.lastID,
      nombre,
      apellido,
      dni,
      telefono,
      email,
      direccion,
      mensaje: 'Cliente creado exitosamente'
    });
  });
});

// Actualizar cliente
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, dni, telefono, email, direccion, estado } = req.body;
  
  const query = `
    UPDATE clientes 
    SET nombre = ?, apellido = ?, dni = ?, telefono = ?, email = ?, direccion = ?, estado = ?
    WHERE id = ?
  `;
  
  db.run(query, [nombre, apellido, dni, telefono, email, direccion, estado, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json({ mensaje: 'Cliente actualizado exitosamente' });
  });
});

// Eliminar cliente (cambiar estado a inactivo)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('UPDATE clientes SET estado = "inactivo" WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json({ mensaje: 'Cliente eliminado exitosamente' });
  });
});

// Buscar clientes
router.get('/buscar/:termino', (req, res) => {
  const { termino } = req.params;
  const searchTerm = `%${termino}%`;
  
  const query = `
    SELECT * FROM clientes 
    WHERE nombre LIKE ? OR apellido LIKE ? OR dni LIKE ?
    ORDER BY nombre, apellido
  `;
  
  db.all(query, [searchTerm, searchTerm, searchTerm], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

module.exports = router; 