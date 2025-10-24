// controllers/auth_controller.js
import * as UsuarioModel from '../models/usuario_model.js';
import jwt from 'jsonwebtoken';

// 🚨🚨🚨 ADVERTENCIA: CLAVE SECRETA TEMPORAL HARDCODEADA 🚨🚨🚨
// ESTO ES SOLO PARA QUE EL CÓDIGO FUNCIONE SIN EL ARCHIVO .env.
// DEBE SER ELIMINADO Y SUSTITUIDO POR process.env.JWT_SECRET en producción.
const JWT_SECRET_TEMP = 'clave-secreta-fuerte-para-jwt';
const JWT_SECRET = process.env.JWT_SECRET || JWT_SECRET_TEMP;
// 🚨🚨🚨 FIN DE LA ADVERTENCIA 🚨🚨🚨

/**
 * Registra un nuevo usuario.
 * POST /api/auth/register
 */
export const register = async (req, res) => {
    const { nombre, rol, usuario_login, contrasena } = req.body;

    // Validación básica
    if (!usuario_login || !contrasena) {
        return res.status(400).json({ error: 'Faltan usuario_login o contraseña.' });
    }

    try {
        // 1. Verificar si el usuario ya existe
        const existingUser = await UsuarioModel.findByLogin(usuario_login);
        if (existingUser) {
            return res.status(409).json({ error: 'El nombre de usuario ya está en uso.' });
        }

        // 2. Crear el usuario (la contraseña se hashea dentro del modelo)
        const newUserId = await UsuarioModel.createUser(nombre, rol || 'Operador', usuario_login, contrasena);

        // 3. Devolver respuesta exitosa
        return res.status(201).json({ 
            message: 'Usuario registrado exitosamente', 
            id_usuario: newUserId 
        });

    } catch (error) {
        console.error('Error al registrar usuario:', error);
        return res.status(500).json({ error: 'Error interno del servidor al registrar usuario.' });
    }
};

/**
 * Autentica un usuario y genera un JWT.
 * POST /api/auth/login
 */
export const login = async (req, res) => {
    const { usuario_login, contrasena } = req.body;

    if (!usuario_login || !contrasena) {
        return res.status(400).json({ error: 'Faltan usuario_login o contraseña.' });
    }

    try {
        // 1. Buscar el usuario en la DB
        const user = await UsuarioModel.findByLogin(usuario_login);

        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // 2. Comparar la contraseña ingresada con la hasheada
        const isPasswordValid = await UsuarioModel.comparePassword(contrasena, user.contrasena);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // 3. Generar el JWT
        const token = jwt.sign(
            { id: user.id_usuario, rol: user.rol }, 
            JWT_SECRET, 
            { expiresIn: '1h' } // Token expira en 1 hora
        );

        // 4. Devolver el token y datos del usuario (sin contraseña)
        return res.json({
            token,
            user: {
                id_usuario: user.id_usuario,
                nombre: user.nombre,
                rol: user.rol,
                usuario_login: user.usuario_login
            }
        });

    } catch (error) {
        console.error('Error durante el login:', error);
        return res.status(500).json({ error: 'Error interno del servidor durante el login.' });
    }
};
