// app.js
import express from 'express';
import productoRoutes from '../routes/producto_routes.js';

const app = express();

// Middleware para parsear JSON en las peticiones
app.use(express.json());

// Montaje de las rutas bajo el prefijo '/api'
app.use('/api', productoRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API Rastreador de Caducidad está funcionando. Use /api/productos y /api/alertas.');
});

export default app;
