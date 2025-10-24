// routes/movimiento_routes.js

import express from 'express';
import movimientoController from '../controllers/movimiento_controller.js';

const router = express.Router();

// Define la ruta POST para crear un movimiento
router.post('/', movimientoController.registrarMovimiento);

// Ruta para obtener todos los movimientos
// GET /api/movimientos
router.get('/', movimientoController.obtenerMovimientos);

export default router;