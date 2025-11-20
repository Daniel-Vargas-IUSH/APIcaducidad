// routes/movimiento_routes.js

import express from 'express';
import movimientoController from '../controllers/movimiento_controller.js';
// 🔑 CORRECCIÓN: Usar la ruta y nombres correctos confirmados por tu ejemplo.
import { verifyAdmin, verifyAuth } from '../middleware/auth_middleware.js'; 

const router = express.Router();

// Define la ruta POST para crear un movimiento
// 🔒 RESTRICCIÓN: Solo Admin puede registrar movimientos (requiere estar logueado y ser Admin)
router.post('/', verifyAuth, verifyAdmin, movimientoController.registrarMovimiento);

// Ruta para obtener todos los movimientos
// 💡 PROTECCIÓN: Solo usuarios logueados pueden ver el historial
router.get('/', verifyAuth, movimientoController.obtenerMovimientos);

export default router;