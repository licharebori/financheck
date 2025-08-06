const express = require('express');
const router = express.Router();
const db = require('../database/database');
const moment = require('moment');

// Obtener todos los pagos
router.get('/', (req, res) => {
  const query = `
    SELECT p.*, pr.cliente_id, c.nombre, c.apellido, c.dni
    FROM pagos p
    JOIN prestamos pr ON p.prestamo_id = pr.id
    JOIN clientes c ON pr.cliente_id = c.id
    ORDER BY p.fecha_pago DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Obtener pago por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  const query = `
    SELECT p.*, pr.cliente_id, c.nombre, c.apellido, c.dni
    FROM pagos p
    JOIN prestamos pr ON p.prestamo_id = pr.id
    JOIN clientes c ON pr.cliente_id = c.id
    WHERE p.id = ?
  `;
  
  db.get(query, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }
    res.json(row);
  });
});

// Crear nuevo pago
router.post('/', (req, res) => {
  const { prestamo_id, monto, tipo_pago, descripcion } = req.body;
  
  if (!prestamo_id || !monto) {
    return res.status(400).json({ error: 'Préstamo y monto son obligatorios' });
  }
  
  // Verificar que el préstamo existe y está activo
  db.get('SELECT * FROM prestamos WHERE id = ? AND estado = "activo"', [prestamo_id], (err, prestamo) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!prestamo) {
      return res.status(400).json({ error: 'Préstamo no encontrado o inactivo' });
    }
    
    // Verificar que el monto no exceda el saldo pendiente
    if (monto > prestamo.saldo_pendiente) {
      return res.status(400).json({ error: 'El monto excede el saldo pendiente del préstamo' });
    }
    
    const query = `
      INSERT INTO pagos (prestamo_id, monto, tipo_pago, descripcion)
      VALUES (?, ?, ?, ?)
    `;
    
    db.run(query, [prestamo_id, monto, tipo_pago || 'cuota', descripcion], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Actualizar saldo pendiente del préstamo
      const nuevoSaldo = prestamo.saldo_pendiente - monto;
      const estado = nuevoSaldo <= 0 ? 'pagado' : 'activo';
      
      db.run('UPDATE prestamos SET saldo_pendiente = ?, estado = ? WHERE id = ?', 
             [nuevoSaldo, estado, prestamo_id], function(updateErr) {
        if (updateErr) {
          return res.status(500).json({ error: updateErr.message });
        }
        
        res.status(201).json({
          id: this.lastID,
          prestamo_id,
          monto,
          tipo_pago: tipo_pago || 'cuota',
          descripcion,
          fecha_pago: moment().format('YYYY-MM-DD HH:mm:ss'),
          mensaje: 'Pago registrado exitosamente'
        });
      });
    });
  });
});

// Actualizar pago
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { monto, tipo_pago, descripcion } = req.body;
  
  const query = `
    UPDATE pagos 
    SET monto = ?, tipo_pago = ?, descripcion = ?
    WHERE id = ?
  `;
  
  db.run(query, [monto, tipo_pago, descripcion, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }
    res.json({ mensaje: 'Pago actualizado exitosamente' });
  });
});

// Eliminar pago
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM pagos WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }
    res.json({ mensaje: 'Pago eliminado exitosamente' });
  });
});

// Obtener pagos por préstamo
router.get('/prestamo/:prestamoId', (req, res) => {
  const { prestamoId } = req.params;
  
  const query = `
    SELECT p.*, pr.cliente_id, c.nombre, c.apellido, c.dni
    FROM pagos p
    JOIN prestamos pr ON p.prestamo_id = pr.id
    JOIN clientes c ON pr.cliente_id = c.id
    WHERE p.prestamo_id = ?
    ORDER BY p.fecha_pago DESC
  `;
  
  db.all(query, [prestamoId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Obtener pagos por fecha
router.get('/fecha/:fecha', (req, res) => {
  const { fecha } = req.params;
  
  const query = `
    SELECT p.*, pr.cliente_id, c.nombre, c.apellido, c.dni
    FROM pagos p
    JOIN prestamos pr ON p.prestamo_id = pr.id
    JOIN clientes c ON pr.cliente_id = c.id
    WHERE DATE(p.fecha_pago) = ?
    ORDER BY p.fecha_pago DESC
  `;
  
  db.all(query, [fecha], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Obtener resumen de pagos
router.get('/resumen/:periodo', (req, res) => {
  const { periodo } = req.params;
  let fechaInicio, fechaFin;
  
  switch (periodo) {
    case 'hoy':
      fechaInicio = moment().format('YYYY-MM-DD');
      fechaFin = moment().format('YYYY-MM-DD');
      break;
    case 'semana':
      fechaInicio = moment().startOf('week').format('YYYY-MM-DD');
      fechaFin = moment().endOf('week').format('YYYY-MM-DD');
      break;
    case 'mes':
      fechaInicio = moment().startOf('month').format('YYYY-MM-DD');
      fechaFin = moment().endOf('month').format('YYYY-MM-DD');
      break;
    default:
      return res.status(400).json({ error: 'Período no válido' });
  }
  
  const query = `
    SELECT 
      COUNT(*) as total_pagos,
      SUM(monto) as monto_total,
      tipo_pago,
      DATE(fecha_pago) as fecha
    FROM pagos 
    WHERE DATE(fecha_pago) BETWEEN ? AND ?
    GROUP BY tipo_pago, DATE(fecha_pago)
    ORDER BY fecha DESC
  `;
  
  db.all(query, [fechaInicio, fechaFin], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

module.exports = router; 