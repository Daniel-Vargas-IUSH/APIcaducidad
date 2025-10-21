// models/producto_model.js
import { query } from '../config/db_config.js';

// NOTA: Las columnas en la DB son: id_producto, nombre, cantidad, fecha_caducidad, ubicacion, fecha_ingreso

export const ProductoModel = {
    
    findAll: async () => {
        const sql = `SELECT * FROM Producto`;
        return query(sql);
    },

    findById: async (id) => {
        const sql = `SELECT * FROM Producto WHERE id_producto = ?`;
        const [producto] = await query(sql, [id]);
        return producto; // Retorna el primer resultado o undefined
    },

    create: async (data) => {
        const { nombre, cantidad, fecha_caducidad, ubicacion } = data;
        const sql = `
            INSERT INTO Producto (nombre, cantidad, fecha_caducidad, ubicacion, fecha_ingreso) 
            VALUES (?, ?, ?, ?, CURDATE())
        `;
        const result = await query(sql, [nombre, cantidad, fecha_caducidad, ubicacion]);
        
        // Retorna el producto recién creado
        return ProductoModel.findById(result.insertId);
    },

    update: async (id, data) => {
        // Construcción dinámica del query de UPDATE
        const updates = [];
        const params = [];
        
        for (const key in data) {
            if (['nombre', 'cantidad', 'fecha_caducidad', 'ubicacion'].includes(key)) {
                updates.push(`${key} = ?`);
                params.push(data[key]);
            }
        }

        if (updates.length === 0) {
            return ProductoModel.findById(id); // Nada que actualizar
        }

        params.push(id);
        const sql = `UPDATE Producto SET ${updates.join(', ')} WHERE id_producto = ?`;
        
        await query(sql, params);
        return ProductoModel.findById(id);
    },

    remove: async (id) => {
        // Primero, eliminamos movimientos relacionados para evitar errores de FK
        await query(`DELETE FROM Movimiento WHERE id_producto = ?`, [id]);
        
        // Luego, eliminamos el producto
        const sql = `DELETE FROM Producto WHERE id_producto = ?`;
        const result = await query(sql, [id]);
        return result.affectedRows > 0;
    }
};