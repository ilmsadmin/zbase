# Kế Hoạch Triển Khai Hệ Thống Quản Lý Bán Hàng (Admin và POS)

Tài liệu này liệt kê các task cần thực hiện để hoàn thiện hệ thống quản lý bán hàng theo thiết kế đã được mô tả trong `POS_design.md` và `database_design.md`.

## Tình Trạng Hiện Tại (cập nhật 24/05/2025)
- **Hoàn thành**: Tất cả các module Backend đã được phát triển và kiểm thử
- **Hoàn thành**: Phần Admin Dashboard, quản lý kho hàng, quản lý sản phẩm, quản lý tồn kho và quản lý bảo hành
- **Hoàn thành**: Quản lý giao dịch (transactions)
- **Hoàn thành**: Tích hợp máy quét mã vạch (barcode scanner) cho POS với hỗ trợ đa định dạng mã vạch và chế độ ngoại tuyến
- **Hoàn thành**: Trang chủ (landing page) với đầy đủ các section và animation
- **Hoàn thành**: Báo cáo và phân tích (Reports & Analytics)
- **Đang triển khai**: Phần quản lý khách hàng, đối tác, hóa đơn và các chức năng còn lại của POS
- **Kế hoạch tiếp theo**: Tiếp tục phát triển giao diện POS và hoàn thiện System Settings

## 1. Cơ Sở Dữ Liệu

### 1.1. Prisma Schema
- [x] Tạo schema ban đầu (đã hoàn thành)
- [x] Hoàn thiện chi tiết cho các bảng còn thiếu (InvoiceItem, PriceList, PriceListItem, Transaction, Warranty)
- [x] Thêm các constraints và relationships còn thiếu
- [x] Tạo và áp dụng migrations

### 1.2. MongoDB
- [x] Thiết lập MongoDB schema validation
- [x] Tạo các collections: logs, inventory_logs, sales_analytics, analytics_reports, forecasting_models
- [x] Viết service để tương tác với MongoDB

### 1.3. Redis
- [x] Thiết lập Redis key patterns
- [x] Hoàn thiện service caching cho:
  - [x] Session management
  - [x] Product caching  - [x] Customer và Group caching
  - [x] Warehouse Location caching
  - [x] Report caching

## 2. Modules Backend (NestJS)

### 2.1. Modules Cơ Bản
- [x] Users module (đã hoàn thành)
- [x] Auth module (đã hoàn thành)
- [x] Roles module (đã hoàn thành)
- [x] Permissions module (đã hoàn thành)
- [x] Bổ sung permission cho các roles mới (admin, pos) - đã cài đặt
- [x] Vô hiệu hóa chức năng tự động quét controllers để tạo permissions
- [x] Cập nhật permissions cho các module mới (warehouses, products, v.v)

### 2.2. Module Kho Hàng
- [x] Tạo Warehouses module
  - [x] Controller
  - [x] Service
  - [x] DTO
  - [x] Tests
- [x] Tạo Warehouse-Locations module
  - [x] Controller
  - [x] Service
  - [x] DTO
  - [x] Tests

### 2.3. Module Sản Phẩm
- [x] Tạo Products module
  - [x] Controller
  - [x] Service
  - [x] DTO
  - [x] Tests
- [x] Tạo ProductCategories module
  - [x] Controller
  - [x] Service
  - [x] DTO
  - [x] Tests
- [x] Tạo ProductAttributes module
  - [x] Controller
  - [x] Service
  - [x] DTO
  - [x] Tests

### 2.4. Module Inventory
- [x] Tạo Inventory module
  - [x] Controller
  - [x] Service
  - [x] DTO
  - [x] Tests
- [x] Tạo InventoryTransactions module (đã tích hợp vào Inventory)
- [x] Cập nhật schema Prisma để phù hợp với module Inventory

### 2.5. Module Khách Hàng
- [x] Tạo Customers module
  - [x] Controller
  - [x] Service
  - [x] DTO
  - [x] Tests
- [x] Tạo CustomerGroups module
  - [x] Controller
  - [x] Service
  - [x] DTO
  - [x] Tests
- [x] Cập nhật schema Prisma để phù hợp với module Customers và CustomerGroups

### 2.6. Module Đối Tác
- [x] Tạo Partners module
  - [x] Controller
  - [x] Service
  - [x] DTO
  - [x] Tests

### 2.7. Module Bán Hàng
- [x] Tạo Invoices module
  - [x] Controller
  - [x] Service
  - [x] DTO
  - [x] Tests
- [x] Tạo InvoiceItems module (đã tích hợp vào Invoices)

### 2.8. Module POS
- [x] Tạo Shifts module
  - [x] Controller
  - [x] Service
  - [x] DTO
  - [x] Tests
- [x] Tạo POS module tích hợp:
  - [x] Quản lý ca làm việc
  - [x] Bán hàng nhanh
  - [x] Kiểm tra tồn kho real-time

### 2.9. Module Giá và Khuyến Mãi
- [x] Tạo PriceLists module
  - [x] Controller
  - [x] Service
  - [x] DTO
  - [x] Tests

### 2.10. Module Thu Chi
- [x] Tạo Transactions module
  - [x] Controller
  - [x] Service
  - [x] DTO
  - [x] Tests

### 2.11. Module Bảo Hành
- [x] Tạo Warranties module
  - [x] Controller
  - [x] Service
  - [x] DTO
  - [x] Tests

### 2.12. Module Báo Cáo
- [x] Tạo Reports module
  - [x] Controller
  - [x] Service
  - [x] Tích hợp với MongoDB cho phân tích nâng cao
  - [x] DTO
  - [x] Tests
- [x] Tạo Report Templates module
  - [x] Controller
  - [x] Service
  - [x] DTO

## 3. Frontend (NextJS + Tailwind CSS)

### 3.1. Cài Đặt và Cấu Hình Cơ Bản
- [x] Khởi tạo NextJS 15+ project với App Router
  - [x] Cài đặt NextJS với TypeScript
  - [x] Cấu hình tsconfig.json cho strict mode
  - [x] Setup path aliases (@/components, @/lib, etc.)
- [x] Cài đặt và cấu hình Tailwind CSS
  - [x] Install Tailwind CSS và dependencies
  - [x] Cấu hình tailwind.config.js với custom theme
  - [x] Setup global styles và CSS variables
- [x] Cài đặt các dependencies chính
  - [x] State management: Zustand
  - [x] Data fetching: TanStack Query (React Query)
  - [x] Form handling: React Hook Form + Zod
  - [x] UI components: Headless UI, Radix UI
  - [x] Icons: Heroicons, Lucide React
  - [x] Charts: Chart.js hoặc Recharts
  - [x] Date handling: date-fns
  - [x] HTTP client: Axios
- [x] Setup cấu trúc thư mục theo design
  - [x] Tạo cấu trúc app/, components/, hooks/, lib/, stores/, types/, utils/
  - [x] Setup layout groups: (auth), (admin), (pos), (public)

### 3.2. Core Infrastructure

#### 3.2.1. Authentication & Authorization
- [x] Tạo auth store với Zustand
  - [x] Define auth state interface
  - [x] Implement login/logout actions
  - [x] Token management (localStorage/cookies)
  - [x] Permission checking utilities
- [x] Tạo auth hooks
  - [x] useAuth() hook
  - [x] usePermission() hook (tích hợp trong useAuth)
  - [x] useRequireAuth() hook với redirect (tích hợp trong useAuth)
- [x] Implement ProtectedRoute component
  - [x] Route protection wrapper
  - [x] Permission-based rendering
  - [x] Loading và redirect states
- [x] Setup axios interceptors
  - [x] Request interceptor cho auth headers
  - [x] Response interceptor cho 401 handling
  - [x] Token refresh logic

#### 3.2.2. API Integration Layer
- [x] Tạo base API configuration
  - [x] Axios instance với base URL
  - [x] Common request/response types
  - [x] Error handling utilities
- [x] Implement API service modules
  - [x] Auth API service
  - [x] Products API service
  - [x] Inventory API service
  - [x] Customers API service
  - [x] Invoices API service
  - [x] Reports API service
  - [x] POS API service
- [x] Setup React Query
  - [x] QueryClient configuration
  - [x] Default options (staleTime, gcTime, etc.)
  - [x] Error và loading handling

#### 3.2.3. UI Component Library
- [x] Base UI Components
  - [x] Button component với variants
  - [x] Input components (text, number, email, etc.)
  - [x] Select/Dropdown component
  - [x] Modal/Dialog system
  - [x] Card component
  - [x] Badge component
  - [x] Alert/Notification component
  - [x] Spinner/Loading component
- [x] Form Components
  - [x] FormInput với validation
  - [x] FormSelect với search
  - [x] FormTextarea
  - [x] FormCheckbox/Radio
  - [x] FormDatePicker
  - [x] FormFileUpload
- [x] Data Display Components
  - [x] DataTable với sorting/filtering
  - [x] Pagination component
  - [x] EmptyState component
  - [x] Skeleton loaders
- [x] Layout Components
  - [x] Page container
  - [x] Section component
  - [x] Grid/Flex utilities

### 3.3. Public Pages (Landing & Marketing)

#### 3.3.1. Layout và Navigation
- [x] Public layout wrapper
  - [x] Header với navigation menu
  - [x] Footer với links và info
  - [x] Responsive mobile menu
- [x] Navigation components
  - [x] Desktop navigation bar
  - [x] Mobile hamburger menu
  - [x] Dropdown menus cho sub-items

#### 3.3.2. Landing Page
- [x] Hero section
  - [x] Banner với CTA buttons
  - [x] Background image/gradient
  - [x] Responsive typography
- [x] Features section
  - [x] Feature cards với icons
  - [x] Grid layout responsive
  - [x] Animations on scroll
- [x] Stats section
  - [x] Counter animations
  - [x] Stats cards
- [x] Testimonials section
  - [x] Testimonial cards
  - [x] Carousel/slider
- [x] CTA section
  - [x] Contact form
  - [x] CTA buttons

#### 3.3.3. Other Public Pages
- [x] About page (/about)
  - [x] Company info section
  - [x] Team section
  - [x] Mission/Vision
- [x] Features page (/features)
  - [x] Detailed feature list
  - [x] Feature categories
  - [x] Demo videos/images
- [x] Pricing page (/pricing)
  - [x] Pricing table
  - [x] Feature comparison
  - [x] FAQ section
- [x] Contact page (/contact)
  - [x] Contact form
  - [x] Office info
  - [x] Map integration

### 3.4. Authentication Pages

#### 3.4.1. Login Page
- [x] Login form component
  - [x] Email/password inputs
  - [x] Remember me checkbox
  - [x] Form validation
  - [x] Error handling
- [x] Login page layout
  - [x] Split screen design
  - [x] Branding section
  - [x] Responsive design
- [x] Forgot password link
- [x] Integration với auth API

#### 3.4.2. Additional Auth Pages
- [x] Forgot password page
  - [x] Email input form
  - [x] Success message
- [x] Reset password page
  - [x] New password form
  - [x] Token validation

### 3.5. Admin Interface

#### 3.5.1. Admin Layout và Navigation
- [x] Admin layout wrapper
  - [x] Header với user menu
  - [x] Horizontal navigation menu
  - [x] Breadcrumb navigation
  - [x] Notification dropdown
- [x] Admin navigation
  - [x] Main menu items
  - [x] Dropdown submenus
  - [x] Active state styling
  - [x] Permission-based menu filtering
- [x] User menu dropdown
  - [x] Profile link
  - [x] Settings link
  - [x] Logout option

#### 3.5.2. Dashboard
- [x] Dashboard page structure
  - [x] Stats cards grid
  - [x] Charts section
  - [x] Recent activity section
- [x] Stats cards
  - [x] Revenue card
  - [x] Orders card
  - [x] Customers card
  - [x] Low stock alert card
- [x] Revenue chart component
  - [x] Line/bar chart
  - [x] Period selector
  - [x] Data fetching
- [x] Top products widget
  - [x] Product list
  - [x] Sales metrics
- [x] Recent sales table
  - [x] Transaction list
  - [x] Quick actions
- [x] Low stock alerts
  - [x] Product alerts
  - [x] Quick reorder actions

#### 3.5.3. Product Management
- [x] Products list page
  - [x] Search và filter bar
  - [x] Products data table
  - [x] Bulk actions
  - [x] Add product button
- [x] Product form modal/page
  - [x] Basic info fields
  - [x] Category selector
  - [x] Price inputs
  - [x] Attributes management
  - [x] Image upload
  - [x] Form validation
- [x] Product details page
  - [x] Product info display
  - [x] Inventory by warehouse
  - [x] Price history
  - [x] Edit/Delete actions
- [x] Categories management
  - [x] Category tree view
  - [x] Add/Edit category modal
  - [x] Drag-drop reordering

#### 3.5.4. Inventory Management
- [x] Inventory list page
  - [x] Warehouse filter
  - [x] Product search
  - [x] Stock level filters
  - [x] Inventory table
- [x] Stock adjustment modal
  - [x] Product selector
  - [x] Quantity input
  - [x] Reason selector
  - [x] Notes field
- [x] Transfer inventory modal
  - [x] Source/destination warehouse
  - [x] Products selector
  - [x] Quantity inputs
- [x] Inventory history
  - [x] Transaction list
  - [x] Filter by type
  - [x] Date range picker

#### 3.5.5. Warehouse Management
- [x] Warehouses list page
  - [x] Warehouse cards/table
  - [x] Add warehouse button
  - [x] Quick stats per warehouse
- [x] Warehouse form modal
  - [x] Basic info fields
  - [x] Address inputs
  - [x] Manager selector
- [x] Warehouse details page
  - [x] Warehouse info
  - [x] Location tree view
  - [x] Inventory summary
- [x] Location management
  - [x] Location tree (zones/aisles/racks)
  - [x] Add location modal
  - [x] Edit/Delete actions

#### 3.5.6. Customer Management
- [x] Customers list page
  - [x] Search bar
  - [x] Group filter
  - [x] Customer table
  - [x] Add customer button
- [x] Customer form modal
  - [x] Personal info fields
  - [x] Contact fields
  - [x] Group selector
  - [x] Credit limit
- [x] Customer details page
  - [x] Customer info tabs
  - [x] Purchase history
  - [x] Credit/debt info
  - [x] Notes section
- [x] Customer groups page
  - [x] Groups list
  - [x] Add/Edit group modal
  - [x] Discount settings
  - [x] Member count

#### 3.5.7. Invoice Management
- [x] Invoices list page
  - [x] Date range filter
  - [x] Status filter
  - [x] Customer search
  - [x] Invoices table
- [x] Create invoice page
  - [x] Customer selector
  - [x] Product search/add
  - [x] Cart/items list
  - [x] Discount inputs
  - [x] Payment info
  - [x] Save/Print actions
- [x] Invoice details page
  - [x] Invoice header info
  - [x] Items table
  - [x] Payment status
  - [x] Print/Email actions
- [x] Invoice templates
  - [x] Default template
  - [x] Thermal printer template
  - [x] A4 template

#### 3.5.8. Financial Management
- [x] Transactions list page
  - [x] Type filter (receipt/payment)
  - [x] Date range picker
  - [x] Transactions table
  - [x] Add transaction button
- [x] Transaction form modal
  - [x] Type selector
  - [x] Amount input
  - [x] Customer/Partner selector
  - [x] Payment method
  - [x] Notes field
- [x] Debt management
  - [x] Customer debts tab
  - [x] Partner debts tab
  - [x] Aging analysis
  - [x] Collection actions

#### 3.5.9. Reports & Analytics
- [x] Reports dashboard
  - [x] Report categories
  - [x] Quick stats
  - [x] Saved reports
- [x] Revenue reports
  - [x] Date range selector
  - [x] Group by options
  - [x] Revenue chart
  - [x] Detailed table
  - [x] Export actions
- [x] Inventory reports
  - [x] Stock value report
  - [x] Movement report
  - [x] Low stock report
  - [x] Expiry report
- [x] Customer reports
  - [x] Customer ranking
  - [x] Purchase analysis
  - [x] Debt reports
- [x] Custom report builder
  - [x] Metric selector
  - [x] Filter builder
  - [x] Visualization options
  - [x] Save/Schedule options

#### 3.5.10. System Settings
- [x] User management
  - [x] Users list
  - [x] Add/Edit user modal
  - [x] Role assignment
  - [x] Active/Inactive toggle
- [x] Role management
  - [x] Roles list
  - [x] Permission matrix
  - [x] Add/Edit role modal
- [x] Company settings
  - [x] Company info form
  - [x] Logo upload
  - [x] Tax settings
  - [x] Currency settings
- [x] System configuration
  - [x] Email settings
  - [x] Notification preferences
  - [x] Backup settings
  - [x] API keys management

### 3.6. POS Interface

#### 3.6.1. POS Layout
- [ ] POS layout wrapper
  - [ ] Simplified header
  - [ ] Touch-optimized design
  - [ ] Full-screen mode
- [ ] POS navigation
  - [ ] Main action buttons
  - [ ] Shift info display
  - [ ] Quick access menu

#### 3.6.2. Shift Management
- [ ] Open shift modal
  - [ ] Starting cash input
  - [ ] Warehouse selector
  - [ ] Notes field
- [ ] Close shift page
  - [ ] Sales summary
  - [ ] Cash reconciliation
  - [ ] Closing notes
  - [ ] Print report option
- [ ] Shift info display
  - [ ] Current shift stats
  - [ ] Quick actions

#### 3.6.3. POS Sales Interface
- [ ] Product grid/list
  - [ ] Category tabs
  - [ ] Product cards
  - [ ] Quick search bar
  - [ ] Barcode scanner input
- [ ] Shopping cart
  - [ ] Cart items list
  - [ ] Quantity controls
  - [ ] Item removal
  - [ ] Discount inputs
  - [ ] Subtotal display
- [ ] Customer section
  - [ ] Customer search
  - [ ] Quick add customer
  - [ ] Customer info display
  - [ ] Loyalty points (if applicable)
- [ ] Payment section
  - [ ] Total amount display
  - [ ] Payment method selector
  - [ ] Cash calculator
  - [ ] Change display
  - [ ] Complete sale button
- [ ] Quick actions
  - [ ] Hold sale
  - [ ] Retrieve held sale
  - [ ] Void item
  - [ ] Apply discount

#### 3.6.4. POS Additional Features
- [ ] Product quick view
  - [ ] Product details modal
  - [ ] Stock availability
  - [ ] Price variations
- [ ] Receipt preview
  - [ ] Receipt template
  - [ ] Print options
  - [ ] Email receipt option
- [ ] Sales history
  - [ ] Today's sales list
  - [ ] Quick filters
  - [ ] Reprint receipt
- [ ] Offline mode
  - [ ] Local storage sync
  - [ ] Offline indicator
  - [ ] Queue management
  - [ ] Sync on reconnect

### 3.7. Shared Features

#### 3.7.1. Search Components
- [ ] Global search
  - [ ] Search modal
  - [ ] Multi-entity search
  - [ ] Recent searches
  - [ ] Quick results
- [ ] Product search
  - [ ] Autocomplete
  - [ ] Barcode support
  - [ ] Filter options
- [ ] Customer search
  - [ ] Name/phone/email search
  - [ ] Quick add option
  - [ ] Recent customers

#### 3.7.2. Notification System
- [ ] Toast notifications
  - [ ] Success messages
  - [ ] Error messages
  - [ ] Info messages
  - [ ] Auto-dismiss
- [ ] Push notifications
  - [ ] Low stock alerts
  - [ ] New orders
  - [ ] System updates
- [ ] Notification center
  - [ ] Notification list
  - [ ] Mark as read
  - [ ] Filter by type

#### 3.7.3. Print System
- [ ] Print preview modal
  - [ ] Template preview
  - [ ] Print options
  - [ ] Page setup
- [ ] Print templates
  - [ ] Invoice templates
  - [ ] Receipt templates
  - [ ] Report templates
- [ ] Printer configuration
  - [ ] Default printer
  - [ ] Paper size options
  - [ ] Thermal printer support

### 3.8. Mobile Responsive

#### 3.8.1. Responsive Components
- [ ] Mobile navigation
  - [ ] Bottom tab bar
  - [ ] Slide-out menu
  - [ ] Touch gestures
- [ ] Mobile-optimized tables
  - [ ] Card view on mobile
  - [ ] Horizontal scroll
  - [ ] Collapsed columns
- [ ] Mobile forms
  - [ ] Full-width inputs
  - [ ] Native selectors
  - [ ] Touch-friendly buttons

#### 3.8.2. Progressive Web App
- [ ] PWA configuration
  - [ ] Manifest file
  - [ ] Service worker
  - [ ] Offline pages
- [ ] Install prompts
  - [ ] Add to home screen
  - [ ] Update notifications
- [ ] Push notifications
  - [ ] Permission request
  - [ ] Notification handling

### 3.9. Performance Optimization

#### 3.9.1. Code Optimization
- [ ] Route-based code splitting
  - [ ] Lazy load admin routes
  - [ ] Lazy load POS routes
  - [ ] Dynamic imports
- [ ] Component optimization
  - [ ] React.memo cho expensive components
  - [ ] useMemo/useCallback optimization
  - [ ] Virtual scrolling cho long lists
- [ ] Image optimization
  - [ ] Next.js Image component
  - [ ] Lazy loading images
  - [ ] Responsive images
  - [ ] WebP format support

#### 3.9.2. Data Optimization
- [ ] API response caching
  - [ ] React Query cache config
  - [ ] Stale-while-revalidate
  - [ ] Background refetch
- [ ] Pagination implementation
  - [ ] Server-side pagination
  - [ ] Infinite scroll option
  - [ ] Page size options
- [ ] Data prefetching
  - [ ] Prefetch on hover
  - [ ] Route prefetching
  - [ ] Related data prefetch

### 3.10. Testing

#### 3.10.1. Unit Tests
- [ ] Component tests
  - [ ] UI component tests
  - [ ] Form component tests
  - [ ] Utility function tests
- [ ] Hook tests
  - [ ] Custom hook tests
  - [ ] API hook tests
- [ ] Store tests
  - [ ] Zustand store tests
  - [ ] Action tests

#### 3.10.2. Integration Tests
- [ ] Page tests
  - [ ] Page rendering tests
  - [ ] User flow tests
  - [ ] API integration tests
- [ ] E2E tests
  - [ ] Critical user paths
  - [ ] Form submissions
  - [ ] Payment flows

### 3.11. Documentation

#### 3.11.1. Component Documentation
- [ ] Storybook setup
  - [ ] Component stories
  - [ ] Props documentation
  - [ ] Usage examples
- [ ] README files
  - [ ] Setup instructions
  - [ ] Development guide
  - [ ] Deployment guide

#### 3.11.2. API Documentation
- [ ] API usage guide
  - [ ] Authentication flow
  - [ ] Common patterns
  - [ ] Error handling
- [ ] Type definitions
  - [ ] API response types
  - [ ] Component prop types
  - [ ] Store state types

### 3.12. Deployment

#### 3.12.1. Build Configuration
- [ ] Environment setup
  - [ ] Development env
  - [ ] Staging env
  - [ ] Production env
- [ ] Build optimization
  - [ ] Bundle analysis
  - [ ] Tree shaking
  - [ ] Minification

#### 3.12.2. CI/CD Pipeline
- [ ] GitHub Actions setup
  - [ ] Test pipeline
  - [ ] Build pipeline
  - [ ] Deploy pipeline
- [ ] Docker configuration
  - [ ] Dockerfile for frontend
  - [ ] Multi-stage build
  - [ ] Nginx configuration

## 4. Integration Testing

### 4.1. Frontend-Backend Integration
- [ ] API endpoint testing
- [ ] Authentication flow testing
- [ ] Real-time updates testing
- [ ] File upload testing

### 4.2. Third-party Integrations
- [ ] Payment gateway integration
- [ ] Email service integration
- [ ] SMS service integration
- [ ] Barcode scanner integration

## 5. Deployment và DevOps

### 5.1. Docker Setup
- [ ] Update docker-compose.yml for frontend service
- [ ] Configure nginx reverse proxy
- [ ] Setup SSL certificates
- [ ] Configure environment variables

### 5.2. Production Deployment
- [ ] Setup production server
- [ ] Configure domain và DNS
- [ ] Setup monitoring (PM2, logs)
- [ ] Backup strategy implementation

## 6. Post-Launch

### 6.1. Monitoring và Maintenance
- [ ] Setup error tracking (Sentry)
- [ ] Performance monitoring
- [ ] User analytics
- [ ] Regular security updates

### 6.2. Continuous Improvement
- [ ] User feedback collection
- [ ] Feature prioritization
- [ ] Performance optimization
- [ ] Security audits

## Ưu tiên triển khai Frontend

### Phase 1: Foundation (Tuần 1-2)
1. Setup NextJS project và dependencies
2. Core infrastructure (auth, API, stores)
3. Base UI components
4. Public pages (landing, pricing)

### Phase 2: Authentication & Admin Base (Tuần 3-4)
1. Login/Auth pages
2. Admin layout và navigation
3. Dashboard page
4. Basic CRUD pages (products, customers)

### Phase 3: Core Features (Tuần 5-6)
1. Complete product management
2. Inventory management
3. Invoice creation và management
4. Basic reports

### Phase 4: POS & Advanced Features (Tuần 7-8)
1. POS interface
2. Advanced reports và analytics
3. System settings
4. Mobile optimization

### Phase 5: Polish & Deploy (Tuần 9-10)
1. Testing và bug fixes
2. Performance optimization
3. Documentation
4. Production deployment


