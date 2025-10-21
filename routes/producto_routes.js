// routes/producto_routes.js
import express from 'express';
import { 
    getAllProducts, getProductById, createProduct, 
    updateProduct, deleteProduct, getAlerts 
} from '../controllers/producto_controller.js';

const router = express.Router();

// Rutas CRUD básicas
// GET /api/productos -> Obtener todos los productos
// POST /api/productos -> Crear nuevo producto
router.route('/productos')
    .get(getAllProducts)
    .post(createProduct);

// GET /api/productos/:id_producto -> Obtener por ID
// PUT /api/productos/:id_producto -> Actualizar por ID
// DELETE /api/productos/:id_producto -> Eliminar por ID
router.route('/productos/:id_producto')
    .get(getProductById)
    .put(updateProduct)
    .delete(deleteProduct);

// Ruta Diferencial: Alertas
// GET /api/alertas -> Obtener alertas rojas y amarillas
router.route('/alertas')
    .get(getAlerts);

export default router;
