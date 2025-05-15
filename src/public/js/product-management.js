/**
 * Product Management JavaScript
 * Quản lý sản phẩm và đồng bộ với WooCommerce
 */

document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo quản lý sản phẩm
    initProductManagement();
});

/**
 * Khởi tạo chức năng quản lý sản phẩm
 */
function initProductManagement() {
    // Load products when the page is loaded
    loadProducts(1);
    
    // Load sites for dropdowns
    loadSitesForDropdown();
    
    // Setup event listeners
    setupEventListeners();
}

/**
 * Thiết lập các sự kiện cho các phần tử trang
 */
function setupEventListeners() {
    // Refresh button
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            loadProducts(1);
        });
    }
    
    // Site filter change
    const siteFilter = document.getElementById('site-filter');
    if (siteFilter) {
        siteFilter.addEventListener('change', function() {
            loadProducts(1);
        });
    }
    
    // Search functionality
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            loadProducts(1);
        });
    }
    
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loadProducts(1);
            }
        });
    }
    
    // Apply filters button
    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            loadProducts(1);
        });
    }
    
    // Clear filters button
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            document.getElementById('search-input').value = '';
            document.getElementById('featured-filter').value = '';
            document.getElementById('sort-by').value = 'id';
            document.getElementById('site-filter').value = '';
            loadProducts(1);
        });
    }
    
    // Add product button
    const saveProductBtn = document.getElementById('save-product-btn');
    if (saveProductBtn) {
        saveProductBtn.addEventListener('click', function() {
            saveProduct();
        });
    }
    
    // Update product button
    const updateProductBtn = document.getElementById('update-product-btn');
    if (updateProductBtn) {
        updateProductBtn.addEventListener('click', function() {
            updateProduct();
        });
    }
    
    // Add image button in add product modal
    const addImageBtn = document.getElementById('add-image-btn');
    if (addImageBtn) {
        addImageBtn.addEventListener('click', function() {
            addImageToProduct();
        });
    }
    
    // Add image button in edit product modal
    const editAddImageBtn = document.getElementById('edit-add-image-btn');
    if (editAddImageBtn) {
        editAddImageBtn.addEventListener('click', function() {
            addImageToEditProduct();
        });
    }
    
    // Add category button in add product modal
    const addCategoryBtn = document.getElementById('add-category-btn');
    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', function() {
            addCategoryToProduct();
        });
    }
    
    // Add category button in edit product modal
    const editAddCategoryBtn = document.getElementById('edit-add-category-btn');
    if (editAddCategoryBtn) {
        editAddCategoryBtn.addEventListener('click', function() {
            addCategoryToEditProduct();
        });
    }
    
    // Sync products button
    const syncProductsBtn = document.getElementById('sync-products-btn');
    if (syncProductsBtn) {
        syncProductsBtn.addEventListener('click', function() {
            const syncModal = new bootstrap.Modal(document.getElementById('syncProductsModal'));
            syncModal.show();
        });
    }
    
    // Start sync button
    const startSyncBtn = document.getElementById('start-sync-btn');
    if (startSyncBtn) {
        startSyncBtn.addEventListener('click', function() {
            startProductSync();
        });
    }
    
    // Confirm delete button
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            deleteProduct();
        });
    }
    
    // Add to current site button
    const addToCurrentSiteBtn = document.getElementById('add-to-current-site-btn');
    if (addToCurrentSiteBtn) {
        addToCurrentSiteBtn.addEventListener('click', function() {
            const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
            modal.show();
            
            // Pre-select the current site
            const siteFilter = document.getElementById('site-filter');
            const selectedSiteId = siteFilter.value;
            if (selectedSiteId) {
                document.getElementById('product-site').value = selectedSiteId;
            }
        });
    }
}

/**
 * Load products with pagination
 * @param {number} page Page number to load
 */
function loadProducts(page = 1) {
    const tableBody = document.getElementById('products-table-body');
    if (!tableBody) return;
    
    // Show loading indicator
    tableBody.innerHTML = '<tr><td colspan="9" class="text-center">Loading products...</td></tr>';
    
    // Get filter values
    const searchQuery = document.getElementById('search-input').value;
    const siteId = document.getElementById('site-filter').value;
    const featured = document.getElementById('featured-filter').value;
    const sortBy = document.getElementById('sort-by').value;
    
    // Construct API URL with query parameters
    let apiUrl = `/api/products?page=${page}&limit=10`;
    
    if (searchQuery) {
        apiUrl += `&search=${encodeURIComponent(searchQuery)}`;
    }
    
    if (siteId) {
        apiUrl += `&siteId=${siteId}`;
    }
    
    if (featured) {
        apiUrl += `&featured=${featured}`;
    }
    
    if (sortBy) {
        apiUrl += `&sortBy=${sortBy}`;
    }
    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayProducts(data.products, data.totalItems, data.totalPages, page);
        })
        .catch(error => {
            console.error('Error loading products:', error);
            tableBody.innerHTML = '<tr><td colspan="9" class="text-center text-danger">Error loading products. Please try again.</td></tr>';
        });
}

/**
 * Display products in the table
 * @param {Array} products Products to display
 * @param {number} totalItems Total number of products
 * @param {number} totalPages Total number of pages
 * @param {number} currentPage Current page number
 */
function displayProducts(products, totalItems, totalPages, currentPage) {
    const tableBody = document.getElementById('products-table-body');
    const pagination = document.getElementById('pagination');
    
    if (!tableBody || !pagination) return;
    
    // Clear table body
    tableBody.innerHTML = '';
    
    if (products.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="9" class="text-center">No products found</td></tr>';
        pagination.innerHTML = '';
        document.getElementById('showing-records').textContent = `0-0`;
        document.getElementById('total-records').textContent = '0';
        return;
    }
    
    // Update showing records text
    const start = (currentPage - 1) * 10 + 1;
    const end = Math.min(currentPage * 10, totalItems);
    document.getElementById('showing-records').textContent = `${start}-${end}`;
    document.getElementById('total-records').textContent = totalItems;
    
    // Add products to table
    products.forEach(product => {
        const tr = document.createElement('tr');
        
        // Determine if the product is from the default site
        const defaultSiteId = localStorage.getItem('defaultSiteId');
        const isDefaultSite = product.site && product.site.id.toString() === defaultSiteId;
        
        if (isDefaultSite) {
            tr.classList.add('default-site-post');
        }
        
        tr.innerHTML = `
            <td>${product.id}</td>
            <td>
                ${product.images && product.images.length > 0 
                    ? `<img src="${product.images[0].src}" alt="${product.images[0].alt || product.name}" 
                        class="product-thumbnail" style="max-width: 50px; max-height: 50px;">`
                    : '<span class="text-muted"><i class="bi bi-image"></i> No image</span>'}
            </td>
            <td>${product.name}</td>
            <td>${formatPrice(product.price)}${product.sale_price ? ` <del class="text-muted">${formatPrice(product.regular_price)}</del>` : ''}</td>
            <td>
                <span class="badge ${getStockStatusBadgeClass(product.stock_status)}">
                    ${product.stock} ${formatStockStatus(product.stock_status)}
                </span>
            </td>
            <td>
                ${product.featured ? '<span class="badge bg-warning">Featured</span>' : ''}
                <span class="badge bg-primary">${product.type || 'simple'}</span>
            </td>
            <td>${product.site ? product.site.name : 'N/A'}</td>
            <td>${product.wc_product_id || 'N/A'}</td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-outline-primary edit-product-btn" data-product-id="${product.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-product-btn" data-product-id="${product.id}" 
                        data-product-name="${product.name}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(tr);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-product-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            loadProductForEditing(productId);
        });
    });
    
    document.querySelectorAll('.delete-product-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const productName = this.getAttribute('data-product-name');
            
            document.getElementById('delete-product-id').value = productId;
            document.getElementById('delete-product-name').textContent = productName;
            
            const deleteModal = new bootstrap.Modal(document.getElementById('deleteProductModal'));
            deleteModal.show();
        });
    });
    
    // Generate pagination
    generatePagination(totalPages, currentPage);
}

/**
 * Generate pagination controls
 * @param {number} totalPages Total number of pages
 * @param {number} currentPage Current page number
 */
function generatePagination(totalPages, currentPage) {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    pagination.innerHTML = '';
    
    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" ${currentPage === 1 ? '' : 'data-page="' + (currentPage - 1) + '"'}>Previous</a>`;
    pagination.appendChild(prevLi);
    
    // Page numbers
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4 && endPage < totalPages) {
        endPage = Math.min(totalPages, startPage + 4);
    }
    
    if (endPage - startPage < 4 && startPage > 1) {
        startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
        pagination.appendChild(li);
    }
    
    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" ${currentPage === totalPages ? '' : 'data-page="' + (currentPage + 1) + '"'}>Next</a>`;
    pagination.appendChild(nextLi);
    
    // Add event listeners to pagination links
    document.querySelectorAll('.page-link[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = parseInt(this.getAttribute('data-page'));
            loadProducts(page);
        });
    });
}

/**
 * Load sites for dropdown selects
 */
function loadSitesForDropdown() {
    fetch('/api/sites?has_woocommerce=true')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Populate dropdowns
            populateSiteDropdown('site-filter', data.sites, true);
            populateSiteDropdown('product-site', data.sites, false);
            populateSiteDropdown('edit-product-site', data.sites, false);
            populateSiteDropdown('sync-site-select', data.sites, false);
        })
        .catch(error => {
            console.error('Error loading sites:', error);
        });
}

/**
 * Populate a site dropdown with options
 * @param {string} elementId ID of the dropdown element
 * @param {Array} sites Sites to populate
 * @param {boolean} includeAll Whether to include an "All Sites" option
 */
function populateSiteDropdown(elementId, sites, includeAll = false) {
    const dropdown = document.getElementById(elementId);
    if (!dropdown) return;
    
    // Keep the first option (placeholder)
    const firstOption = dropdown.options[0];
    dropdown.innerHTML = '';
    
    if (includeAll) {
        dropdown.appendChild(firstOption);
    }
    
    // Add site options
    sites.forEach(site => {
        if (site.has_woocommerce) {
            const option = document.createElement('option');
            option.value = site.id;
            option.textContent = site.name;
            dropdown.appendChild(option);
        }
    });
}

/**
 * Save a new product
 */
function saveProduct() {
    // Get form values
    const siteId = document.getElementById('product-site').value;
    const name = document.getElementById('product-name').value;
    const price = document.getElementById('product-price').value;
    const regularPrice = document.getElementById('product-regular-price').value || price;
    const salePrice = document.getElementById('product-sale-price').value || null;
    const stock = document.getElementById('product-stock').value;
    const stockStatus = document.getElementById('product-stock-status').value;
    const shortDescription = document.getElementById('product-short-description').value;
    const description = document.getElementById('product-description').value;
    const featured = document.getElementById('product-featured').checked;
    
    // Collect images
    const imageElements = document.querySelectorAll('#product-images-container .product-image-item');
    const images = [];
    imageElements.forEach(element => {
        images.push({
            src: element.getAttribute('data-src'),
            name: element.getAttribute('data-name'),
            alt: element.getAttribute('data-name')
        });
    });
    
    // Collect categories
    const categoryElements = document.querySelectorAll('#product-categories-container .product-category-item');
    const categories = [];
    categoryElements.forEach(element => {
        categories.push(element.getAttribute('data-category'));
    });
    
    // Validate required fields
    if (!siteId || !name || !price) {
        showErrorMessage('add-product-error', 'Please fill in all required fields.');
        return;
    }
    
    // Create product object
    const productData = {
        siteId: parseInt(siteId),
        name,
        price: parseFloat(price),
        regular_price: parseFloat(regularPrice),
        sale_price: salePrice ? parseFloat(salePrice) : null,
        stock: parseInt(stock),
        stock_status: stockStatus,
        short_description: shortDescription,
        description,
        featured,
        images,
        categories
    };
    
    // Send request to create product
    fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.message || 'Error creating product');
            });
        }
        return response.json();
    })
    .then(data => {
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
        modal.hide();
        
        // Clear form
        document.getElementById('add-product-form').reset();
        document.getElementById('product-images-container').innerHTML = '';
        document.getElementById('product-categories-container').innerHTML = '';
        
        // Show success message
        showToast('success', 'Product created successfully');
        
        // Reload products list
        loadProducts(1);
    })
    .catch(error => {
        showErrorMessage('add-product-error', error.message);
    });
}

/**
 * Load product data for editing
 * @param {number} productId ID of the product to edit
 */
function loadProductForEditing(productId) {
    // Fetch product data
    fetch(`/api/products/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Product not found');
            }
            return response.json();
        })
        .then(product => {
            // Fill form with product data
            document.getElementById('edit-product-id').value = product.id;
            document.getElementById('edit-product-site').value = product.site.id;
            document.getElementById('edit-product-name').value = product.name;
            document.getElementById('edit-product-price').value = product.price;
            document.getElementById('edit-product-regular-price').value = product.regular_price || '';
            document.getElementById('edit-product-sale-price').value = product.sale_price || '';
            document.getElementById('edit-product-stock').value = product.stock || 0;
            document.getElementById('edit-product-stock-status').value = product.stock_status || 'instock';
            document.getElementById('edit-product-short-description').value = product.short_description || '';
            document.getElementById('edit-product-description').value = product.description || '';
            document.getElementById('edit-product-featured').checked = product.featured || false;
            
            // Load images
            const imagesContainer = document.getElementById('edit-product-images-container');
            imagesContainer.innerHTML = '';
            
            if (product.images && product.images.length > 0) {
                product.images.forEach(image => {
                    addImagePreview(imagesContainer, image.src, image.name);
                });
            }
            
            // Load categories
            const categoriesContainer = document.getElementById('edit-product-categories-container');
            categoriesContainer.innerHTML = '';
            
            if (product.categories && product.categories.length > 0) {
                product.categories.forEach(category => {
                    addCategoryTag(categoriesContainer, category);
                });
            }
            
            // Show modal
            const editModal = new bootstrap.Modal(document.getElementById('editProductModal'));
            editModal.show();
        })
        .catch(error => {
            console.error('Error loading product:', error);
            showToast('error', 'Error loading product: ' + error.message);
        });
}

/**
 * Update an existing product
 */
function updateProduct() {
    const productId = document.getElementById('edit-product-id').value;
    
    // Get form values
    const siteId = document.getElementById('edit-product-site').value;
    const name = document.getElementById('edit-product-name').value;
    const price = document.getElementById('edit-product-price').value;
    const regularPrice = document.getElementById('edit-product-regular-price').value || price;
    const salePrice = document.getElementById('edit-product-sale-price').value || null;
    const stock = document.getElementById('edit-product-stock').value;
    const stockStatus = document.getElementById('edit-product-stock-status').value;
    const shortDescription = document.getElementById('edit-product-short-description').value;
    const description = document.getElementById('edit-product-description').value;
    const featured = document.getElementById('edit-product-featured').checked;
    
    // Collect images
    const imageElements = document.querySelectorAll('#edit-product-images-container .product-image-item');
    const images = [];
    imageElements.forEach(element => {
        images.push({
            src: element.getAttribute('data-src'),
            name: element.getAttribute('data-name'),
            alt: element.getAttribute('data-name')
        });
    });
    
    // Collect categories
    const categoryElements = document.querySelectorAll('#edit-product-categories-container .product-category-item');
    const categories = [];
    categoryElements.forEach(element => {
        categories.push(element.getAttribute('data-category'));
    });
    
    // Validate required fields
    if (!siteId || !name || !price) {
        showErrorMessage('edit-product-error', 'Please fill in all required fields.');
        return;
    }
    
    // Create update data object
    const updateData = {
        siteId: parseInt(siteId),
        name,
        price: parseFloat(price),
        regular_price: parseFloat(regularPrice),
        sale_price: salePrice ? parseFloat(salePrice) : null,
        stock: parseInt(stock),
        stock_status: stockStatus,
        short_description: shortDescription,
        description,
        featured,
        images,
        categories
    };
    
    // Send request to update product
    fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.message || 'Error updating product');
            });
        }
        return response.json();
    })
    .then(data => {
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
        modal.hide();
        
        // Show success message
        showToast('success', 'Product updated successfully');
        
        // Reload products list
        loadProducts(getCurrentPage());
    })
    .catch(error => {
        showErrorMessage('edit-product-error', error.message);
    });
}

/**
 * Delete a product
 */
function deleteProduct() {
    const productId = document.getElementById('delete-product-id').value;
    
    fetch(`/api/products/${productId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.message || 'Error deleting product');
            });
        }
        return response.json();
    })
    .then(data => {
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteProductModal'));
        modal.hide();
        
        // Show success message
        showToast('success', 'Product deleted successfully');
        
        // Reload products list
        loadProducts(getCurrentPage());
    })
    .catch(error => {
        console.error('Error deleting product:', error);
        showToast('error', 'Error deleting product: ' + error.message);
    });
}

/**
 * Start syncing products from WooCommerce
 */
function startProductSync() {
    const siteId = document.getElementById('sync-site-select').value;
    
    if (!siteId) {
        showToast('error', 'Please select a site to sync from.');
        return;
    }
    
    // Show progress container
    const syncStatus = document.getElementById('sync-status');
    syncStatus.classList.remove('d-none');
    
    // Update progress bar and message
    const progressBar = document.getElementById('sync-progress');
    const syncMessage = document.getElementById('sync-message');
    
    progressBar.style.width = '0%';
    syncMessage.textContent = 'Starting sync...';
    
    // Disable start button
    document.getElementById('start-sync-btn').disabled = true;
    
    // Send sync request
    fetch(`/api/products/sync/${siteId}`, {
        method: 'POST'
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.message || 'Sync failed');
            });
        }
        return response.json();
    })
    .then(data => {
        // Show completion
        progressBar.style.width = '100%';
        syncMessage.innerHTML = `
            <div class="alert alert-success mb-0">
                Sync completed successfully!<br>
                Added: ${data.added} products<br>
                Updated: ${data.updated} products<br>
                Failed: ${data.failed} products
            </div>
        `;
        
        // Enable start button
        document.getElementById('start-sync-btn').disabled = false;
        
        // Show toast
        showToast('success', `Products synced successfully! Added: ${data.added}, Updated: ${data.updated}`);
        
        // Reload products
        setTimeout(() => {
            loadProducts(1);
        }, 1000);
    })
    .catch(error => {
        // Show error
        progressBar.style.width = '100%';
        progressBar.classList.remove('bg-primary');
        progressBar.classList.add('bg-danger');
        
        syncMessage.innerHTML = `
            <div class="alert alert-danger mb-0">
                Sync failed: ${error.message}
            </div>
        `;
        
        // Enable start button
        document.getElementById('start-sync-btn').disabled = false;
        
        // Show toast
        showToast('error', 'Sync failed: ' + error.message);
    });
}

/**
 * Add an image to the product (new product form)
 */
function addImageToProduct() {
    const imageUrl = document.getElementById('product-image-url').value;
    const imageName = document.getElementById('product-image-name').value || 'Product Image';
    
    if (!imageUrl) {
        showToast('error', 'Please enter an image URL.');
        return;
    }
    
    const imagesContainer = document.getElementById('product-images-container');
    addImagePreview(imagesContainer, imageUrl, imageName);
    
    // Clear inputs
    document.getElementById('product-image-url').value = '';
    document.getElementById('product-image-name').value = '';
}

/**
 * Add an image to the product (edit product form)
 */
function addImageToEditProduct() {
    const imageUrl = document.getElementById('edit-product-image-url').value;
    const imageName = document.getElementById('edit-product-image-name').value || 'Product Image';
    
    if (!imageUrl) {
        showToast('error', 'Please enter an image URL.');
        return;
    }
    
    const imagesContainer = document.getElementById('edit-product-images-container');
    addImagePreview(imagesContainer, imageUrl, imageName);
    
    // Clear inputs
    document.getElementById('edit-product-image-url').value = '';
    document.getElementById('edit-product-image-name').value = '';
}

/**
 * Add an image preview to a container
 * @param {HTMLElement} container Container to add the image to
 * @param {string} imageUrl URL of the image
 * @param {string} imageName Name/alt text for the image
 */
function addImagePreview(container, imageUrl, imageName) {
    const imageItem = document.createElement('div');
    imageItem.className = 'product-image-item position-relative';
    imageItem.setAttribute('data-src', imageUrl);
    imageItem.setAttribute('data-name', imageName);
    
    imageItem.innerHTML = `
        <img src="${imageUrl}" alt="${imageName}" class="img-thumbnail" style="width: 100px; height: 100px; object-fit: cover;">
        <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0 remove-image-btn">
            <i class="bi bi-x"></i>
        </button>
        <small class="d-block text-truncate" style="max-width: 100px;">${imageName}</small>
    `;
    
    container.appendChild(imageItem);
    
    // Add event listener to remove button
    imageItem.querySelector('.remove-image-btn').addEventListener('click', function() {
        imageItem.remove();
    });
}

/**
 * Add a category to the product (new product form)
 */
function addCategoryToProduct() {
    const categoryName = document.getElementById('product-category-name').value;
    
    if (!categoryName) {
        showToast('error', 'Please enter a category name.');
        return;
    }
    
    const categoriesContainer = document.getElementById('product-categories-container');
    addCategoryTag(categoriesContainer, categoryName);
    
    // Clear input
    document.getElementById('product-category-name').value = '';
}

/**
 * Add a category to the product (edit product form)
 */
function addCategoryToEditProduct() {
    const categoryName = document.getElementById('edit-product-category-name').value;
    
    if (!categoryName) {
        showToast('error', 'Please enter a category name.');
        return;
    }
    
    const categoriesContainer = document.getElementById('edit-product-categories-container');
    addCategoryTag(categoriesContainer, categoryName);
    
    // Clear input
    document.getElementById('edit-product-category-name').value = '';
}

/**
 * Add a category tag to a container
 * @param {HTMLElement} container Container to add the category tag to
 * @param {string} categoryName Name of the category
 */
function addCategoryTag(container, categoryName) {
    // Check if category already exists
    const existingCategories = container.querySelectorAll('.product-category-item');
    for (let i = 0; i < existingCategories.length; i++) {
        if (existingCategories[i].getAttribute('data-category').toLowerCase() === categoryName.toLowerCase()) {
            return; // Skip if category already exists
        }
    }
    
    const categoryItem = document.createElement('span');
    categoryItem.className = 'badge bg-secondary product-category-item me-1';
    categoryItem.setAttribute('data-category', categoryName);
    
    categoryItem.innerHTML = `
        ${categoryName}
        <button type="button" class="btn-close btn-close-white ms-1" aria-label="Remove" style="font-size: 0.5rem;"></button>
    `;
    
    container.appendChild(categoryItem);
    
    // Add event listener to remove button
    categoryItem.querySelector('.btn-close').addEventListener('click', function() {
        categoryItem.remove();
    });
}

/**
 * Get current page number from pagination
 * @returns {number} Current page number
 */
function getCurrentPage() {
    const activePage = document.querySelector('.page-item.active .page-link');
    return activePage ? parseInt(activePage.getAttribute('data-page')) : 1;
}

/**
 * Format price with currency symbol
 * @param {number} price Price to format
 * @returns {string} Formatted price
 */
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

/**
 * Format stock status text
 * @param {string} status Stock status code
 * @returns {string} Formatted stock status
 */
function formatStockStatus(status) {
    switch (status) {
        case 'instock':
            return 'In Stock';
        case 'outofstock':
            return 'Out of Stock';
        case 'onbackorder':
            return 'On Backorder';
        default:
            return status;
    }
}

/**
 * Get CSS class for stock status badge
 * @param {string} status Stock status code
 * @returns {string} CSS class for badge
 */
function getStockStatusBadgeClass(status) {
    switch (status) {
        case 'instock':
            return 'bg-success';
        case 'outofstock':
            return 'bg-danger';
        case 'onbackorder':
            return 'bg-warning';
        default:
            return 'bg-secondary';
    }
}

/**
 * Show error message in form
 * @param {string} elementId ID of error message element
 * @param {string} message Error message to show
 */
function showErrorMessage(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('d-none');
    }
}

/**
 * Show toast notification
 * @param {string} type Type of notification ('success', 'error', 'info', 'warning')
 * @param {string} message Message to show
 * @param {number} duration Duration in milliseconds
 */
function showToast(type, message, duration = 3000) {
    // Check if showMessage function exists (from main page)
    if (typeof window.showMessage === 'function') {
        window.showMessage(type, message, duration);
        return;
    }
    
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }
    
    // Set background color based on type
    let bgClass = 'bg-primary';
    let icon = 'info-circle';
    
    switch (type) {
        case 'success':
            bgClass = 'bg-success';
            icon = 'check-circle';
            break;
        case 'error':
            bgClass = 'bg-danger';
            icon = 'exclamation-triangle';
            break;
        case 'warning':
            bgClass = 'bg-warning';
            icon = 'exclamation-circle';
            break;
    }
    
    // Create toast element
    const toastElement = document.createElement('div');
    toastElement.className = `toast align-items-center text-white ${bgClass} border-0`;
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');
    toastElement.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="bi bi-${icon} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    // Add toast to container
    toastContainer.appendChild(toastElement);
    
    // Initialize and show toast
    const toast = new bootstrap.Toast(toastElement, {
        delay: duration,
        animation: true
    });
    toast.show();
    
    // Remove toast from DOM after it's hidden
    toastElement.addEventListener('hidden.bs.toast', function() {
        this.remove();
    });
}
