const express = require('express');
const router = express.Router();
const db = require('../database/database');
const moment = require('moment');

// Función para calcular cuota mensual
const calcularCuotaMensual = (monto, tasaInteres, plazoMeses) => {
  const tasaMensual = tasaInteres / 100 / 12;
  const cuota = monto * (tasaMensual * Math.pow(1 + tasaMensual, plazoMeses)) / 
                (Math.pow(1 + tasaMensual, plazoMeses) - 1);
  return Math.round(cuota * 100) / 100;
};

// Obtener todos los préstamos
router.get('/', (req, res) => {
  const query = `
    SELECT p.*, 
           c.nombre, c.apellido, c.dni,
           (SELECT SUM(monto) FROM pagos WHERE prestamo_id = p.id) as total_pagado
    FROM prestamos p
    JOIN clientes c ON p.cliente_id = c.id
    ORDER BY p.fecha_inicio DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Obtener préstamo por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  const query = `
    SELECT p.*, 
           c.nombre, c.apellido, c.dni, c.telefono, c.email,
           (SELECT SUM(monto) FROM pagos WHERE prestamo_id = p.id) as total_pagado
    FROM prestamos p
    JOIN clientes c ON p.cliente_id = c.id
    WHERE p.id = ?
  `;
  
  db.get(query, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Préstamo no encontrado' });
    }
    res.json(row);
  });
});

// Crear nuevo préstamo
router.post('/', (req, res) => {
  const { cliente_id, monto, tasa_interes, plazo_meses, fecha_inicio } = req.body;
  
  if (!cliente_id || !monto || !tasa_interes || !plazo_meses) {
    return res.status(400).json({ 
      error: 'Cliente, monto, tasa de interés y plazo son obligatorios' 
    });
  }
  
  // Validar que el cliente existe
  db.get('SELECT id FROM clientes WHERE id = ? AND estado = "activo"', [cliente_id], (err, cliente) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!cliente) {
      return res.status(400).json({ error: 'Cliente no encontrado o inactivo' });
    }
    
    // Calcular cuota mensual
    const cuotaMensual = calcularCuotaMensual(monto, tasa_interes, plazo_meses);
    const fechaInicio = fecha_inicio || moment().format('YYYY-MM-DD');
    const fechaFin = moment(fechaInicio).add(plazo_meses, 'months').format('YYYY-MM-DD');
    
    const query = `
      INSERT INTO prestamos (cliente_id, monto, tasa_interes, plazo_meses, cuota_mensual, 
                           fecha_inicio, fecha_fin, saldo_pendiente)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(query, [cliente_id, monto, tasa_interes, plazo_meses, cuotaMensual, 
                   fechaInicio, fechaFin, monto], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      res.status(201).json({
        id: this.lastID,
        cliente_id,
        monto,
        tasa_interes,
        plazo_meses,
        cuota_mensual: cuotaMensual,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        saldo_pendiente: monto,
        mensaje: 'Préstamo creado exitosamente'
      });
    });
  });
});

// Actualizar préstamo
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { estado, saldo_pendiente } = req.body;
  
  const query = 'UPDATE prestamos SET estado = ?, saldo_pendiente = ? WHERE id = ?';
  
  db.run(query, [estado, saldo_pendiente, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Préstamo no encontrado' });
    }
    res.json({ mensaje: 'Préstamo actualizado exitosamente' });
  });
});

// Obtener préstamos por cliente
router.get('/cliente/:clienteId', (req, res) => {
  const { clienteId } = req.params;
  
  const query = `
    SELECT p.*, 
           (SELECT SUM(monto) FROM pagos WHERE prestamo_id = p.id) as total_pagado
    FROM prestamos p
    WHERE p.cliente_id = ?
    ORDER BY p.fecha_inicio DESC
  `;
  
  db.all(query, [clienteId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Calcular tabla de amortización
router.get('/:id/amortizacion', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM prestamos WHERE id = ?', [id], (err, prestamo) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!prestamo) {
      return res.status(404).json({ error: 'Préstamo no encontrado' });
    }
    
    const { monto, tasa_interes, plazo_meses, cuota_mensual } = prestamo;
    const tasaMensual = tasa_interes / 100 / 12;
    let saldoPendiente = monto;
    const amortizacion = [];
    
    for (let mes = 1; mes <= plazo_meses; mes++) {
      const interes = saldoPendiente * tasaMensual;
      const capital = cuota_mensual - interes;
      saldoPendiente -= capital;
      
      amortizacion.push({
        mes,
        cuota: cuota_mensual,
        capital: Math.round(capital * 100) / 100,
        interes: Math.round(interes * 100) / 100,
        saldo_pendiente: Math.max(0, Math.round(saldoPendiente * 100) / 100)
      });
    }
    
    res.json({
      prestamo,
      amortizacion
    });
  });
});

// Obtener préstamos vencidos
router.get('/estado/vencidos', (req, res) => {
  const query = `
    SELECT p.*, c.nombre, c.apellido, c.dni,
           (SELECT SUM(monto) FROM pagos WHERE prestamo_id = p.id) as total_pagado
    FROM prestamos p
    JOIN clientes c ON p.cliente_id = c.id
    WHERE p.fecha_fin < date('now') AND p.estado = 'activo'
    ORDER BY p.fecha_fin ASC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

module.exports = router; 