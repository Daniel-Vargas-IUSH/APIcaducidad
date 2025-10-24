// app.js
import express from 'express';
import productoRoutes from '../routes/producto_routes.js'; // <--- 1. Primera vez
import 'dotenv/config'; 
import cors from 'cors';

// Importar rutas
import authRoutes from '../routes/auth_routes.js';
// --- NUEVA Importación: Rutas de Movimiento ---
import movimientoRoutes from '../routes/movimiento_routes.js';

const app = express();

// Middleware para parsear JSON en las peticiones
app.use(express.json());

// --- MIDDLEWARES GLOBALES ---
app.use(cors()); // Habilitar CORS

// Montaje de las rutas bajo el prefijo '/api'
app.use('/api', productoRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API Rastreador de Caducidad está funcionando. Use /api/productos y /api/alertas.');
});

// --- RUTAS ---
app.use('/api/productos', productoRoutes); 
app.use('/api/auth', authRoutes);         // Montar rutas de Autenticación
// --- NUEVA INTEGRACIÓN DE RUTAS DE MOVIMIENTO ---
app.use('/api/movimientos', movimientoRoutes); // Montar rutas de Movimiento

// --- RUTA RAIZ (PARA VERIFICACIÓN) ---
app.get('/api', (req, res) => {
    res.json({ message: 'API Rastreador de Caducidad activa.', version: '1.0' });
});

// --- MANEJO DE ERRORES (Middleware final) ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal en el servidor.');
});
export default app;
