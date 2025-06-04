const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Datos de ejemplo (simula base de datos)
let products = [
    {
        id: 1,
        name: 'Pintura Roja Concentrada',
        price: 45000,
        image: 'https://via.placeholder.com/300x200/FF0000/FFFFFF?text=Rojo',
        description: 'Galón de pintura roja concentrada de alta calidad',
        stock: 50
    },
    {
        id: 2,
        name: 'Pintura Azul Concentrada',
        price: 42000,
        image: 'https://via.placeholder.com/300x200/0000FF/FFFFFF?text=Azul',
        description: 'Galón de pintura azul concentrada de alta calidad',
        stock: 30
    },
    {
        id: 3,
        name: 'Pintura Verde Concentrada',
        price: 44000,
        image: 'https://via.placeholder.com/300x200/00FF00/000000?text=Verde',
        description: 'Galón de pintura verde concentrada de alta calidad',
        stock: 25
    },
    {
        id: 4,
        name: 'Pintura Amarilla Concentrada',
        price: 43000,
        image: 'https://via.placeholder.com/300x200/FFFF00/000000?text=Amarillo',
        description: 'Galón de pintura amarilla concentrada de alta calidad',
        stock: 40
    },
    {
        id: 5,
        name: 'Pintura Negra Concentrada',
        price: 41000,
        image: 'https://via.placeholder.com/300x200/000000/FFFFFF?text=Negro',
        description: 'Galón de pintura negra concentrada de alta calidad',
        stock: 35
    },
    {
        id: 6,
        name: 'Pintura Blanca Concentrada',
        price: 40000,
        image: 'https://via.placeholder.com/300x200/FFFFFF/000000?text=Blanco',
        description: 'Galón de pintura blanca concentrada de alta calidad',
        stock: 60
    }
];

let orders = [];

// Rutas de la API

// Obtener todos los productos
app.get('/api/products', (req, res) => {
    res.json(products);
});

// Obtener un producto específico
app.get('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

// Procesar compra (checkout)
app.post('/api/cart/checkout', (req, res) => {
    const { items } = req.body;
    
    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Carrito vacío' });
    }
    
    // Calcular total
    let total = 0;
    const orderItems = [];
    
    for (const item of items) {
        const product = products.find(p => p.id === item.id);
        if (product && product.stock >= item.quantity) {
            total += product.price * item.quantity;
            orderItems.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            });
            
            // Reducir stock (simulado)
            product.stock -= item.quantity;
        }
    }
    
    // Crear orden
    const order = {
        id: orders.length + 1,
        items: orderItems,
        total: total,
        date: new Date().toISOString(),
        status: 'completada'
    };
    
    orders.push(order);
    
    res.json({
        success: true,
        order: order,
        message: 'Compra procesada exitosamente'
    });
});

// Obtener todas las órdenes
app.get('/api/orders', (req, res) => {
    res.json(orders);
});

// Ruta para servir el frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`📊 API disponible en http://localhost:${PORT}/api`);
});