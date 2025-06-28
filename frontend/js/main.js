// main.js

/* global updateCartDisplay, showNotification */ // ← Declaramos las funciones globales usadas

// Variables globales
let products = [];
let cart = [];

// URLs de la API
const API_BASE_URL = 'http://localhost:3000/api';

// Cargar productos al iniciar la página
document.addEventListener('DOMContentLoaded', async () => {
    await loadProducts();
    updateCartDisplay();
});

// Función para cargar productos desde la API
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        products = await response.json();
        displayProducts();
    } catch (error) {
        console.error('Error cargando productos:', error);
        // Datos de ejemplo si falla la API
        products = [
            {
                id: 1,
                name: 'Pintura Roja Concentrada',
                price: 45000,
                image: 'https://via.placeholder.com/300x200/FF0000/FFFFFF?text=Rojo',
                description: 'Galón de pintura roja concentrada de alta calidad'
            },
            {
                id: 2,
                name: 'Pintura Azul Concentrada',
                price: 42000,
                image: 'https://via.placeholder.com/300x200/0000FF/FFFFFF?text=Azul',
                description: 'Galón de pintura azul concentrada de alta calidad'
            },
            {
                id: 3,
                name: 'Pintura Verde Concentrada',
                price: 44000,
                image: 'https://via.placeholder.com/300x200/00FF00/000000?text=Verde',
                description: 'Galón de pintura verde concentrada de alta calidad'
            },
            {
                id: 4,
                name: 'Pintura Amarilla Concentrada',
                price: 43000,
                image: 'https://via.placeholder.com/300x200/FFFF00/000000?text=Amarillo',
                description: 'Galón de pintura amarilla concentrada de alta calidad'
            }
        ];
        displayProducts();
    }
}

// Función para mostrar productos en el HTML
function displayProducts() {
    const container = document.getElementById('products-container');
    container.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">$${product.price.toLocaleString()}</div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                Agregar al Carrito
            </button>
        `;
        container.appendChild(productCard);
    });
}

// Función para agregar producto al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartDisplay();
    showNotification('Producto agregado al carrito');
}

// Función para mostrar notificaciones
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #00b894;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
