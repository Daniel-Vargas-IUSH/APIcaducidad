// config/db_config.js
import mysql from 'mysql2/promise';

// --- CONFIGURACIÓN DE CONEXIÓN MYSQL ---
// ¡IMPORTANTE! Reemplace estos valores con sus credenciales de MySQL Workbench.
const pool = mysql.createPool({
    host: 'localhost',      // O su dirección IP de MySQL
    user: '[USUARIO]',      // Por ejemplo: 'root'
    password: '[CONTRASEÑA]', // Su contraseña de MySQL
    database: '[BASE_DE_DATOS]', // El nombre de la base de datos (Ej: 'inventario_caducidad')
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Función de utilidad para ejecutar queries
export const query = async (sql, params) => {
    const [rows] = await pool.execute(sql, params);
    return rows;
};
