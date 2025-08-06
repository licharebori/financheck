const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Importar rutas
const clientesRoutes = require('./routes/clientes');
const prestamosRoutes = require('./routes/prestamos');
const pagosRoutes = require('./routes/pagos');
const reportesRoutes = require('./routes/reportes');

// Rutas API
app.use('/api/clientes', clientesRoutes);
app.use('/api/prestamos', prestamosRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/reportes', reportesRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor FinanPro ejecutándose en puerto ${PORT}`);
  console.log(`📊 Sistema de gestión financiera listo`);
}); 