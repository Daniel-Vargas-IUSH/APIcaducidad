// app.js (CÓDIGO CORREGIDO Y LIMPIO)

import express from 'express';
import 'dotenv/config'; 
import cors from 'cors';

// Importar rutas
import productoRoutes from '../routes/producto_routes.js';
import authRoutes from '../routes/auth_routes.js';
import movimientoRoutes from '../routes/movimiento_routes.js';

const app = express();

// --- MIDDLEWARES GLOBALES ---
app.use(express.json()); // Parsear JSON en las peticiones
app.use(cors()); // Habilitar CORS

// --- RUTAS DE PRUEBA Y RAIZ ---
app.get('/', (req, res) => {
    res.send('API Rastreador de Caducidad está funcionando.');
});

app.get('/api', (req, res) => {
    res.json({ message: 'API Rastreador de Caducidad activa.', version: '1.0' });
});

// --- MONTAJE DE LAS RUTAS BAJO SUS PREFIJOS DEFINITIVOS ---
// 🔑 CLAVE: Solo un montaje para cada ruta.
app.use('/api/productos', productoRoutes);  // Rutas de Producto
app.use('/api/auth', authRoutes);         // Rutas de Autenticación
app.use('/api/movimientos', movimientoRoutes); // Rutas de Movimiento

// --- MANEJO DE ERRORES (Middleware final) ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal en el servidor.');
});

export default app;