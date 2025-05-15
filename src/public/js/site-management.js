/**
 * Quản lý bài đăng theo site - Tính năng mở rộng
 * 
 * File này chứa các tính năng bổ sung để quản lý bài đăng theo site
 */

// Chạy sau khi trang đã tải xong
document.addEventListener('DOMContentLoaded', function() {
    // Initialize site management
    initSiteManagement();
    
    // Set up table change observation
    watchPostTableChanges();
      // Update site filter when page loads (in case it's set by loadDefaultSiteIfNeeded)
    setTimeout(() => {
        const siteFilter = document.getElementById('site-filter');
        if (siteFilter && siteFilter.value) {
            const siteName = siteFilter.options[siteFilter.selectedIndex].text;
            const currentSiteName = document.getElementById('current-site-name');
            const siteIndicator = document.querySelector('.site-indicator');
            
            if (currentSiteName && siteIndicator) {
                currentSiteName.textContent = siteName;
                siteIndicator.classList.remove('d-none');
            }
        }
    }, 500);
});

/**
 * Khởi tạo tính năng quản lý site
 */
function initSiteManagement() {
    setupDefaultSiteSelection();
    setupSiteHeaderStyles();
    setupQuickAddButtons();
    enhanceSiteFiltering();
    enhancePostGroupDisplay();
    
    // Thêm sự kiện khi thay đổi site filter
    setupSiteFilterChangeEvent();
    
    // Kiểm tra và tải site mặc định (nếu có)
    loadDefaultSiteIfNeeded();
}

/**
 * Xử lý sự kiện thay đổi site filter
 */
function setupSiteFilterChangeEvent() {
    const filterEl = document.getElementById('site-filter');
    if (filterEl) {
        // Apply the default site if needed
        const defaultSiteId = localStorage.getItem('defaultSiteId');
        
        // Autocomplete the site filter and switch if default is set
        if (defaultSiteId && filterEl.value === '') {
            for (let i = 0; i < filterEl.options.length; i++) {
                if (filterEl.options[i].value === defaultSiteId) {
                    filterEl.selectedIndex = i;
                    break;
                }
            }
            
            // Update default switch
            const defaultSwitch = document.getElementById('default-site-switch');
            if (defaultSwitch) {
                defaultSwitch.checked = true;
            }
        }
        
        // Add a change event listener to update UI
        filterEl.addEventListener('change', function() {
            const selectedSiteId = this.value;
            const siteName = selectedSiteId ? this.options[this.selectedIndex].text : '';
            const currentSiteName = document.getElementById('current-site-name');
            const siteIndicator = document.querySelector('.site-indicator');
            
            // Update UI based on site selection
            if (selectedSiteId && currentSiteName && siteIndicator) {
                currentSiteName.textContent = siteName;
                siteIndicator.classList.remove('d-none');
                
                // If default site is enabled, save the selection
                if (document.getElementById('default-site-switch').checked) {
                    localStorage.setItem('defaultSiteId', selectedSiteId);
                    localStorage.setItem('defaultSiteName', siteName);
                }
            } else if (siteIndicator) {
                siteIndicator.classList.add('d-none');
            }
        });
    }
}

/**
 * Thiết lập tính năng site mặc định
 */
function setupDefaultSiteSelection() {
    // Thêm event listener cho switch chọn site mặc định
    const defaultSiteSwitch = document.getElementById('default-site-switch');
    if (defaultSiteSwitch) {
        defaultSiteSwitch.addEventListener('change', function() {
            const siteFilter = document.getElementById('site-filter');
            const selectedSiteId = siteFilter.value;
              if (this.checked && selectedSiteId) {
                // Lưu site mặc định
                localStorage.setItem('defaultSiteId', selectedSiteId);
                localStorage.setItem('defaultSiteName', siteFilter.options[siteFilter.selectedIndex].text);
                showSuccessMessage(`Site "${siteFilter.options[siteFilter.selectedIndex].text}" đã được đặt làm mặc định`);
            } else if (!this.checked) {
                // Xóa site mặc định
                localStorage.removeItem('defaultSiteId');
                localStorage.removeItem('defaultSiteName');
                showSuccessMessage("Đã xóa site mặc định");
            } else if (this.checked && !selectedSiteId) {
                // Không thể đặt "All Sites" làm mặc định
                this.checked = false;
                showErrorMessage('global', 'Vui lòng chọn một site cụ thể để đặt làm mặc định');
            }
        });
    }
    
    // Kiểm tra nếu đã có site mặc định, hiển thị đã chọn
    const defaultSiteId = localStorage.getItem('defaultSiteId');
    if (defaultSiteId && defaultSiteSwitch) {
        defaultSiteSwitch.checked = true;
    }
}

/**
 * Thiết lập style cho site header trong danh sách bài viết
 */
function setupSiteHeaderStyles() {
    // Thêm CSS classes và styles cho site headers
    const style = document.createElement('style');
    style.textContent = `
        .site-header-row {
            background-color: #e8f4ff !important;
            border-left: 4px solid #0d6efd;
        }
        
        .site-header-row td {
            padding: 0.75rem 1rem;
        }
        
        .set-default-site-btn:hover {
            background-color: #198754;
            color: white;
        }
        
        .filter-site-btn:hover {
            background-color: #0d6efd;
            color: white;
        }
        
        .default-site-post {
            background-color: #fff3cd !important;
        }
        
        .site-group-even {
            border-left: 4px solid #0d6efd;
        }
        
        .site-group-odd {
            border-left: 4px solid #198754;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Thiết lập nút thêm nhanh vào site đang xem
 */
function setupQuickAddButtons() {
    // Find the existing "Add to this site" button in site indicator
    const addButton = document.getElementById('add-to-current-site-btn');
    
    if (addButton) {
        // Xử lý sự kiện click cho nút có sẵn
        addButton.addEventListener('click', function() {
            const modal = new bootstrap.Modal(document.getElementById('addPostModal'));
            modal.show();
            
            // Pre-select the current site
            const siteFilter = document.getElementById('site-filter');
            const selectedSiteId = siteFilter.value;
            if (selectedSiteId) {
                document.getElementById('post-site').value = selectedSiteId;
            }
        });
    }
}

/**
 * Cải thiện trải nghiệm lọc theo site
 */
function enhanceSiteFiltering() {
    // Thêm event listener cho nút "Set as default" trong các site header
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('set-default-site-btn') || 
            e.target.closest('.set-default-site-btn')) {
            
            const button = e.target.classList.contains('set-default-site-btn') ? 
                e.target : e.target.closest('.set-default-site-btn');
            
            const siteId = button.getAttribute('data-site-id');
            const siteName = button.getAttribute('data-site-name');
            
            // Lưu default site
            localStorage.setItem('defaultSiteId', siteId);
            localStorage.setItem('defaultSiteName', siteName);
            
            // Bật switch
            document.getElementById('default-site-switch').checked = true;
            
            // Hiển thị thông báo
            showSuccessMessage(`Site "${siteName}" đã được đặt làm mặc định`);
            
            // Cập nhật filter để xem site này
            document.getElementById('site-filter').value = siteId;
            loadPosts(1);
        }
    });
}

/**
 * Tải site mặc định nếu chưa chọn site
 */
function loadDefaultSiteIfNeeded() {
    // Nếu không có site nào được chọn và đang ở trang đầu tiên, tải site mặc định
    const siteFilter = document.getElementById('site-filter');
    if (siteFilter && !siteFilter.value) {
        const defaultSiteId = localStorage.getItem('defaultSiteId');
        const defaultSiteName = localStorage.getItem('defaultSiteName');
        
        if (defaultSiteId) {
            siteFilter.value = defaultSiteId;
            showSuccessMessage(`Đã tải bài viết từ site mặc định: ${defaultSiteName}`);
            
            // Trigger sự kiện change để cập nhật UI và load bài viết
            siteFilter.dispatchEvent(new Event('change'));
        }
    }
}

/**
 * Cải thiện hiển thị nhóm bài đăng theo site
 * Thêm các lớp CSS để phân biệt các nhóm site một cách trực quan
 */
function enhancePostGroupDisplay() {
    // Chờ một chút để đảm bảo các site header và post rows đã được render
    setTimeout(() => {
        const tableBody = document.getElementById('posts-table-body');
        if (!tableBody) return;
        
        // Tìm tất cả các site header rows
        const siteHeaderRows = tableBody.querySelectorAll('.site-header-row');
        
        // Xử lý từng site header và các post row thuộc site đó
        siteHeaderRows.forEach((headerRow, index) => {
            // Lấy ID của site từ button filter
            const filterBtn = headerRow.querySelector('.filter-site-btn');
            if (!filterBtn) return;
            
            const siteId = filterBtn.getAttribute('data-site-id');
            if (!siteId) return;
            
            // Tìm các post row thuộc site này
            let currentRow = headerRow.nextElementSibling;
            let isDefaultSite = localStorage.getItem('defaultSiteId') === siteId;
            
            // Áp dụng style cho tất cả các post thuộc site hiện tại
            // cho đến khi gặp site header tiếp theo
            while (currentRow && !currentRow.classList.contains('site-header-row')) {
                // Thêm class để đánh dấu post thuộc site nào
                currentRow.classList.add('site-post-' + siteId.replace(/[^a-z0-9]/gi, '-'));
                
                // Nếu là default site, highlight để dễ nhìn
                if (isDefaultSite) {
                    currentRow.classList.add('default-site-post');
                }
                
                // Thêm border để nhóm trực quan hơn
                if (index % 2 === 0) {
                    currentRow.classList.add('site-group-even');
                } else {
                    currentRow.classList.add('site-group-odd');
                }
                
                // Chuyển đến row tiếp theo
                currentRow = currentRow.nextElementSibling;
            }
        });
    }, 300);
}

/**
 * Watch for post table changes to apply site grouping improvements
 */
function watchPostTableChanges() {
    // Use MutationObserver to detect when posts are loaded and displayed
    const postsTableBody = document.getElementById('posts-table-body');
    if (!postsTableBody) return;
    
    const observer = new MutationObserver((mutations) => {
        // When the table body changes, enhance post grouping displays
        enhancePostGroupDisplay();
    });
    
    // Start observing the posts table for changes
    observer.observe(postsTableBody, { childList: true, subtree: true });
      // Also set up site filter initial state
    const siteFilter = document.getElementById('site-filter');
    if (siteFilter && siteFilter.value) {
        const siteName = siteFilter.options[siteFilter.selectedIndex].text;
        const currentSiteName = document.getElementById('current-site-name');
        const siteIndicator = document.querySelector('.site-indicator');
        
        if (currentSiteName && siteIndicator) {
            currentSiteName.textContent = siteName;
            siteIndicator.classList.remove('d-none');
        }
    }
}

// Thêm enhance post group display vào site management
document.addEventListener('DOMContentLoaded', function() {
    // Check if loadPosts exists before trying to hook into it
    if (typeof loadPosts === 'function') {
        // We'll enhance the post display directly without trying to override displayPosts
        // Let's observe the table instead since displayPosts isn't globally accessible
        const observer = new MutationObserver(function(mutations) {
            enhancePostGroupDisplay();
        });
        
        const postsTableBody = document.getElementById('posts-table-body');
        if (postsTableBody) {
            observer.observe(postsTableBody, { 
                childList: true,
                subtree: true
            });
        }
    }
});

/**
 * Hiển thị thông báo thành công
 * @param {string} message - Nội dung thông báo
 * @param {number} duration - Thời gian hiển thị tính bằng milliseconds (mặc định: 3000ms)
 */
function showSuccessMessage(message, duration = 3000) {
    // Kiểm tra xem hàm showMessage có tồn tại không (từ main page)
    if (typeof window.showMessage === 'function') {
        window.showMessage('success', message, duration);
        return;
    }
    
    // Tự tạo toast thông báo nếu hàm showMessage không tồn tại
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        // Tạo toast container nếu chưa có
        const container = document.createElement('div');
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
    }
    
    // Tạo toast element
    const toastElement = document.createElement('div');
    toastElement.className = 'toast align-items-center text-white bg-success border-0';
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');
    toastElement.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="bi bi-check-circle-fill me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    // Thêm toast vào container
    document.querySelector('.toast-container').appendChild(toastElement);
    
    // Hiển thị toast
    const toast = new bootstrap.Toast(toastElement, {
        delay: duration,
        animation: true
    });
    toast.show();
    
    // Xóa toast khỏi DOM sau khi đã ẩn
    toastElement.addEventListener('hidden.bs.toast', function () {
        this.remove();
    });
}

/**
 * Hiển thị thông báo lỗi
 * @param {string} formId - ID của form chứa input bị lỗi (hoặc 'global' cho lỗi chung)
 * @param {string} message - Nội dung thông báo lỗi
 */
function showErrorMessage(formId, message) {
    // Kiểm tra xem hàm có tồn tại không (từ main page)
    if (formId !== 'global' && typeof window.showValidationError === 'function') {
        window.showValidationError(formId, 'general', message);
        return;
    }
    
    // Hiển thị lỗi dạng toast
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        // Tạo toast container nếu chưa có
        const container = document.createElement('div');
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
    }
    
    // Tạo toast element
    const toastElement = document.createElement('div');
    toastElement.className = 'toast align-items-center text-white bg-danger border-0';
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');
    toastElement.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    // Thêm toast vào container
    document.querySelector('.toast-container').appendChild(toastElement);
    
    // Hiển thị toast
    const toast = new bootstrap.Toast(toastElement, {
        delay: 5000,
        animation: true
    });
    toast.show();
    
    // Xóa toast khỏi DOM sau khi đã ẩn
    toastElement.addEventListener('hidden.bs.toast', function () {
        this.remove();
    });
}
