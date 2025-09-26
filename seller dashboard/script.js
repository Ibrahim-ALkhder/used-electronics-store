// Sample product data
        const sampleProducts = [
            {
                id: 1,
                name: "MacBook Pro 2022",
                category: "laptops",
                description: "Apple MacBook Pro with M2 chip, 16GB RAM, 512GB SSD",
                price: 1299.00,
                stock: 5,
                image: "laptop"
            },
            {
                id: 2,
                name: "Samsung Galaxy S23",
                category: "smartphones",
                description: "Latest Samsung flagship with advanced camera and performance",
                price: 899.00,
                stock: 8,
                image: "phone"
            },
            {
                id: 3,
                name: "iPad Air 5th Gen",
                category: "tablets",
                description: "Apple iPad Air with M1 chip, 10.9-inch display",
                price: 599.00,
                stock: 3,
                image: "tablet"
            },
            {
                id: 4,
                name: "Sony WH-1000XM4",
                category: "accessories",
                description: "Industry-leading noise canceling wireless headphones",
                price: 349.00,
                stock: 12,
                image: "headphones"
            }
        ];

        // Current products (initially loaded with sample data)
        let products = [...sampleProducts];
        let editingProductId = null;

        // DOM Elements
        const sidebar = document.getElementById('sidebar');
        const toggleSidebar = document.getElementById('toggleSidebar');
        const menuItems = document.querySelectorAll('.menu-item');
        const sections = document.querySelectorAll('.dashboard-section');
        const pageTitle = document.getElementById('pageTitle');
        const pageSubtitle = document.getElementById('pageSubtitle');
        const productsContainer = document.getElementById('productsContainer');
        const productModal = document.getElementById('productModal');
        const modalTitle = document.getElementById('modalTitle');
        const productForm = document.getElementById('productForm');
        const closeModal = document.getElementById('closeModal');
        const cancelProductBtn = document.getElementById('cancelProductBtn');
        const addProductBtn = document.getElementById('addProductBtn');
        const tabs = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');

        // Logout elements
        const logoutSidebar = document.getElementById('logout-sidebar');
        const logoutTop = document.getElementById('logout-top');
        const userDropdownToggle = document.getElementById('userDropdownToggle');
        const userDropdown = document.getElementById('userDropdown');
        const logoutModal = document.getElementById('logoutModal');
        const cancelLogout = document.getElementById('cancelLogout');
        const confirmLogout = document.getElementById('confirmLogout');

        // Initialize the dashboard
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Loading seller dashboard...');
            
            // Check login status first
            checkLoginStatus();
            
            // Load products
            renderProducts();
            
            // Set up event listeners
            setupEventListeners();
        });

        // Check if user is logged in and has seller role
        function checkLoginStatus() {
            const userInfo = JSON.parse(localStorage.getItem('techBazzarUser'));
            
            if (!userInfo || !userInfo.email) {
                console.log('User not logged in, redirecting to login page');
                window.location.href = "../login/login.html";
                return;
            }
            
            if (userInfo.role !== 'seller') {
                console.log('User is not a seller, redirecting to home page');
                window.location.href = "../home/HOME.html";
                return;
            }
            
            console.log('User logged in as seller:', userInfo.email);
            // Update user info in the header
            updateUserInfo(userInfo);
        }

        // Update user information in the header
        function updateUserInfo(userInfo) {
            const userAvatar = document.querySelector('.user-avatar');
            const userName = document.querySelector('.user-menu div div:first-child');
            
            if (userAvatar) {
                userAvatar.textContent = userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'TS';
            }
            
            if (userName) {
                userName.textContent = userInfo.name || 'TechStore';
            }
        }

        // Set up all event listeners
        function setupEventListeners() {
            // Toggle sidebar on mobile
            toggleSidebar.addEventListener('click', function() {
                sidebar.classList.toggle('active');
            });

            // Navigation menu
            menuItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    const sectionId = this.getAttribute('data-section');
                    
                    if (this.id === 'logout-sidebar') {
                        showLogoutModal();
                        return;
                    }
                    
                    // Update active menu item
                    menuItems.forEach(i => i.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Show corresponding section
                    showSection(sectionId);
                });
            });

            // Add product button
            addProductBtn.addEventListener('click', function() {
                openProductModal();
            });

            // Close modal buttons
            closeModal.addEventListener('click', closeProductModal);
            cancelProductBtn.addEventListener('click', closeProductModal);

            // Product form submission
            productForm.addEventListener('submit', function(e) {
                e.preventDefault();
                saveProduct();
            });

            // Settings tabs
            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabId = this.getAttribute('data-tab');
                    
                    // Update active tab
                    tabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Show corresponding content
                    tabContents.forEach(content => content.classList.remove('active'));
                    document.getElementById(`${tabId}-tab`).classList.add('active');
                });
            });

            // Close modal when clicking outside
            window.addEventListener('click', function(e) {
                if (e.target === productModal) {
                    closeProductModal();
                }
                if (e.target === logoutModal) {
                    closeLogoutModal();
                }
            });

            // Logout functionality
            logoutSidebar.addEventListener('click', function(e) {
                e.preventDefault();
                showLogoutModal();
            });

            logoutTop.addEventListener('click', function(e) {
                e.preventDefault();
                showLogoutModal();
            });

            // User dropdown toggle
            userDropdownToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                userDropdown.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', function() {
                userDropdown.classList.remove('active');
            });

            // Prevent dropdown from closing when clicking inside it
            userDropdown.addEventListener('click', function(e) {
                e.stopPropagation();
            });

            // Confirm logout
            confirmLogout.addEventListener('click', function() {
                performLogout();
            });

            // Cancel logout
            cancelLogout.addEventListener('click', function() {
                closeLogoutModal();
            });
        }

        // Show the selected section
        function showSection(sectionId) {
            // Hide all sections
            sections.forEach(section => {
                section.style.display = 'none';
            });
            
            // Show the selected section
            document.getElementById(`${sectionId}-section`).style.display = 'block';
            
            // Update page title and subtitle
            updatePageTitle(sectionId);
        }

        // Update page title based on section
        function updatePageTitle(sectionId) {
            const titles = {
                dashboard: { title: "Seller Dashboard", subtitle: "Welcome back, TechStore! Here's your business overview." },
                products: { title: "Product Management", subtitle: "Manage your product catalog and inventory" },
                customers: { title: "Customer Management", subtitle: "View and manage your customer relationships" },
                analytics: { title: "Sales Analytics", subtitle: "Track your business performance and insights" },
                settings: { title: "Account Settings", subtitle: "Configure your store settings and preferences" }
            };
            
            if (titles[sectionId]) {
                pageTitle.textContent = titles[sectionId].title;
                pageSubtitle.textContent = titles[sectionId].subtitle;
            }
        }

        // Render products in the products grid
        function renderProducts() {
            productsContainer.innerHTML = '';
            
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <div class="product-image">
                        <i class="fas fa-${product.image} fa-2x"></i>
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <div class="product-price">$${product.price.toFixed(2)}</div>
                        <div style="font-size: 0.8rem; color: ${product.stock > 5 ? 'var(--success)' : 'var(--warning)'}; margin-bottom: 10px;">
                            ${product.stock} in stock
                        </div>
                        <div class="product-actions">
                            <button class="btn btn-outline edit-product" data-id="${product.id}">Edit</button>
                            <button class="btn btn-primary view-product" data-id="${product.id}">View</button>
                        </div>
                    </div>
                `;
                
                productsContainer.appendChild(productCard);
            });
            
            // Add event listeners to edit buttons
            document.querySelectorAll('.edit-product').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    openProductModal(productId);
                });
            });
        }

        // Open the product modal for adding or editing
        function openProductModal(productId = null) {
            editingProductId = productId;
            
            if (productId) {
                // Editing existing product
                modalTitle.textContent = "Edit Product";
                const product = products.find(p => p.id === productId);
                
                document.getElementById('productName').value = product.name;
                document.getElementById('productCategory').value = product.category;
                document.getElementById('productDescription').value = product.description;
                document.getElementById('productPrice').value = product.price;
                document.getElementById('productStock').value = product.stock;
            } else {
                // Adding new product
                modalTitle.textContent = "Add New Product";
                productForm.reset();
            }
            
            productModal.style.display = 'flex';
        }

        // Close the product modal
        function closeProductModal() {
            productModal.style.display = 'none';
            editingProductId = null;
        }

        // Save product (add new or update existing)
        function saveProduct() {
            const productData = {
                name: document.getElementById('productName').value,
                category: document.getElementById('productCategory').value,
                description: document.getElementById('productDescription').value,
                price: parseFloat(document.getElementById('productPrice').value),
                stock: parseInt(document.getElementById('productStock').value),
                image: document.getElementById('productCategory').value
            };
            
            if (editingProductId) {
                // Update existing product
                const index = products.findIndex(p => p.id === editingProductId);
                products[index] = { ...products[index], ...productData };
            } else {
                // Add new product
                const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
                products.push({ id: newId, ...productData });
            }
            
            // Update UI
            renderProducts();
            closeProductModal();
            
            // Show success message
            alert(`Product ${editingProductId ? 'updated' : 'added'} successfully!`);
        }

        // Show logout confirmation modal
        function showLogoutModal() {
            logoutModal.style.display = 'flex';
            userDropdown.classList.remove('active');
        }

        // Close logout confirmation modal
        function closeLogoutModal() {
            logoutModal.style.display = 'none';
        }

        // Perform logout
        function performLogout() {
            console.log('Logging out...');
            
            // Clear user data from localStorage
            localStorage.removeItem('techBazzarUser');
            
            // Close modal
            closeLogoutModal();
            
            // Redirect to login page after a short delay
            setTimeout(() => {
                window.location.href = "../login/login.html";
            }, 500);
        }

        // Simulate chart loading
        setTimeout(function() {
            console.log("Analytics data loaded");
        }, 1000);

        // Sample data update simulation
        setInterval(function() {
            // In a real app, this would fetch updated data from an API
            const ordersElement = document.querySelector('.stat-card:nth-child(1) h3');
            if (ordersElement) {
                const currentOrders = parseInt(ordersElement.textContent);
                ordersElement.textContent = currentOrders + Math.floor(Math.random() * 2);
            }
        }, 10000);