// Checkout functionality
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
    }

    renderOrderSummary() {
        const orderItems = document.querySelector('.order-items');
        
        if (this.cart.length === 0) {
            orderItems.innerHTML = `
                <div class="empty-cart-message">
                    <i class="fas fa-shopping-cart"></i>
                    <p>No items in cart</p>
                    <a href="products.html" class="btn-primary">Back to Products</a>
                </div>
            `;
            return;
        }

        let itemsHTML = '';
        this.cart.forEach(item => {
            // تحويل السعر من دولار إلى جنيه سوداني (مثال: 1 دولار = 600 جنيه)
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
        if (this.cart.length === 0) return;

        const subtotalSDG = (this.totals.subtotal * 600).toLocaleString();
        const shippingSDG = (this.totals.shipping * 600).toLocaleString();
        const taxSDG = (this.totals.tax * 600).toLocaleString();
        const totalSDG = (this.totals.total * 600).toLocaleString();
        document.querySelector('.total-row:nth-child(1) .total-amount').textContent = `SDG ${subtotalSDG}`;
        document.querySelector('.total-row:nth-child(2) .total-amount').textContent = `SDG ${shippingSDG}`;
        document.querySelector('.total-row:nth-child(3) .total-amount').textContent = `SDG ${taxSDG}`;
        document.querySelector('.grand-total .total-amount').textContent = `SDG ${totalSDG}`;

    }

    updatePaymentAmounts() {
        if (this.cart.length === 0) return;

        const totalSDG = (this.totals.total * 600).toLocaleString();

        document.getElementById('bankak-amount').textContent = `SDG ${totalSDG}`;
        document.getElementById('ocash-amount').textContent = `SDG ${totalSDG}`;
        document.getElementById('cod-amount').textContent = `SDG ${totalSDG}`;
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
        });

        // Checkout button
        document.getElementById('checkout-btn').addEventListener('click', () => {
            this.processCheckout();
        });

        // Real-time form validation
        this.setupRealTimeValidation();
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

    setupRealTimeValidation() {
        const inputs = document.querySelectorAll('.form-input[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    validateField(input) {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch(input.id) {
            case 'fullName':
                isValid = value.length >= 2;
                errorMessage = 'Name must be at least 2 characters long';
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
        } else {
            this.clearFieldError(input);
        }

        return isValid;
    }

    showFieldError(input, message) {
        this.clearFieldError(input);
        
        input.style.borderColor = '#ff6b6b';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.color = '#ff6b6b';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '5px';
        errorDiv.textContent = message;
        
        input.parentNode.appendChild(errorDiv);
    }

    clearFieldError(input) {
        input.style.borderColor = '#ddd';
        const existingError = input.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
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
            
            // Clear cart
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
        successDiv.className = 'checkout-success';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Order placed successfully! Redirecting...</span>
        `;
        successDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            z-index: 10002;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 1.1rem;
        `;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 1900);
    }
}

// Initialize checkout page when loaded
document.addEventListener('DOMContentLoaded', function() {
    const checkoutPage = new CheckoutPage();
    
    // Nav scroll effect
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    // Update cart count from localStorage
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('techBazzarCart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
    }
    
    updateCartCount();
});