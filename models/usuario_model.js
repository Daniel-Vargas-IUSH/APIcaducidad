// models/usuario_model.js
import { query } from '../config/db_config.js';
import bcrypt from 'bcrypt';

// Funciones para interactuar con la tabla Usuario

/**
 * Busca un usuario por su ID.
 * @param {number} id - ID del usuario.
 * @returns {Promise<object|null>} Los datos del usuario o null si no existe.
 */
export const findById = async (id) => {
    const sql = 'SELECT id_usuario, nombre, rol, usuario_login FROM Usuario WHERE id_usuario = ?';
    const rows = await query(sql, [id]);
    return rows[0] || null;
};

/**
 * Busca un usuario por su nombre de login.
 * Se utiliza para el proceso de login.
 * @param {string} usuarioLogin - Nombre de usuario (login).
 * @returns {Promise<object|null>} Los datos del usuario (incluyendo contraseña hasheada) o null.
 */
export const findByLogin = async (usuarioLogin) => {
    const sql = 'SELECT id_usuario, nombre, rol, usuario_login, contrasena FROM Usuario WHERE usuario_login = ?';
    const rows = await query(sql, [usuarioLogin]);
    return rows[0] || null;
};

/**
 * Crea un nuevo usuario en la base de datos.
 * La contraseña se hashea antes de ser guardada.
 * @param {string} nombre - Nombre completo del usuario.
 * @param {string} rol - Rol del usuario (e.g., Administrador, Operador).
 * @param {string} usuarioLogin - Nombre de usuario único para login.
 * @param {string} contrasena - Contraseña en texto plano.
 * @returns {Promise<number>} ID del nuevo usuario creado.
 */
export const createUser = async (nombre, rol, usuarioLogin, contrasena) => {
    // 1. Hashear la contraseña de forma asíncrona
    const hashedPassword = await bcrypt.hash(contrasena, 10); // 10 es el costo del salt

    // 2. Insertar el usuario
    const sql = 'INSERT INTO Usuario (nombre, rol, usuario_login, contrasena) VALUES (?, ?, ?, ?)';
    const result = await query(sql, [nombre, rol, usuarioLogin, hashedPassword]);

    // Devolvemos el ID insertado
    return result.insertId;
};

/**
 * Compara una contraseña en texto plano con la contraseña hasheada almacenada.
 * @param {string} plainPassword - Contraseña en texto plano ingresada por el usuario.
 * @param {string} hashedPassword - Contraseña hasheada almacenada en la DB.
 * @returns {Promise<boolean>} True si coinciden, false en caso contrario.
 */
export const comparePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};