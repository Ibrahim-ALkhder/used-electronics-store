// في دالة updateLoginUI، تحديث الرابط في القائمة المنسدلة
function updateLoginUI() {
    const userInfo = JSON.parse(localStorage.getItem('techBazzarUser'));
    const navRight = document.querySelector('.nav-right');
    
    if (userInfo) {
        // تحديث رابط البروفايل في القائمة المنسدلة
        const profileLink = document.querySelector('.user-dropdown-menu a[href*="profile"]');
        if (profileLink) {
            profileLink.href = "D:/frotend_projects/IN PROGRESS/e-commerce project/profile/profile.html";
        }
        
        // ... باقي الكود الحالي ...
    }
}

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
// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Navigation elements
    const nav = document.querySelector('nav');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileSearch = document.querySelector('.mobile-search');

    // Check if elements exist before adding event listeners
    if (!hamburgerBtn || !navMenu) return;

    // Toggle mobile menu
    hamburgerBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Toggle mobile search visibility
        if (mobileSearch) {
            mobileSearch.style.display = navMenu.classList.contains('active') ? 'block' : 'none';
        }
    });

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
            if (mobileSearch) {
                mobileSearch.style.display = 'none';
            }
        });
    });

    // Nav scroll effect
    if (nav) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!nav) return;
        
        const isClickInsideNav = nav.contains(event.target);
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            hamburgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
            if (mobileSearch) {
                mobileSearch.style.display = 'none';
            }
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            hamburgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
            if (mobileSearch) {
                mobileSearch.style.display = 'none';
            }
        }
    });

    // Smooth scrolling for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Contact form functionality
    const form = document.querySelector('.contact-form-wrapper');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ff6b6b';
                } else {
                    input.style.borderColor = '#18685b';
                }
            });
            
            if (isValid) {
                // Simulate form submission
                const submitBtn = form.querySelector('.submit-btn');
                if (!submitBtn) return;
                
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                    submitBtn.style.background = '#28a745';
                    
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.background = '';
                        form.reset();
                    }, 2000);
                }, 1500);
            }
        });
    }

    // Section animation on scroll
    const sections = document.querySelectorAll('section');
    const links = document.querySelectorAll('nav a[data-target]');

    // Smooth scroll for data-target links
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.dataset.target;
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                e.preventDefault();
                window.scrollTo({
                    top: targetSection.offsetTop - 10,
                    behavior: "smooth"
                });
            }
        });
    });

    // Add show class to sections when they become visible
    function checkScroll() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < window.innerHeight - 100) {
                section.classList.add('show');
            }
        });
    }

    // Check on scroll and on load
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Initial check

    // Parallax and floating devices effect
    const hero = document.querySelector('.hero');
    const devices = document.querySelectorAll('.device');
    
    if (hero && devices.length > 0) {
        // Parallax effect
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
        
        // Mouse move effect for devices
        document.addEventListener('mousemove', function(e) {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            devices.forEach(device => {
                const speed = parseFloat(device.getAttribute('data-speed')) || 0.03;
                const xMove = (x - 0.5) * speed * 100;
                const yMove = (y - 0.5) * speed * 100;
                
                device.style.transform = `translate(${xMove}px, ${yMove}px) rotate(var(--rotation, 0deg))`;
            });
        });
        
        // Typewriter effect for title
        const title = document.querySelector('.hero-title');
        if (title) {
            const text = title.textContent;
            title.textContent = '';
            let i = 0;
            
            function typeWriter() {
                if (i < text.length) {
                    title.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                }
            }
            
            // Start typewriter effect after a delay
            setTimeout(typeWriter, 500);
        }
    }
    
    // ==================== Shopping Cart Functionality ====================
    // Initialize cart
    const cart = new ShoppingCart();
    window.cart = cart;

    // Close cart with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            cart.closeCart();
        }
    });
});

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
        this.initCheckoutButton();
    }

    bindEvents() {
        // Cart button click
        const cartBtn = document.querySelector('.cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleCart();
            });
        }

        // Close cart modal
        const closeBtn = document.querySelector('.cart-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeCart();
            });
        }

        // Close cart when clicking outside
        const overlay = document.querySelector('.cart-modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                this.closeCart();
            });
        }

        // Continue shopping button
        const continueBtn = document.querySelector('.btn-continue-shopping');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                this.closeCart();
            });
        }

        // Add to cart buttons (if any on home page)
        document.querySelectorAll('.btn-add-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    this.addToCart(productCard);
                }
            });
        });
    }

    toggleCart() {
        const cartModal = document.querySelector('.cart-modal');
        if (cartModal) {
            cartModal.classList.toggle('active');
            document.body.style.overflow = cartModal.classList.contains('active') ? 'hidden' : '';
        }
    }

    closeCart() {
        const cartModal = document.querySelector('.cart-modal');
        if (cartModal) {
            cartModal.classList.remove('active');
            document.body.style.overflow = '';
        }
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
            this.showNotification(`${product.title} quantity updated!`, 'success');
        } else {
            this.cart.push(product);
            this.showNotification(`${product.title} added to cart!`, 'success');
        }

        this.saveCart();
        this.updateCartCount();
        this.renderCart();
        
        // Visual feedback on button
        const button = productCard.querySelector('.btn-add-cart');
        if (button) {
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Added';
            button.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.style.background = 'linear-gradient(135deg, #18685b, #26575b)';
            }, 1500);
        }
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
        
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.classList.add('updated');
            
            setTimeout(() => {
                cartCount.classList.remove('updated');
            }, 500);
        }
    }

    renderCart() {
        const cartItems = document.getElementById('cartItems');
        if (!cartItems) return;

        const cartSubtotal = document.querySelector('.cart-subtotal');
        const cartShipping = document.querySelector('.cart-shipping');
        const cartTax = document.querySelector('.cart-tax');
        const cartTotal = document.querySelector('.cart-total');

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <a href="/frotend_projects/IN PROGRESS/e-commerce project/products/products.html" class="btn-primary">Start Shopping</a>
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
        const subtotalEl = document.querySelector('.cart-subtotal');
        const shippingEl = document.querySelector('.cart-shipping');
        const taxEl = document.querySelector('.cart-tax');
        const totalEl = document.querySelector('.cart-total');
        
        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (shippingEl) shippingEl.textContent = `$${shipping.toFixed(2)}`;
        if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
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
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    initCheckoutButton() {
        const checkoutBtn = document.querySelector('.btn-checkout');
        if (checkoutBtn) {
            checkoutBtn.onclick = () => {
                if (this.cart.length > 0) {
                    this.proceedToCheckout();
                } else {
                    this.showNotification('Your cart is empty!', 'error');
                }
            };
        }
    }

    proceedToCheckout() {
        localStorage.setItem('checkoutCart', JSON.stringify(this.cart));
        localStorage.setItem('checkoutTotals', JSON.stringify({
            subtotal: this.calculateSubtotal(),
            shipping: this.calculateShipping(),
            tax: this.calculateTax(),
            total: this.calculateTotal()
        }));
        window.location.href = 'D:/frotend_projects/IN PROGRESS/e-commerce project/checkout/checkout.html';
    }

    calculateSubtotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    calculateShipping() {
        return this.cart.length > 0 ? 10 : 0;
    }

    calculateTax() {
        return this.calculateSubtotal() * 0.08;
    }

    calculateTotal() {
        return this.calculateSubtotal() + this.calculateShipping() + this.calculateTax();
    }
}