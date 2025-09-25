// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check login status and update UI
    updateLoginUI();
    
    // ... باقي الكود الحالي ...
});

// Function to update UI based on login status
function updateLoginUI() {
    const userInfo = JSON.parse(localStorage.getItem('techBazzarUser'));
    const navRight = document.querySelector('.nav-right');
    
    if (userInfo) {
        // User is logged in - update the UI
        const loginBtnContainer = navRight.querySelector('a[href*="login.html"]');
        
        if (loginBtnContainer) {
            // Replace login button with user profile
            loginBtnContainer.outerHTML = `
                <div class="user-profile-dropdown">
                    <button class="user-profile-btn">
                        <div class="user-avatar">
                            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.name || userInfo.email)}&background=18685b&color=fff&size=32" alt="User Avatar">
                        </div>
                        <span class="user-name">${userInfo.name || userInfo.email.split('@')[0]}</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="user-dropdown-menu">
                        <div class="user-info">
                            <div class="user-avatar-large">
                                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.name || userInfo.email)}&background=18685b&color=fff&size=64" alt="User Avatar">
                            </div>
                            <div class="user-details">
                                <h4>${userInfo.name || 'User'}</h4>
                                <p>${userInfo.email}</p>
                                <span class="user-role-badge">${userInfo.role === 'seller' ? 'Seller' : 'Buyer'}</span>
                            </div>
                        </div>
                        <div class="dropdown-divider"></div>
                        <a href="#" class="dropdown-item">
                            <i class="fas fa-user"></i>
                            <span>My Profile</span>
                        </a>
                        <a href="#" class="dropdown-item">
                            <i class="fas fa-shopping-bag"></i>
                            <span>My Orders</span>
                        </a>
                        <a href="#" class="dropdown-item">
                            <i class="fas fa-heart"></i>
                            <span>Wishlist</span>
                        </a>
                        ${userInfo.role === 'seller' ? `
                        <a href="D:/frotend_projects/IN PROGRESS/e-commerce project/seller dashboard/seller dashboard.html" class="dropdown-item">
                            <i class="fas fa-store"></i>
                            <span>Seller Dashboard</span>
                        </a>
                        ` : ''}
                        <div class="dropdown-divider"></div>
                        <a href="#" class="dropdown-item" id="logoutBtn">
                            <i class="fas fa-sign-out-alt"></i>
                            <span>Logout</span>
                        </a>
                    </div>
                </div>
            `;
            
            // Add event listeners for the dropdown
            setupUserDropdown();
        }
    } else {
        // User is not logged in - ensure login button is visible
        const existingUserProfile = document.querySelector('.user-profile-dropdown');
        if (existingUserProfile) {
            existingUserProfile.outerHTML = `
                <a href="D:\\frotend_projects\\IN PROGRESS\\e-commerce project\\login\\login.html">
                    <button class="login-btn">
                        <i class="fas fa-user"></i>
                        <span>Login/Register</span>
                    </button>
                </a>
            `;
        }
    }
}

// Function to setup user dropdown functionality
function setupUserDropdown() {
    const userProfileBtn = document.querySelector('.user-profile-btn');
    const dropdownMenu = document.querySelector('.user-dropdown-menu');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (userProfileBtn && dropdownMenu) {
        userProfileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            dropdownMenu.classList.remove('show');
        });
        
        // Prevent dropdown from closing when clicking inside
        dropdownMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
        });
    }
}

// Function to handle user logout
function logoutUser() {
    // Remove user info from localStorage
    localStorage.removeItem('techBazzarUser');
    
    // Show logout success message
    const notification = document.createElement('div');
    notification.className = 'cart-notification success';
    notification.innerHTML = `
        <i class="fas fa-check"></i>
        <span>Logged out successfully!</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('active');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('active');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
            // Refresh the page to update UI
            window.location.reload();
        }, 300);
    }, 2000);
}

// ... باقي كود السلة كما هو ...

// Cart functionality
class ShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('techBazzarCart')) || [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateCartCount();
        this.renderCart();
    }

    bindEvents() {
        // Cart button click
        document.querySelector('.cart-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleCart();
        });

        // Close cart modal
        document.querySelector('.cart-close-btn').addEventListener('click', () => {
            this.closeCart();
        });

        // Close cart when clicking outside
        document.querySelector('.cart-modal-overlay').addEventListener('click', () => {
            this.closeCart();
        });

        // Continue shopping button
        document.querySelector('.btn-continue-shopping').addEventListener('click', () => {
            this.closeCart();
        });

        // Add to cart buttons
        document.querySelectorAll('.btn-add-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const productCard = e.target.closest('.product-card');
                this.addToCart(productCard);
            });
        });

        // Wishlist functionality
        document.querySelectorAll('.product-wishlist').forEach(button => {
            button.addEventListener('click', function() {
                const icon = this.querySelector('i');
                icon.classList.toggle('far');
                icon.classList.toggle('fas');
                icon.classList.toggle('active');
            });
        });

        // Filter functionality
        document.querySelectorAll('.filter-option input').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                console.log('Filter changed: ${this.id} - ${this.checked}');
            });
        });

        // Sort functionality
        document.querySelector('.sort-select').addEventListener('change', function() {
            console.log('Sort by: ${this.value}');
        });
    }

    toggleCart() {
        document.querySelector('.cart-modal').classList.toggle('active');
        document.body.style.overflow = document.querySelector('.cart-modal').classList.contains('active') ? 'hidden' : '';
    }

    closeCart() {
        document.querySelector('.cart-modal').classList.remove('active');
        document.body.style.overflow = '';
    }

    addToCart(productCard) {
        const product = {
            id: this.generateId(),
            title: productCard.querySelector('.product-title').textContent,
            category: productCard.querySelector('.product-category').textContent,
            price: parseFloat(productCard.querySelector('.product-price-current').textContent.replace('$', '')),
            image: productCard.querySelector('.product-image img').src,
            quantity: 1
        };

        // Check if product already exists in cart
        const existingItem = this.cart.find(item => item.title === product.title);
        
        if (existingItem) {
            existingItem.quantity += 1;
            this.showNotification('${product.title} quantity updated!', 'success');
        } else {
            this.cart.push(product);
            this.showNotification('${product.title} added to cart!', 'success');
        }

        this.saveCart();
        this.updateCartCount();
        this.renderCart();
        
        // Visual feedback on button
        const button = productCard.querySelector('.btn-add-cart');
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Added';
        button.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.background = 'linear-gradient(135deg, #18685b, #26575b)';
        }, 1500);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.renderCart();
        this.showNotification('Product removed from cart!', 'success');
    }

    updateQuantity(productId, newQuantity) {
        if (newQuantity < 1) {
            this.removeFromCart(productId);
            return;
        }

        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.renderCart();
        }
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    saveCart() {
        localStorage.setItem('techBazzarCart', JSON.stringify(this.cart));
    }

    updateCartCount() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCount = document.querySelector('.cart-count');
        
        cartCount.textContent = totalItems;
        cartCount.classList.add('updated');
        
        setTimeout(() => {
            cartCount.classList.remove('updated');
        }, 500);
    }

    renderCart() {
        const cartItems = document.getElementById('cartItems');
        const cartSubtotal = document.querySelector('.cart-subtotal');
        const cartShipping = document.querySelector('.cart-shipping');
        const cartTax = document.querySelector('.cart-tax');
        const cartTotal = document.querySelector('.cart-total');

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <a href="#products" class="btn-primary">Start Shopping</a>
                </div>
            `;
            this.updateTotals(0, 0, 0);
            return;
        }

        let itemsHTML = '';
        let subtotal = 0;

        this.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            itemsHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.title}</h4>
                        <span class="cart-item-category">${item.category}</span>
                        <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                        <div class="cart-item-controls">
                            <div class="quantity-controls">
                                <button class="quantity-btn minus" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <input type="number" class="quantity-input" value="${item.quantity}" 
                                       min="1" onchange="cart.updateQuantity('${item.id}', parseInt(this.value))">
                                <button class="quantity-btn plus" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            <button class="cart-item-remove" onclick="cart.removeFromCart('${item.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        cartItems.innerHTML = itemsHTML;
        
        // Calculate totals
        const shipping = subtotal > 0 ? 10 : 0; // $10 shipping for non-empty cart
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + shipping + tax;

        this.updateTotals(subtotal, shipping, tax, total);
    }

    updateTotals(subtotal, shipping, tax, total = 0) {
        document.querySelector('.cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.querySelector('.cart-shipping').textContent = `$${shipping.toFixed(2)}`;
        document.querySelector('.cart-tax').textContent = `$${tax.toFixed(2)}`;
        document.querySelector('.cart-total').textContent = `$${total.toFixed(2)}`;
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `cart-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('active');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize cart when page loads
const cart = new ShoppingCart();

// Nav scroll effect
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Close cart with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        cart.closeCart();
    }
});

// Add checkout and calculation methods inside the ShoppingCart class
// (Place these methods inside the ShoppingCart class, after updateTotals)

ShoppingCart.prototype.initCheckoutButton = function() {
    const checkoutBtn = document.querySelector('.btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            if (this.cart.length > 0) {
                this.proceedToCheckout();
            }
        };
    }
};

// Call this in the constructor or init method
cart.initCheckoutButton();

ShoppingCart.prototype.proceedToCheckout = function() {
    localStorage.setItem('checkoutCart', JSON.stringify(this.cart));
    localStorage.setItem('checkoutTotals', JSON.stringify({
        subtotal: this.calculateSubtotal(),
        shipping: this.calculateShipping(),
        tax: this.calculateTax(),
        total: this.calculateTotal()
    }));
    window.location.href = 'checkout.html';
};

ShoppingCart.prototype.calculateSubtotal = function() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

ShoppingCart.prototype.calculateShipping = function() {
    return this.cart.length > 0 ? 10 : 0;
};

ShoppingCart.prototype.calculateTax = function() {
    return this.calculateSubtotal() * 0.08;
};

ShoppingCart.prototype.calculateTotal = function() {
    return this.calculateSubtotal() + this.calculateShipping() + this.calculateTax();
};