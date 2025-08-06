const express = require('express');
const router = express.Router();
const db = require('../database/database');
const moment = require('moment');

// Reporte general de préstamos
router.get('/prestamos', (req, res) => {
  const { fecha_inicio, fecha_fin, estado } = req.query;
  
  let query = `
    SELECT p.*, c.nombre, c.apellido, c.dni,
           (SELECT SUM(monto) FROM pagos WHERE prestamo_id = p.id) as total_pagado
    FROM prestamos p
    JOIN clientes c ON p.cliente_id = c.id
    WHERE 1=1
  `;
  
  const params = [];
  
  if (fecha_inicio) {
    query += ' AND p.fecha_inicio >= ?';
    params.push(fecha_inicio);
  }
  
  if (fecha_fin) {
    query += ' AND p.fecha_inicio <= ?';
    params.push(fecha_fin);
  }
  
  if (estado) {
    query += ' AND p.estado = ?';
    params.push(estado);
  }
  
  query += ' ORDER BY p.fecha_inicio DESC';
  
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Reporte de pagos
router.get('/pagos', (req, res) => {
  const { fecha_inicio, fecha_fin, tipo_pago } = req.query;
  
  let query = `
    SELECT p.*, pr.cliente_id, c.nombre, c.apellido, c.dni
    FROM pagos p
    JOIN prestamos pr ON p.prestamo_id = pr.id
    JOIN clientes c ON pr.cliente_id = c.id
    WHERE 1=1
  `;
  
  const params = [];
  
  if (fecha_inicio) {
    query += ' AND DATE(p.fecha_pago) >= ?';
    params.push(fecha_inicio);
  }
  
  if (fecha_fin) {
    query += ' AND DATE(p.fecha_pago) <= ?';
    params.push(fecha_fin);
  }
  
  if (tipo_pago) {
    query += ' AND p.tipo_pago = ?';
    params.push(tipo_pago);
  }
  
  query += ' ORDER BY p.fecha_pago DESC';
  
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Reporte de clientes
router.get('/clientes', (req, res) => {
  const { estado } = req.query;
  
  let query = `
    SELECT c.*, 
           COUNT(p.id) as total_prestamos,
           SUM(CASE WHEN p.estado = 'activo' THEN 1 ELSE 0 END) as prestamos_activos,
           SUM(CASE WHEN p.estado = 'pagado' THEN 1 ELSE 0 END) as prestamos_pagados,
           SUM(p.monto) as monto_total_prestado,
           (SELECT SUM(pa.monto) FROM pagos pa JOIN prestamos pr ON pa.prestamo_id = pr.id WHERE pr.cliente_id = c.id) as total_pagado
    FROM clientes c
    LEFT JOIN prestamos p ON c.id = p.cliente_id
    WHERE 1=1
  `;
  
  const params = [];
  
  if (estado) {
    query += ' AND c.estado = ?';
    params.push(estado);
  }
  
  query += ' GROUP BY c.id ORDER BY c.fecha_registro DESC';
  
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Reporte de morosidad
router.get('/morosidad', (req, res) => {
  const query = `
    SELECT p.*, c.nombre, c.apellido, c.dni,
           (SELECT SUM(monto) FROM pagos WHERE prestamo_id = p.id) as total_pagado,
           p.saldo_pendiente,
           CASE 
             WHEN p.fecha_fin < date('now') THEN 'Vencido'
             WHEN p.fecha_fin < date('now', '+7 days') THEN 'Por vencer'
             ELSE 'Al día'
           END as estado_vencimiento,
           julianday('now') - julianday(p.fecha_fin) as dias_vencido
    FROM prestamos p
    JOIN clientes c ON p.cliente_id = c.id
    WHERE p.estado = 'activo' AND p.saldo_pendiente > 0
    ORDER BY p.fecha_fin ASC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Reporte de ingresos vs egresos
router.get('/flujo-caja', (req, res) => {
  const { fecha_inicio, fecha_fin } = req.query;
  
  let fechaInicio = fecha_inicio || moment().startOf('month').format('YYYY-MM-DD');
  let fechaFin = fecha_fin || moment().endOf('month').format('YYYY-MM-DD');
  
  const query = `
    SELECT 
      DATE(p.fecha_pago) as fecha,
      SUM(p.monto) as ingresos,
      COUNT(*) as total_operaciones
    FROM pagos p
    WHERE DATE(p.fecha_pago) BETWEEN ? AND ?
    GROUP BY DATE(p.fecha_pago)
    ORDER BY fecha DESC
  `;
  
  db.all(query, [fechaInicio, fechaFin], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Reporte de rendimiento por período
router.get('/rendimiento', (req, res) => {
  const { periodo } = req.query;
  let fechaInicio, fechaFin;
  
  switch (periodo) {
    case 'semana':
      fechaInicio = moment().startOf('week').format('YYYY-MM-DD');
      fechaFin = moment().endOf('week').format('YYYY-MM-DD');
      break;
    case 'mes':
      fechaInicio = moment().startOf('month').format('YYYY-MM-DD');
      fechaFin = moment().endOf('month').format('YYYY-MM-DD');
      break;
    case 'trimestre':
      fechaInicio = moment().startOf('quarter').format('YYYY-MM-DD');
      fechaFin = moment().endOf('quarter').format('YYYY-MM-DD');
      break;
    case 'año':
      fechaInicio = moment().startOf('year').format('YYYY-MM-DD');
      fechaFin = moment().endOf('year').format('YYYY-MM-DD');
      break;
    default:
      fechaInicio = moment().startOf('month').format('YYYY-MM-DD');
      fechaFin = moment().endOf('month').format('YYYY-MM-DD');
  }
  
  const query = `
    SELECT 
      COUNT(DISTINCT p.id) as total_prestamos,
      SUM(p.monto) as monto_total_prestado,
      (SELECT SUM(pa.monto) FROM pagos pa 
       JOIN prestamos pr ON pa.prestamo_id = pr.id 
       WHERE pr.id = p.id AND DATE(pa.fecha_pago) BETWEEN ? AND ?) as total_cobrado,
      AVG(p.tasa_interes) as tasa_promedio,
      COUNT(DISTINCT p.cliente_id) as total_clientes
    FROM prestamos p
    WHERE p.fecha_inicio BETWEEN ? AND ?
  `;
  
  db.get(query, [fechaInicio, fechaFin, fechaInicio, fechaFin], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(row);
  });
});

// Reporte de top clientes
router.get('/top-clientes', (req, res) => {
  const { limite = 10 } = req.query;
  
  const query = `
    SELECT 
      c.id, c.nombre, c.apellido, c.dni,
      COUNT(p.id) as total_prestamos,
      SUM(p.monto) as monto_total_prestado,
      (SELECT SUM(pa.monto) FROM pagos pa 
       JOIN prestamos pr ON pa.prestamo_id = pr.id 
       WHERE pr.cliente_id = c.id) as total_pagado
    FROM clientes c
    LEFT JOIN prestamos p ON c.id = p.cliente_id
    GROUP BY c.id
    ORDER BY monto_total_prestado DESC
    LIMIT ?
  `;
  
  db.all(query, [limite], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Reporte de estadísticas generales
router.get('/estadisticas', (req, res) => {
  const queries = {
    totalClientes: 'SELECT COUNT(*) as total FROM clientes WHERE estado = "activo"',
    totalPrestamos: 'SELECT COUNT(*) as total FROM prestamos',
    prestamosActivos: 'SELECT COUNT(*) as total FROM prestamos WHERE estado = "activo"',
    prestamosPagados: 'SELECT COUNT(*) as total FROM prestamos WHERE estado = "pagado"',
    montoTotalPrestado: 'SELECT SUM(monto) as total FROM prestamos',
    montoTotalCobrado: 'SELECT SUM(monto) as total FROM pagos',
    promedioTasa: 'SELECT AVG(tasa_interes) as promedio FROM prestamos',
    morosidad: `
      SELECT COUNT(*) as total 
      FROM prestamos 
      WHERE estado = 'activo' AND fecha_fin < date('now')
    `
  };
  
  const resultados = {};
  let consultasCompletadas = 0;
  const totalConsultas = Object.keys(queries).length;
  
  Object.keys(queries).forEach(key => {
    db.get(queries[key], [], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      resultados[key] = row.total || row.promedio || 0;
      consultasCompletadas++;
      
      if (consultasCompletadas === totalConsultas) {
        res.json(resultados);
      }
    });
  });
});

// Exportar reporte a CSV
router.get('/exportar/:tipo', (req, res) => {
  const { tipo } = req.params;
  const { fecha_inicio, fecha_fin } = req.query;
  
  let query = '';
  let params = [];
  
  switch (tipo) {
    case 'prestamos':
      query = `
        SELECT p.id, c.nombre, c.apellido, c.dni, p.monto, p.tasa_interes, 
               p.plazo_meses, p.cuota_mensual, p.fecha_inicio, p.fecha_fin, 
               p.estado, p.saldo_pendiente
        FROM prestamos p
        JOIN clientes c ON p.cliente_id = c.id
        WHERE 1=1
      `;
      if (fecha_inicio) {
        query += ' AND p.fecha_inicio >= ?';
        params.push(fecha_inicio);
      }
      if (fecha_fin) {
        query += ' AND p.fecha_inicio <= ?';
        params.push(fecha_fin);
      }
      query += ' ORDER BY p.fecha_inicio DESC';
      break;
      
    case 'pagos':
      query = `
        SELECT p.id, c.nombre, c.apellido, c.dni, p.monto, p.tipo_pago, 
               p.fecha_pago, p.descripcion
        FROM pagos p
        JOIN prestamos pr ON p.prestamo_id = pr.id
        JOIN clientes c ON pr.cliente_id = c.id
        WHERE 1=1
      `;
      if (fecha_inicio) {
        query += ' AND DATE(p.fecha_pago) >= ?';
        params.push(fecha_inicio);
      }
      if (fecha_fin) {
        query += ' AND DATE(p.fecha_pago) <= ?';
        params.push(fecha_fin);
      }
      query += ' ORDER BY p.fecha_pago DESC';
      break;
      
    default:
      return res.status(400).json({ error: 'Tipo de reporte no válido' });
  }
  
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Convertir a CSV
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No hay datos para exportar' });
    }
    
    const headers = Object.keys(rows[0]);
    let csv = headers.join(',') + '\n';
    
    rows.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      });
      csv += values.join(',') + '\n';
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=reporte_${tipo}_${moment().format('YYYY-MM-DD')}.csv`);
    res.send(csv);
  });
});

module.exports = router; 