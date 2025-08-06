const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'finanpro.db');
const db = new sqlite3.Database(dbPath);

// Crear tablas
const initDatabase = () => {
  // Tabla de clientes
  db.run(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      apellido TEXT NOT NULL,
      dni TEXT UNIQUE NOT NULL,
      telefono TEXT,
      email TEXT,
      direccion TEXT,
      fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
      estado TEXT DEFAULT 'activo'
    )
  `);

  // Tabla de préstamos
  db.run(`
    CREATE TABLE IF NOT EXISTS prestamos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER NOT NULL,
      monto REAL NOT NULL,
      tasa_interes REAL NOT NULL,
      plazo_meses INTEGER NOT NULL,
      cuota_mensual REAL NOT NULL,
      fecha_inicio DATE NOT NULL,
      fecha_fin DATE NOT NULL,
      estado TEXT DEFAULT 'activo',
      saldo_pendiente REAL NOT NULL,
      FOREIGN KEY (cliente_id) REFERENCES clientes (id)
    )
  `);

  // Tabla de pagos
  db.run(`
    CREATE TABLE IF NOT EXISTS pagos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prestamo_id INTEGER NOT NULL,
      monto REAL NOT NULL,
      fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
      tipo_pago TEXT DEFAULT 'cuota',
      descripcion TEXT,
      FOREIGN KEY (prestamo_id) REFERENCES prestamos (id)
    )
  `);

  // Tabla de usuarios del sistema
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      nombre TEXT NOT NULL,
      rol TEXT DEFAULT 'usuario',
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ Base de datos inicializada correctamente');
};

// Inicializar base de datos
initDatabase();

module.exports = db; 