// controllers/movimiento_controller.js

import Movimiento from '../models/movimiento_model.js';

const movimientoController = {
    /**
     * Maneja la solicitud POST para registrar un nuevo movimiento de inventario.
     */
    registrarMovimiento: async (req, res) => {
        const { id_producto, tipo, cantidad, id_usuario } = req.body;

        // --- VALIDACIÓN BÁSICA ---
        if (!id_producto || !tipo || !cantidad || !id_usuario) {
            return res.status(400).json({
                mensaje: "Faltan datos requeridos: id_producto, tipo, cantidad, o id_usuario."
            });
        }
        
        // Asumiendo que 'tipo' es una cadena ('entrada' o 'salida')
        // y 'cantidad' es un número
        if (typeof cantidad !== 'number' || cantidad <= 0) {
             return res.status(400).json({
                mensaje: "La cantidad debe ser un número positivo."
            });
        }


        const movimientoData = { id_producto, tipo, cantidad, id_usuario };

        try {
            // Llama al modelo para insertar el movimiento
            const resultado = await Movimiento.crearMovimiento(movimientoData);

            // Nota: Aquí iría la lógica adicional para actualizar el stock del producto
            
            // mysql2/promise devuelve el insertId en el objeto resultante
            res.status(201).json({
                mensaje: "Movimiento registrado exitosamente",
                id_movimiento: resultado.insertId 
            });

        } catch (error) {
            console.error("Error al registrar movimiento:", error);
            // Error 500 para errores internos (ej. base de datos)
            res.status(500).json({
                mensaje: "Error interno del servidor al registrar el movimiento.",
                error: error.message
            });
        }

        
    },

    /**
     * Maneja la solicitud GET para obtener todos los movimientos de inventario.
     * Endpoint: GET /api/movimientos
     */
    obtenerMovimientos: async (req, res) => {
        try {
            const movimientos = await Movimiento.obtenerTodosLosMovimientos();
            
            res.status(200).json({
                mensaje: "Movimientos obtenidos exitosamente",
                data: movimientos
            });
            
        } catch (error) {
            console.error("Error al obtener movimientos:", error);
            res.status(500).json({
                mensaje: "Error interno del servidor al obtener los movimientos.",
                error: error.message
            });
        }
    }
    
    
};

export default movimientoController;