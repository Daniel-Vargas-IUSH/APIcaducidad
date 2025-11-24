import jwt from 'jsonwebtoken';

// 🔑 CORRECCIÓN: Usar la misma convención de nombres que en auth_controller.js.
// El valor debe ser IDÉNTICO en ambos archivos si no se usa .env.
const JWT_SECRET_TEMP = 'clave-secreta-fuerte-para-jwt'; 
const JWT_SECRET = process.env.JWT_SECRET || JWT_SECRET_TEMP; 

// Middleware para verificar el token JWT y el rol de Administrador
export const verifyAdmin = (req, res, next) => {
    // ... (El código interno es correcto)
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Acceso denegado. No se proporcionó token." });
    }

    try {
        // Usar JWT_SECRET (que es la misma clave de firma)
        const decoded = jwt.verify(token, JWT_SECRET); 
        
        if (decoded.rol.toLowerCase() !== 'admin') { 
            return res.status(403).json({ error: "Acceso denegado. Se requiere rol de Administrador." });
        }

        req.user = decoded; 
        next(); 

    } catch (error) {
        return res.status(401).json({ error: "Token inválido o expirado." });
    }
};

// Middleware básico para solo verificar que el usuario esté logueado
export const verifyAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Acceso denegado. No se proporcionó token." });
    }

    try {
        // Usar JWT_SECRET (que es la misma clave de firma)
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; 
        next(); 

    } catch (error) {
        return res.status(401).json({ error: "Token inválido o expirado." });
    }
};