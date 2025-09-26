  // Checkout Page Functionality
        class CheckoutPage {
            constructor() {
                this.cart = JSON.parse(localStorage.getItem('checkoutCart')) || [];
                this.totals = JSON.parse(localStorage.getItem('checkoutTotals')) || {};
                this.init();
            }

            init() {
                this.renderOrderSummary();
                this.updatePaymentAmounts();
                this.bindEvents();
                this.validateForm();
                this.updateCartCount();
                this.updateLoginUI();
            }

            renderOrderSummary() {
                const orderItems = document.getElementById('orderItems');
                
                if (this.cart.length === 0) {
                    orderItems.innerHTML = `
                        <div class="empty-cart-message">
                            <i class="fas fa-shopping-cart"></i>
                            <p>No items in cart</p>
                            <a href="../products/products.html" style="color: #18685b; text-decoration: none; font-weight: 600;">Back to Products</a>
                        </div>
                    `;
                    this.updateOrderTotals();
                    return;
                }

                let itemsHTML = '';
                this.cart.forEach(item => {
                    // Convert USD to SDG (1 USD = 600 SDG)
                    const sdgPrice = (item.price * 600).toLocaleString();
                    const totalSDG = (item.price * item.quantity * 600).toLocaleString();
                    
                    itemsHTML += `
                        <div class="order-item">
                            <div class="item-image">
                                <img src="${item.image}" alt="${item.title}">
                            </div>
                            <div class="item-details">
                                <div class="item-name">${item.title}</div>
                                <div class="item-price">SDG ${totalSDG}</div>
                                <div class="item-quantity">Quantity: ${item.quantity}</div>
                                <div class="item-unit-price">SDG ${sdgPrice} each</div>
                            </div>
                        </div>
                    `;
                });

                orderItems.innerHTML = itemsHTML;
                this.updateOrderTotals();
            }

            updateOrderTotals() {
                if (this.cart.length === 0) {
                    document.getElementById('subtotalAmount').textContent = 'SDG 0';
                    document.getElementById('shippingAmount').textContent = 'SDG 0';
                    document.getElementById('taxAmount').textContent = 'SDG 0';
                    document.getElementById('totalAmount').textContent = 'SDG 0';
                    return;
                }

                const subtotalSDG = (this.totals.subtotal * 600).toLocaleString();
                const shippingSDG = (this.totals.shipping * 600).toLocaleString();
                const taxSDG = (this.totals.tax * 600).toLocaleString();
                const totalSDG = (this.totals.total * 600).toLocaleString();

                document.getElementById('subtotalAmount').textContent = `SDG ${subtotalSDG}`;
                document.getElementById('shippingAmount').textContent = `SDG ${shippingSDG}`;
                document.getElementById('taxAmount').textContent = `SDG ${taxSDG}`;
                document.getElementById('totalAmount').textContent = `SDG ${totalSDG}`;
            }

            updatePaymentAmounts() {
                if (this.cart.length === 0) return;

                const totalSDG = (this.totals.total * 600).toLocaleString();
                
                // Update all payment method amounts
                document.querySelectorAll('#bankak-amount, #ocash-amount, #cod-amount').forEach(element => {
                    element.textContent = `SDG ${totalSDG}`;
                });
            }

            bindEvents() {
                // Payment method selection
                document.querySelectorAll('.payment-method').forEach(method => {
                    method.addEventListener('click', () => {
                        this.selectPaymentMethod(method);
                    });
                });

                // Form validation on input
                const formInputs = document.querySelectorAll('.form-input');
                formInputs.forEach(input => {
                    input.addEventListener('input', () => {
                        this.validateForm();
                    });
                    
                    input.addEventListener('blur', () => {
                        this.validateField(input);
                    });
                });

                // Checkout button
                document.getElementById('checkout-btn').addEventListener('click', () => {
                    this.processCheckout();
                });
            }

            selectPaymentMethod(method) {
                // Remove selected class from all methods
                document.querySelectorAll('.payment-method').forEach(m => {
                    m.classList.remove('selected');
                    m.querySelector('.fa-check-circle').style.display = 'none';
                });
                
                // Add selected class to clicked method
                method.classList.add('selected');
                method.querySelector('.fa-check-circle').style.display = 'block';
                
                // Hide all instructions
                document.querySelectorAll('.payment-instructions').forEach(instruction => {
                    instruction.classList.remove('active');
                });
                
                // Show instructions for selected method
                const methodType = method.getAttribute('data-method');
                document.getElementById(`${methodType}-instructions`).classList.add('active');
                
                this.validateForm();
            }

            validateField(input) {
                const value = input.value.trim();
                let isValid = true;
                let errorMessage = '';

                // Clear previous error
                this.clearFieldError(input);

                switch(input.id) {
                    case 'fullName':
                        isValid = value.length >= 2;
                        errorMessage = 'Name must be at least 2 characters long';
                        break;
                    case 'email':
                        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                        errorMessage = 'Please enter a valid email address';
                        break;
                    case 'phone':
                        isValid = /^(\+249|0)[0-9]{9}$/.test(value);
                        errorMessage = 'Please enter a valid Sudanese phone number';
                        break;
                    case 'address':
                        isValid = value.length >= 5;
                        errorMessage = 'Please enter a valid address';
                        break;
                    case 'city':
                        isValid = value.length >= 2;
                        errorMessage = 'Please enter a valid city name';
                        break;
                    case 'state':
                        isValid = value.length >= 2;
                        errorMessage = 'Please enter a valid state/region';
                        break;
                }

                if (!isValid && value !== '') {
                    this.showFieldError(input, errorMessage);
                }

                return isValid;
            }

            showFieldError(input, message) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'field-error';
                errorDiv.textContent = message;
                input.parentNode.appendChild(errorDiv);
                input.style.borderColor = '#ff6b6b';
            }

            clearFieldError(input) {
                const existingError = input.parentNode.querySelector('.field-error');
                if (existingError) {
                    existingError.remove();
                }
                input.style.borderColor = '#ddd';
            }

            validateForm() {
                if (this.cart.length === 0) {
                    document.getElementById('checkout-btn').disabled = true;
                    return false;
                }

                let isValid = true;
                
                // Validate required fields
                const requiredInputs = document.querySelectorAll('.form-input[required]');
                requiredInputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                    } else if (!this.validateField(input)) {
                        isValid = false;
                    }
                });
                
                // Validate payment method
                const paymentSelected = document.querySelector('.payment-method.selected');
                if (!paymentSelected) {
                    isValid = false;
                }
                
                document.getElementById('checkout-btn').disabled = !isValid;
                return isValid;
            }

            processCheckout() {
                if (!this.validateForm()) return;
                
                const checkoutBtn = document.getElementById('checkout-btn');
                const originalText = checkoutBtn.innerHTML;
                
                // Show loading state
                checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                checkoutBtn.disabled = true;
                
                // Collect form data
                const formData = {
                    customerInfo: {
                        fullName: document.getElementById('fullName').value,
                        email: document.getElementById('email').value,
                        phone: document.getElementById('phone').value,
                        address: document.getElementById('address').value,
                        city: document.getElementById('city').value,
                        state: document.getElementById('state').value,
                        notes: document.getElementById('notes').value
                    },
                    paymentMethod: document.querySelector('.payment-method.selected').getAttribute('data-method'),
                    orderItems: this.cart,
                    totals: this.totals,
                    orderDate: new Date().toISOString(),
                    orderId: 'TB' + Date.now().toString().slice(-6)
                };
                
                // Simulate API call
                setTimeout(() => {
                    // Save order data
                    localStorage.setItem('orderConfirmation', JSON.stringify(formData));
                    
                    // Clear cart data
                    localStorage.removeItem('techBazzarCart');
                    localStorage.removeItem('checkoutCart');
                    localStorage.removeItem('checkoutTotals');
                    
                    // Show success message
                    this.showSuccessMessage();
                    
                    // Redirect to confirmation page
                    setTimeout(() => {
                        window.location.href = 'confirmation.html';
                    }, 2000);
                    
                }, 2000);
            }

            showSuccessMessage() {
                const successDiv = document.createElement('div');
                successDiv.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: linear-gradient(135deg, #4CAF50, #45a049);
                    color: white;
                    padding: 20px 30px;
                    border-radius: 10px;
                    z-index: 2000;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 1.1rem;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                `;
                successDiv.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <span>Order placed successfully! Redirecting...</span>
                `;
                
                document.body.appendChild(successDiv);
                
                setTimeout(() => {
                    successDiv.remove();
                }, 1900);
            }

            updateCartCount() {
                const cart = JSON.parse(localStorage.getItem('techBazzarCart')) || [];
                const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                document.querySelector('.cart-count').textContent = totalItems;
            }

                            uupdateLoginUI() {
                    const userInfo = JSON.parse(localStorage.getItem('techBazzarUser'));
                    const loginButtonContainer = document.querySelector('.nav-right'); // أو العنصر المناسب
                    
                    if (userInfo) {
                    // User is logged in - show profile instead of login button
                    loginButtonContainer.innerHTML = `
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
                                <a href="../profile/profile.html" class="dropdown-item">
                                    <i class="fas fa-user"></i>
                                    <span>My Profile</span>
                                </a>
                                <a href="../orders/orders.html" class="dropdown-item">
                                    <i class="fas fa-shopping-bag"></i>
                                    <span>My Orders</span>
                                </a>
                                <a href="../wishlist/wishlist.html" class="dropdown-item">
                                    <i class="fas fa-heart"></i>
                                    <span>Wishlist</span>
                                </a>
                                ${userInfo.role === 'seller' ? `
                                <a href="../seller dashboard/seller dashboard.html" class="dropdown-item">
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
                    this.setupUserDropdown();
                } else {
        // تصحيح المسار هنا أيضاً
        loginButtonContainer.querySelector('a').href = "../login/login.html";
    }
            }

            setupUserDropdown() {
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
                        localStorage.removeItem('techBazzarUser');
                        window.location.reload();
                    });
                }
            }
        }

        // Initialize checkout page when loaded
        document.addEventListener('DOMContentLoaded', function() {
            new CheckoutPage();
        });

        