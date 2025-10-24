// data/models/movimiento_model.js

// Importa solo la función query de tu db_config.js
import { query } from '../config/db_config.js'; 

const Movimiento = {
    /**
     * Crea un nuevo registro de movimiento en la base de datos.
     * @param {Object} movimientoData - Datos del movimiento.
     * @returns {Promise<Object>} Resultado de la inserción.
     */
    crearMovimiento: async (movimientoData) => {
        const {
            id_producto,
            tipo,
            cantidad,
            id_usuario
        } = movimientoData;

        // La tabla tiene id_movimiento, tipo, cantidad, fecha, id_producto, id_usuario
        // Usamos NOW() de MySQL para la columna 'fecha'.
        const sql = `
            INSERT INTO movimiento (tipo, cantidad, fecha, id_producto, id_usuario)
            VALUES (?, ?, NOW(), ?, ?)
        `; 
        
        // Los parámetros para la consulta, en el orden de los placeholders (?)
        const params = [tipo, cantidad, id_producto, id_usuario];

        try {
            // Usamos tu función query() que ya maneja pool.execute()
            const result = await query(sql, params);
            
            // La librería mysql2/promise devuelve propiedades como 'insertId'
            // en el primer elemento del array para consultas INSERT.
            return result; 
            
        } catch (error) {
            console.error("Error en MovimientoModel.crearMovimiento:", error);
            // Propagar el error para que el controlador lo maneje
            throw error;
        }
    },
    
    /**
     * Obtiene todos los registros de movimientos, ordenados por fecha descendente.
     * @returns {Promise<Array>} Lista de objetos de movimiento.
     */
    obtenerTodosLosMovimientos: async () => {
        // Consulta que une las tablas para mostrar el nombre del producto y el ID del usuario
        const sql = `
            SELECT 
                m.id_movimiento,
                m.tipo,
                m.cantidad,
                m.fecha,
                m.id_producto,
                p.nombre AS nombre_producto,
                m.id_usuario
            FROM movimiento m
            INNER JOIN producto p ON m.id_producto = p.id_producto
            ORDER BY m.fecha DESC;
        `;

        try {
            const movimientos = await query(sql);
            return movimientos;
        } catch (error) {
            console.error("Error en MovimientoModel.obtenerTodosLosMovimientos:", error);
            throw error;
        }
    }
};

export default Movimiento;