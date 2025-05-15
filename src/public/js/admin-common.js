/**
 * Các chức năng chung cho trang quản trị
 * filepath: d:\www\zbase\src\public\js\admin-common.js
 */

document.addEventListener('DOMContentLoaded', function() {
    // Xử lý đăng xuất
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Hiển thị tên người dùng hiện tại
    updateCurrentUser();
});

/**
 * Đăng xuất người dùng
 */
function logout() {
    fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Logout failed');
        }
        return response.json();
    })
    .then(() => {
        // Chuyển hướng đến trang đăng nhập
        window.location.href = '/login';
    })
    .catch(error => {
        console.error('Logout error:', error);
        showToast('error', 'Failed to logout: ' + error.message);
    });
}

/**
 * Cập nhật thông tin người dùng hiện tại
 */
function updateCurrentUser() {
    const userNameElement = document.getElementById('user-name');
    
    if (!userNameElement) return;
    
    fetch('/api/auth/me', {
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to get user info');
        }
        return response.json();
    })
    .then(data => {
        if (data.email) {
            userNameElement.textContent = data.email;
        }
    })
    .catch(error => {
        console.error('Error getting user info:', error);
    });
}

/**
 * Hiển thị thông báo dạng toast
 * @param {string} type Loại thông báo ('success', 'error', 'info', 'warning')
 * @param {string} message Nội dung thông báo
 * @param {number} duration Thời gian hiển thị (ms)
 */
function showToast(type, message, duration = 3000) {
    // Tạo container toast nếu chưa có
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }
    
    // Thiết lập màu sắc và icon dựa vào loại thông báo
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
    
    // Tạo phần tử toast
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
    
    // Thêm toast vào container
    toastContainer.appendChild(toastElement);
    
    // Hiển thị toast
    const toast = new bootstrap.Toast(toastElement, {
        delay: duration,
        animation: true
    });
    toast.show();
    
    // Xóa toast khỏi DOM sau khi đã ẩn
    toastElement.addEventListener('hidden.bs.toast', function() {
        this.remove();
    });
}

/**
 * Hiển thị thông báo lỗi trong form
 * @param {string} elementId ID của phần tử hiển thị lỗi
 * @param {string} message Nội dung lỗi
 */
function showErrorMessage(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('d-none');
    }
}

/**
 * Format giá tiền với đơn vị tiền tệ
 * @param {number} price Số tiền cần format
 * @returns {string} Chuỗi định dạng tiền tệ
 */
function formatCurrency(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

/**
 * Format ngày tháng
 * @param {string} dateString Chuỗi ngày tháng
 * @returns {string} Ngày tháng đã được định dạng
 */
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

/**
 * Tạo đường dẫn URL an toàn từ chuỗi
 * @param {string} str Chuỗi đầu vào
 * @returns {string} Chuỗi đã được chuyển đổi thành dạng slug
 */
function slugify(str) {
    return str
        .toLowerCase()
        .normalize('NFD') 
        .replace(/[\u0300-\u036f]/g, '') 
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '') 
        .replace(/[\s-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Làm ngắn chuỗi và thêm dấu ba chấm nếu quá dài
 * @param {string} str Chuỗi cần rút gọn
 * @param {number} length Độ dài tối đa
 * @returns {string} Chuỗi đã được rút gọn
 */
function truncateString(str, length = 50) {
    if (!str) return '';
    if (str.length <= length) return str;
    return str.substring(0, length) + '...';
}
