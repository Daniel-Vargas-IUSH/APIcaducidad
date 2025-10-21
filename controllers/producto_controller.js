// controllers/producto_controller.js
import { ProductoModel } from '../models/producto_model.js';

// Función auxiliar para calcular el estado de caducidad
const getExpirationStatus = (fechaCaducidad) => {
    if (!fechaCaducidad) {
        return 'Sin Fecha';
    }

    // MySQL devuelve la fecha como string 'YYYY-MM-DD'
    const expirationDate = new Date(fechaCaducidad);
    const today = new Date();
    
    // Resetear las horas para comparar solo días
    expirationDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = expirationDate.getTime() - today.getTime();
    const daysUntilExpiration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysUntilExpiration < 0) {
        return 'Expirado';
    } else if (daysUntilExpiration <= 7) {
        return 'Roja'; // Caduca en 7 días o menos
    } else if (daysUntilExpiration <= 30) {
        return 'Amarilla'; // Caduca entre 8 y 30 días
    } else {
        return 'Verde'; // Caduca en más de 30 días
    }
};

// Extiende los datos del producto con el estado de alerta
const enrichProductData = (producto) => {
    const estado_alerta = getExpirationStatus(producto.fecha_caducidad);
    return {
        ...producto,
        estado_alerta
    };
};

// --- CRUD Handlers ---

export const getAlerts = async (req, res) => {
    try {
        const productos = await ProductoModel.findAll();
        const productosEnriquecidos = productos.map(enrichProductData);

        const alerta_roja = [];
        const alerta_amarilla = [];

        for (const p of productosEnriquecidos) {
            if (p.estado_alerta === 'Roja') {
                alerta_roja.push(p);
            } else if (p.estado_alerta === 'Amarilla') {
                alerta_amarilla.push(p);
            }
        }

        return res.json({
            alerta_roja,
            alerta_amarilla,
            explicacion: 'Roja: Caduca en <= 7 días. Amarilla: Caduca en 8 a 30 días.'
        });
    } catch (error) {
        console.error("Error al obtener alertas:", error);
        res.status(500).json({ error: 'Error interno del servidor al procesar alertas.' });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const productos = await ProductoModel.findAll();
        const productosEnriquecidos = productos.map(enrichProductData);
        res.json(productosEnriquecidos);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

export const getProductById = async (req, res) => {
    try {
        const id = req.params.id_producto;
        const producto = await ProductoModel.findById(id);

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        res.json(enrichProductData(producto));
    } catch (error) {
        console.error("Error al obtener producto por ID:", error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

export const createProduct = async (req, res) => {
    const data = req.body;
    
    if (!data.nombre || !data.fecha_caducidad) {
        return res.status(400).json({ error: 'Faltan campos obligatorios (nombre, fecha_caducidad).' });
    }

    try {
        const newProduct = await ProductoModel.create(data);
        res.status(201).json(enrichProductData(newProduct));
    } catch (error) {
        console.error("Error al crear producto:", error);
        res.status(500).json({ error: 'Error al insertar producto en la base de datos.' });
    }
};

export const updateProduct = async (req, res) => {
    const id = req.params.id_producto;
    const data = req.body;
    
    try {
        const updatedProduct = await ProductoModel.update(id, data);
        
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }
        
        res.json(enrichProductData(updatedProduct));
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).json({ error: 'Error al actualizar producto en la base de datos.' });
    }
};

export const deleteProduct = async (req, res) => {
    const id = req.params.id_producto;
    try {
        const deleted = await ProductoModel.remove(id);
        
        if (!deleted) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }
        
        res.json({ message: `Producto con ID ${id} eliminado con éxito.` });
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).json({ error: 'Error al eliminar producto.' });
    }
};