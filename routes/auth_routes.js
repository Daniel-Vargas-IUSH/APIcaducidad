// routes/auth_routes.js
import express from 'express';
import * as authController from '../controllers/auth_controller.js';

const router = express.Router();

// Rutas de autenticación
router.post('/register', authController.register); // POST /api/auth/register
router.post('/login', authController.login);       // POST /api/auth/login

export default router;
