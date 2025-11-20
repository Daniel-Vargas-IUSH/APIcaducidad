// routes/producto_routes.js (VERSIÓN FINAL CORREGIDA)

import express from 'express';
import { 
    getAllProducts, getProductById, createProduct, 
    updateProduct, deleteProduct, getAlerts 
} from '../controllers/producto_controller.js';
// 🔑 1. IMPORTAR EL MIDDLEWARE DE SEGURIDAD
import { verifyAdmin, verifyAuth } from '../middleware/auth_middleware.js'; 

const router = express.Router();

// Rutas CRUD básicas (Ruta base: '/')
// GET /api/productos
// POST /api/productos
router.route('/')
    .get(verifyAuth, getAllProducts) // 💡 Requiere Auth para ver la lista
    .post(verifyAdmin, createProduct); // 🔒 2. APLICAR verifyAdmin (POST)

// Rutas con ID (Ruta: '/:id_producto')
// GET /api/productos/:id_producto
// PUT /api/productos/:id_producto
// DELETE /api/productos/:id_producto
router.route('/:id_producto')
    .get(verifyAuth, getProductById) // 💡 Requiere Auth para ver detalle
    .put(verifyAdmin, updateProduct)    // 🔒 2. APLICAR verifyAdmin (PUT)
    .delete(verifyAdmin, deleteProduct); // 🔒 2. APLICAR verifyAdmin (DELETE)

// Ruta Diferencial: Alertas (Ruta: '/alertas')
// GET /api/productos/alertas
router.route('/alertas')
    .get(verifyAuth, getAlerts); // 🔒 Requiere Auth para ver alertas

export default router;