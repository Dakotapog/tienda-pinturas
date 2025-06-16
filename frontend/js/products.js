// frontend/js/products.js - Interfaz de Usuario para Productos
class ProductsManager {
    constructor() {
        this.products = [];
        this.currentCategory = 'all';
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.init();
    }

    async init() {
        console.log('🎨 Inicializando ProductsManager...');
        this.bindEvents();
        await this.loadProducts();
        this.renderProducts();
    }

    bindEvents() {
        // Event listeners para interacciones del usuario
        document.addEventListener('DOMContentLoaded', () => {
            // Botones de categoría
            const categoryButtons = document.querySelectorAll('.category-btn');
            categoryButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.filterByCategory(e.target.dataset.category);
                });
            });

            // Formulario de búsqueda
            const searchForm = document.getElementById('search-form');
            if (searchForm) {
                searchForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const query = document.getElementById('search-input').value;
                    this.searchProducts(query);
                });
            }
        });
    }

    async loadProducts() {
        try {
            console.log('📦 Cargando productos desde API...');
            const response = await fetch('/api/products');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.products = await response.json();
            console.log(`✅ ${this.products.length} productos cargados exitosamente`);
            
        } catch (error) {
            console.error('❌ Error al cargar productos:', error);
            this.showError('Error al cargar productos. Intenta recargar la página.');
        }
    }

    async searchProducts(query) {
        if (!query.trim()) {
            await this.loadProducts();
            this.renderProducts();
            return;
        }

        try {
            console.log(`🔍 Buscando productos: "${query}"`);
            const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.products = await response.json();
            console.log(`🔍 ${this.products.length} productos encontrados`);
            this.renderProducts();
            
        } catch (error) {
            console.error('❌ Error en búsqueda:', error);
            this.showError('Error en la búsqueda. Intenta de nuevo.');
        }
    }

    filterByCategory(category) {
        this.currentCategory = category;
        this.renderProducts();
        
        // Actualizar UI de categorías
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`)?.classList.add('active');
    }

    renderProducts() {
        const container = document.getElementById('products-container');
        if (!container) {
            console.warn('⚠️ Contenedor de productos no encontrado');
            return;
        }

        // Filtrar productos por categoría
        let filteredProducts = this.products;
        if (this.currentCategory !== 'all') {
            filteredProducts = this.products.filter(product => 
                product.category === this.currentCategory
            );
        }

        // Renderizar productos
        if (filteredProducts.length === 0) {
            container.innerHTML = `
                <div class="no-products">
                    <h3>No se encontraron productos</h3>
                    <p>Intenta con una búsqueda diferente o selecciona otra categoría.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredProducts.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image || '/images/default-paint.jpg'}" 
                         alt="${product.name}" 
                         onerror="this.src='/images/default-paint.jpg'">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-details">
                        <span class="product-brand">${product.brand || 'Sin marca'}</span>
                        <span class="product-category">${product.category || 'General'}</span>
                    </div>
                    <div class="product-footer">
                        <span class="product-price">$${product.price}</span>
                        <button class="add-to-cart-btn" 
                                onclick="addToCart(${product.id})"
                                ${product.stock <= 0 ? 'disabled' : ''}>
                            ${product.stock <= 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                        </button>
                    </div>
                    ${product.stock <= 5 && product.stock > 0 ? 
                        `<div class="low-stock">¡Últimas ${product.stock} unidades!</div>` : ''}
                </div>
            </div>
        `).join('');

        console.log(`🎨 ${filteredProducts.length} productos renderizados`);
    }

    showError(message) {
        const container = document.getElementById('products-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h3>⚠️ Error</h3>
                    <p>${message}</p>
                    <button onclick="window.productsManager.loadProducts()">
                        Reintentar
                    </button>
                </div>
            `;
        }
    }

    // Método para refrescar productos (usado por el carrito)
    async refresh() {
        await this.loadProducts();
        this.renderProducts();
    }
}

// Función global para agregar al carrito (llamada desde los botones)
async function addToCart(productId) {
    try {
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                product_id: productId,
                quantity: 1
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Producto agregado al carrito:', result);
        
        // Mostrar notificación
        showNotification('Producto agregado al carrito exitosamente', 'success');
        
        // Actualizar contador del carrito si existe
        if (window.cartManager) {
            window.cartManager.updateCartCount();
        }
        
    } catch (error) {
        console.error('❌ Error al agregar al carrito:', error);
        showNotification('Error al agregar producto al carrito', 'error');
    }
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto-remover después de 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM listo, inicializando ProductsManager...');
    window.productsManager = new ProductsManager();
});

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductsManager;
}