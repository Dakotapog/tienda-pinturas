// cart.js

/* global API_BASE_URL, showNotification */ 

// ⚠️ CAMBIO CRÍTICO: Declarar cart como variable local, no global
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Funciones del carrito de compras

// Actualizar visualización del carrito
function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Guardar en localStorage cada vez que se actualiza
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Mostrar/ocultar modal del carrito
function toggleCart() {
    const modal = document.getElementById('cart-modal');
    const isVisible = modal.style.display === 'block';
    
    if (isVisible) {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'block';
        displayCartItems();
    }
}

// Mostrar items del carrito
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Tu carrito está vacío</p>';
        cartTotalElement.textContent = '0';
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p>$${item.price.toLocaleString()} x ${item.quantity}</p>
            </div>
            <div>
                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
                <button onclick="removeFromCart(${item.id})" style="margin-left: 10px; color: red;">🗑️</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    cartTotalElement.textContent = total.toLocaleString();
}

// Cambiar cantidad de un producto - ✅ FUNCIÓN USADA
function changeQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartDisplay();
        displayCartItems();
    }
}

// Remover producto del carrito
function removeFromCart(productId) {
    // ⚠️ CAMBIO: Usar splice en lugar de reasignación
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
        cart.splice(index, 1);
    }
    updateCartDisplay();
    displayCartItems();
    showNotification('Producto eliminado del carrito');
}

// Finalizar compra - ✅ FUNCIÓN USADA
async function checkout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/cart/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: cart })
        });
        
        if (response.ok) {
            alert('¡Compra realizada con éxito!');
            // ⚠️ CAMBIO: Limpiar array sin reasignación
            cart.splice(0, cart.length);
            updateCartDisplay();
            toggleCart();
        } else {
            alert('Error al procesar la compra');
        }
    } catch (error) {
        console.error('Error en checkout:', error);
        alert('¡Compra simulada realizada con éxito!');
        // ⚠️ CAMBIO: Limpiar array sin reasignación
        cart.splice(0, cart.length);
        updateCartDisplay();
        toggleCart();
    }
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('cart-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Hacer funciones disponibles globalmente
window.changeQuantity = changeQuantity;
window.removeFromCart = removeFromCart;
window.checkout = checkout;
window.toggleCart = toggleCart;