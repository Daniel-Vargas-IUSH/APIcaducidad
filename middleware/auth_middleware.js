import jwt from 'jsonwebtoken';

// 🔑 CLAVE SECRETA ÚNICA: Debe COINCIDIR EXACTAMENTE con la del auth_controller.js
const SECRET_KEY_TEMP = 'clave-secreta-fuerte-para-jwt'; 
const SECRET_KEY = process.env.JWT_SECRET || SECRET_KEY_TEMP; 

// Middleware para verificar el token JWT y el rol de Administrador
export const verifyAdmin = (req, res, next) => {
    // 1. Obtener el token del encabezado (Header)
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        // Si no hay token, el usuario no está autenticado
        return res.status(401).json({ error: "Acceso denegado. No se proporcionó token." });
    }

    try {
        // 2. Verificar y decodificar el token, usando la clave correcta (SECRET_KEY)
        const decoded = jwt.verify(token, SECRET_KEY);
        
        // 3. Verificar el Rol (Autorización)
        // 💡 CORRECCIÓN: Usar .toLowerCase() para aceptar 'Admin', 'admin', etc.
        if (decoded.rol.toLowerCase() !== 'admin') { 
            return res.status(403).json({ error: "Acceso denegado. Se requiere rol de Administrador." });
        }

        // Adjuntar el usuario decodificado a la solicitud y continuar
        req.user = decoded; 
        next(); 

    } catch (error) {
        // Error si el token no es válido (firma incorrecta, expirado, etc.)
        // Aquí se resolverá el error de "signature verification failed"
        return res.status(401).json({ error: "Token inválido o expirado." });
    }
};

// Middleware básico para solo verificar que el usuario esté logueado (sin verificar rol específico)
export const verifyAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Acceso denegado. No se proporcionó token." });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; 
        next(); 

    } catch (error) {
        return res.status(401).json({ error: "Token inválido o expirado." });
    }
};