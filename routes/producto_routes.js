import express from 'express';
import { 
    getAllProducts, getProductById, createProduct, 
    updateProduct, deleteProduct, getAlerts 
} from '../controllers/producto_controller.js';
// Importar el middleware de seguridad
import { verifyAdmin, verifyAuth } from '../middleware/auth_middleware.js'; 

const router = express.Router();

// ==========================================================
// 1. RUTA ESPECÍFICA (¡DEBE IR PRIMERO!)
// ==========================================================
// Ruta Diferencial: Alertas (Ruta: '/alertas')
// GET /api/productos/alertas
router.route('/alertas')
    .get(getAlerts); // ✅ YA NO REQUIERE 'verifyAuth' para obtener alertas.


// ==========================================================
// 2. RUTAS DE BASE Y CON ID (ESTAS VAN DESPUÉS)
// ==========================================================

// Rutas CRUD básicas (Ruta base: '/')
// GET /api/productos
// POST /api/productos
router.route('/')
    .get(verifyAuth, getAllProducts) // 💡 Requiere Auth para ver la lista
    .post(verifyAdmin, createProduct); // 🔒 Aplicar verifyAdmin (POST)

// Rutas con ID (Ruta: '/:id_producto')
// ESTA RUTA DEBE IR DESPUÉS DE '/alertas'
router.route('/:id_producto')
    .get(verifyAuth, getProductById) // 💡 Requiere Auth para ver detalle
    .put(verifyAdmin, updateProduct)    // 🔒 Aplicar verifyAdmin (PUT)
    .delete(verifyAdmin, deleteProduct); // 🔒 Aplicar verifyAdmin (DELETE)

export default router;