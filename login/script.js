// login/script.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('تحميل صفحة تسجيل الدخول...');
    
    // التحقق من حالة تسجيل الدخول بعد تأخير
    setTimeout(() => {
        const userInfo = JSON.parse(localStorage.getItem('techBazzarUser'));
        
        if (userInfo && userInfo.email) {
            console.log('مستخدم مسجل موجود:', userInfo.email);
            
            // فقط إذا كان المستخدم مسجلاً وتوجد بيانات صحيحة
            if (userInfo.role === 'seller') {
                console.log('توجيه البائع إلى لوحة التحكم');
                window.location.href = "../seller dashboard/seller dashboard.html";
            } else {
                console.log('توجيه المشتري إلى الصفحة الرئيسية');
                window.location.href = "../index.html";
            }
        } else {
            console.log('لا يوجد مستخدم مسجل، عرض نموذج التسجيل');
        }
    }, 1000);

    // Tab switching functionality
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetTab + 'Tab') {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Switch between login and register forms
    document.getElementById('switchToRegister').addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('.tab[data-tab="register"]').click();
    });
    
    document.getElementById('switchToLogin').addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('.tab[data-tab="login"]').click();
    });
    
    // Password toggle functionality
    function setupPasswordToggle(toggleId, inputId) {
        const toggle = document.getElementById(toggleId);
        const input = document.getElementById(inputId);
        
        toggle.addEventListener('click', function() {
            if (input.type === 'password') {
                input.type = 'text';
                toggle.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                input.type = 'password';
                toggle.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
    }
    
    setupPasswordToggle('loginPasswordToggle', 'loginPassword');
    setupPasswordToggle('registerPasswordToggle', 'registerPassword');
    setupPasswordToggle('registerConfirmPasswordToggle', 'registerConfirmPassword');
    
    // Role selection functionality for both login and register
    function setupRoleSelection(roleOptions, roleInput, buttonTextElement) {
        roleOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove selected class from all options
                roleOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Add selected class to clicked option
                this.classList.add('selected');
                
                // Update hidden input value
                const role = this.getAttribute('data-role');
                roleInput.value = role;
                
                // Update button text
                if (buttonTextElement) {
                    buttonTextElement.textContent = role.charAt(0).toUpperCase() + role.slice(1);
                }
            });
        });
    }
    
    // Setup role selection for login
    const loginRoleOptions = document.querySelectorAll('#loginTab .role-option');
    const loginRoleInput = document.getElementById('loginRole');
    const loginRoleText = document.getElementById('loginRoleText');
    setupRoleSelection(loginRoleOptions, loginRoleInput, loginRoleText);
    
    // Setup role selection for register
    const registerRoleOptions = document.querySelectorAll('#registerTab .role-option');
    const registerRoleInput = document.getElementById('userRole');
    setupRoleSelection(registerRoleOptions, registerRoleInput);
    
    // Set default role to buyer for both forms
    document.querySelector('#loginTab .role-option[data-role="buyer"]').classList.add('selected');
    document.querySelector('#registerTab .role-option[data-role="buyer"]').classList.add('selected');
    
    // Form validation functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function validatePassword(password) {
        return password.length >= 6 && /[0-9]/.test(password) && /[a-zA-Z]/.test(password);
    }
    
    function validatePhone(phone) {
        return phone === '' || /^\+?[\d\s-()]{10,}$/.test(phone);
    }
    
    function showError(input, errorElement, message) {
        input.classList.add('error');
        input.classList.remove('success');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    function showSuccess(input, errorElement) {
        input.classList.remove('error');
        input.classList.add('success');
        errorElement.style.display = 'none';
    }
    
    // Login form validation
    const loginForm = document.getElementById('loginForm');
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const loginEmailError = document.getElementById('loginEmailError');
    const loginPasswordError = document.getElementById('loginPasswordError');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;
        
        // Validate email
        if (!validateEmail(loginEmail.value)) {
            showError(loginEmail, loginEmailError, 'Please enter a valid email address');
            isValid = false;
        } else {
            showSuccess(loginEmail, loginEmailError);
        }
        
        // Validate password
        if (loginPassword.value.length < 6) {
            showError(loginPassword, loginPasswordError, 'Password must be at least 6 characters');
            isValid = false;
        } else {
            showSuccess(loginPassword, loginPasswordError);
        }
        
        if (isValid) {
            // Simulate login process
            const role = loginRoleInput.value;
            const loginButton = loginForm.querySelector('.btn-primary');
            const originalHTML = loginButton.innerHTML;
            loginButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Signing In as ${role.charAt(0).toUpperCase() + role.slice(1)}...`;
            loginButton.disabled = true;
            
            setTimeout(() => {
                // Store user info in localStorage
                const userInfo = {
                    email: loginEmail.value,
                    role: role,
                    name: role === 'seller' ? 'Tech Seller' : 'Tech Buyer',
                    loginTime: new Date().toISOString()
                };
                localStorage.setItem('techBazzarUser', JSON.stringify(userInfo));
                
                console.log('تم تسجيل الدخول بنجاح:', userInfo.email);
                
                // Redirect based on role
                if (role === 'seller') {
                    window.location.href = "../seller dashboard/seller dashboard.html";
                } else {
                    window.location.href = "../home/HOME.html";
                }
            }, 1500);
        }
    });
    
    // Register form validation
    const registerForm = document.getElementById('registerForm');
    const registerName = document.getElementById('registerName');
    const registerEmail = document.getElementById('registerEmail');
    const registerPhone = document.getElementById('registerPhone');
    const registerPassword = document.getElementById('registerPassword');
    const registerConfirmPassword = document.getElementById('registerConfirmPassword');
    const agreeTerms = document.getElementById('agreeTerms');
    
    const registerNameError = document.getElementById('registerNameError');
    const registerEmailError = document.getElementById('registerEmailError');
    const registerPhoneError = document.getElementById('registerPhoneError');
    const registerPasswordError = document.getElementById('registerPasswordError');
    const registerConfirmPasswordError = document.getElementById('registerConfirmPasswordError');
    const agreeTermsError = document.getElementById('agreeTermsError');
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;
        
        // Validate name
        if (registerName.value.trim() === '') {
            showError(registerName, registerNameError, 'Please enter your full name');
            isValid = false;
        } else {
            showSuccess(registerName, registerNameError);
        }
        
        // Validate email
        if (!validateEmail(registerEmail.value)) {
            showError(registerEmail, registerEmailError, 'Please enter a valid email address');
            isValid = false;
        } else {
            showSuccess(registerEmail, registerEmailError);
        }
        
        // Validate phone (optional)
        if (!validatePhone(registerPhone.value)) {
            showError(registerPhone, registerPhoneError, 'Please enter a valid phone number');
            isValid = false;
        } else {
            showSuccess(registerPhone, registerPhoneError);
        }
        
        // Validate password
        if (!validatePassword(registerPassword.value)) {
            showError(registerPassword, registerPasswordError, 'Password must be at least 6 characters with a number and letter');
            isValid = false;
        } else {
            showSuccess(registerPassword, registerPasswordError);
        }
        
        // Validate password confirmation
        if (registerPassword.value !== registerConfirmPassword.value) {
            showError(registerConfirmPassword, registerConfirmPasswordError, 'Passwords do not match');
            isValid = false;
        } else {
            showSuccess(registerConfirmPassword, registerConfirmPasswordError);
        }
        
        // Validate terms agreement
        if (!agreeTerms.checked) {
            agreeTermsError.style.display = 'block';
            isValid = false;
        } else {
            agreeTermsError.style.display = 'none';
        }
        
        if (isValid) {
            // Simulate registration process
            const registerButton = registerForm.querySelector('.btn-primary');
            const originalHTML = registerButton.innerHTML;
            registerButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
            registerButton.disabled = true;
            
            setTimeout(() => {
                // Store user info in localStorage
                const userInfo = {
                    name: registerName.value,
                    email: registerEmail.value,
                    phone: registerPhone.value,
                    role: registerRoleInput.value,
                    registrationTime: new Date().toISOString()
                };
                localStorage.setItem('techBazzarUser', JSON.stringify(userInfo));
                
                // Show success message and switch to login tab
                document.getElementById('successMessage').style.display = 'block';
                registerForm.reset();
                registerButton.innerHTML = originalHTML;
                registerButton.disabled = false;
                
                // Reset role selection
                document.querySelector('#registerTab .role-option[data-role="buyer"]').classList.add('selected');
                document.querySelector('#registerTab .role-option[data-role="seller"]').classList.remove('selected');
                
                // Switch to login tab after 2 seconds
                setTimeout(() => {
                    document.querySelector('.tab[data-tab="login"]').click();
                    document.getElementById('successMessage').style.display = 'none';
                }, 2000);
            }, 1500);
        }
    });
});