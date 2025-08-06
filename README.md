# FinanPro - Sistema de Gestión Financiera

Un sistema completo de gestión financiera diseñado para financieras, casas de cambio y empresas que manejan operaciones de préstamos y cambio de divisas.

## 🚀 Características Principales

### 📊 Dashboard en Tiempo Real
- **Vista general del día**: Total de operaciones, ingresos, egresos y ganancias
- **Alertas inteligentes**: Transferencias sin confirmar, operaciones impagas, cheques por vencer
- **Gráficos de rendimiento**: Visualización de ingresos/egresos diarios
- **Totales por divisa**: ARS, USD, USDT, EUR, etc.

### 💼 Gestión de Operaciones
- **Carga rápida de operaciones** con formulario intuitivo
- **Múltiples tipos de transacción**: Entrada/Salida
- **Soporte para múltiples divisas**: Físicas y virtuales
- **Cálculo automático de cotizaciones y comisiones**
- **Estados de operación**: Pendiente, Confirmado, Pagado

### 👥 Gestión de Clientes
- **Registro completo de clientes** con datos personales
- **Historial de operaciones** por cliente
- **Búsqueda avanzada** por nombre, DNI, teléfono
- **Estados de cliente**: Activo, Inactivo

### 📈 Reportes y Analytics
- **Reportes personalizables** por fecha, cliente, tipo de operación
- **Exportación a Excel y PDF**
- **Análisis de morosidad** y rendimiento
- **Estadísticas detalladas** de la cartera

### 🔐 Seguridad y Usuarios
- **Sistema de autenticación** con JWT
- **Roles de usuario**: Administrador, Cajero, Supervisor
- **Control de acceso** por secciones
- **Auditoría de operaciones**

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **SQLite** - Base de datos ligera
- **JWT** - Autenticación
- **Moment.js** - Manejo de fechas

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos
- **Tailwind CSS** - Framework de utilidades
- **JavaScript ES6+** - Funcionalidad dinámica
- **Font Awesome** - Iconografía

## 📦 Instalación

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/finanpro.git
cd finanpro
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar el archivo `.env` con tus configuraciones:
```env
PORT=3000
JWT_SECRET=tu_secreto_jwt_aqui
NODE_ENV=development
```

4. **Inicializar la base de datos**
```bash
npm run init-db
```

5. **Iniciar el servidor**
```bash
npm start
```

Para desarrollo con recarga automática:
```bash
npm run dev
```

## 🎯 Uso del Sistema

### Acceso Inicial
1. Abrir el navegador en `http://localhost:3000`
2. Usar las credenciales por defecto:
   - **Usuario**: admin
   - **Contraseña**: admin123

### Funcionalidades Principales

#### Dashboard
- **Vista general**: Estadísticas del día, alertas y divisas
- **Navegación rápida**: Acceso directo a todas las secciones
- **Notificaciones**: Alertas en tiempo real

#### Operaciones
1. **Nueva Operación**: Click en "Nueva Operación"
2. **Completar formulario**:
   - Seleccionar cliente
   - Tipo de transacción (Entrada/Salida)
   - Divisa entrante y saliente
   - Monto y cotización
   - Comisión aplicada
3. **Confirmar operación**

#### Clientes
1. **Registrar cliente**: Click en "Nuevo Cliente"
2. **Completar datos**: Nombre, DNI, teléfono, email, dirección
3. **Gestionar estado**: Activo/Inactivo

#### Reportes
1. **Seleccionar tipo de reporte**
2. **Aplicar filtros**: Fecha, cliente, estado
3. **Exportar**: Excel o PDF

## 📋 Estructura del Proyecto

```
finanpro/
├── database/
│   └── database.js          # Configuración de base de datos
├── routes/
│   ├── clientes.js          # API de gestión de clientes
│   ├── prestamos.js         # API de préstamos
│   ├── pagos.js             # API de pagos
│   └── reportes.js          # API de reportes
├── public/
│   ├── index.html           # Página principal
│   └── js/
│       └── app.js           # Lógica del frontend
├── server.js                # Servidor principal
├── package.json             # Dependencias
└── README.md               # Documentación
```

## 🔧 Configuración Avanzada

### Base de Datos
El sistema utiliza SQLite por defecto. Para cambiar a otra base de datos:

1. **MySQL/PostgreSQL**: Modificar `database/database.js`
2. **Variables de entorno**: Configurar en `.env`

### Personalización
- **Colores**: Modificar clases de Tailwind en `public/index.html`
- **Logo**: Reemplazar iconos en el sidebar
- **Divisas**: Agregar nuevas divisas en el frontend

## 🚀 Despliegue

### Producción
1. **Configurar variables de producción**
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=secreto_produccion_muy_seguro
```

2. **Usar PM2 para gestión de procesos**
```bash
npm install -g pm2
pm2 start server.js --name finanpro
pm2 startup
pm2 save
```

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 API Endpoints

### Clientes
- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Crear cliente
- `GET /api/clientes/:id` - Obtener cliente
- `PUT /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Eliminar cliente

### Préstamos
- `GET /api/prestamos` - Listar préstamos
- `POST /api/prestamos` - Crear préstamo
- `GET /api/prestamos/:id` - Obtener préstamo
- `GET /api/prestamos/:id/amortizacion` - Tabla de amortización

### Pagos
- `GET /api/pagos` - Listar pagos
- `POST /api/pagos` - Registrar pago
- `GET /api/pagos/resumen/:periodo` - Resumen de pagos

### Reportes
- `GET /api/reportes/prestamos` - Reporte de préstamos
- `GET /api/reportes/pagos` - Reporte de pagos
- `GET /api/reportes/morosidad` - Reporte de morosidad
- `GET /api/reportes/exportar/:tipo` - Exportar a CSV

## 🔒 Seguridad

### Autenticación
- **JWT Tokens**: Autenticación stateless
- **Expiración**: Tokens con tiempo de vida limitado
- **Refresh**: Renovación automática de tokens

### Validación
- **Input sanitization**: Limpieza de datos de entrada
- **SQL Injection**: Prevención con parámetros preparados
- **XSS Protection**: Headers de seguridad

## 🐛 Solución de Problemas

### Errores Comunes

1. **Puerto en uso**
```bash
Error: listen EADDRINUSE: address already in use :::3000
```
**Solución**: Cambiar puerto en `.env` o terminar proceso existente

2. **Base de datos no encontrada**
```bash
Error: no such table: clientes
```
**Solución**: Ejecutar `npm run init-db`

3. **Módulos no encontrados**
```bash
Error: Cannot find module 'express'
```
**Solución**: Ejecutar `npm install`

### Logs
Los logs se muestran en la consola. Para producción, configurar un sistema de logging:
```bash
npm install winston
```

## 🤝 Contribución

1. **Fork el proyecto**
2. **Crear rama feature**: `git checkout -b feature/nueva-funcionalidad`
3. **Commit cambios**: `git commit -am 'Agregar nueva funcionalidad'`
4. **Push a la rama**: `git push origin feature/nueva-funcionalidad`
5. **Crear Pull Request**

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

- **Email**: soporte@finanpro.com
- **Documentación**: [docs.finanpro.com](https://docs.finanpro.com)
- **Issues**: [GitHub Issues](https://github.com/tu-usuario/finanpro/issues)

## 🎉 Agradecimientos

- **Tailwind CSS** por el framework de utilidades
- **Font Awesome** por los iconos
- **SQLite** por la base de datos ligera
- **Express.js** por el framework web

---

**FinanPro** - Sistema de Gestión Financiera Profesional 🚀 