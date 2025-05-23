# ZBase Frontend Design Document

## 1. Tổng Quan Kiến Trúc Frontend

### 1.1. Công Nghệ Sử Dụng
- **Framework**: NextJS 14+ (App Router)
- **CSS Framework**: Tailwind CSS
- **State Management**: Zustand + React Query (TanStack Query)
- **Form Handling**: React Hook Form + Zod validation
- **UI Components**: Headless UI + Radix UI
- **Charts/Visualization**: Chart.js / Recharts
- **Icons**: Heroicons / Lucide React
- **Date Handling**: date-fns
- **HTTP Client**: Axios

### 1.2. Cấu Trúc Thư Mục
```
src/
├── app/                    # NextJS App Router
│   ├── (auth)/            # Auth layout group
│   │   ├── login/
│   │   └── layout.tsx
│   ├── (admin)/           # Admin layout group
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── inventory/
│   │   ├── customers/
│   │   ├── invoices/
│   │   ├── reports/
│   │   └── layout.tsx
│   ├── (pos)/             # POS layout group
│   │   ├── sales/
│   │   ├── shifts/
│   │   └── layout.tsx
│   ├── (public)/          # Public pages
│   │   ├── page.tsx       # Landing page
│   │   ├── about/
│   │   ├── features/
│   │   └── pricing/
│   ├── api/               # API routes (if needed)
│   ├── globals.css
│   └── layout.tsx
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   ├── charts/           # Chart components
│   ├── navigation/       # Navigation components
│   └── layout/           # Layout components
├── hooks/                # Custom hooks
├── lib/                  # Utilities and configurations
├── stores/               # Zustand stores
├── types/                # TypeScript types
└── utils/                # Utility functions
```

## 2. Component Architecture

### 2.1. Design System và UI Components

#### Base UI Components (`components/ui/`)
```typescript
// Button variants
export interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
  size: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
  loading?: boolean
  disabled?: boolean
}

// Card component for dashboard widgets
export interface CardProps {
  title?: string
  description?: string
  children: React.ReactNode
  actions?: React.ReactNode
}

// Table component with sorting, filtering
export interface TableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  loading?: boolean
  pagination?: PaginationConfig
  onRowClick?: (row: T) => void
}

// Modal/Dialog system
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'
}
```

#### Form Components (`components/forms/`)
```typescript
// Standardized form inputs with validation
export interface FormInputProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'number' | 'password'
  placeholder?: string
  required?: boolean
  validation?: ZodSchema
}

// Select/Dropdown with search
export interface SelectProps<T> {
  label: string
  name: string
  options: Option<T>[]
  searchable?: boolean
  multiple?: boolean
  loading?: boolean
}

// Date picker component
export interface DatePickerProps {
  label: string
  name: string
  range?: boolean
  format?: string
}
```

### 2.2. Navigation Components

#### Header Navigation (`components/navigation/HeaderNav.tsx`)
```typescript
export interface NavItem {
  label: string
  href?: string
  icon?: React.ComponentType
  children?: NavItem[]
  permission?: string
}

export interface HeaderNavProps {
  user: User
  navItems: NavItem[]
  onLogout: () => void
}
```

#### Responsive Navigation for POS
```typescript
export interface POSNavProps {
  currentShift: Shift | null
  onOpenShift: () => void
  onCloseShift: () => void
}
```

## 3. State Management

### 3.1. Zustand Stores

#### Auth Store (`stores/authStore.ts`)
```typescript
interface AuthState {
  user: User | null
  token: string | null
  permissions: string[]
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}
```

#### UI Store (`stores/uiStore.ts`)
```typescript
interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  notifications: Notification[]
  modals: ModalState[]
  toggleSidebar: () => void
  addNotification: (notification: Notification) => void
  removeNotification: (id: string) => void
}
```

#### POS Store (`stores/posStore.ts`)
```typescript
interface POSState {
  currentShift: Shift | null
  cart: CartItem[]
  selectedCustomer: Customer | null
  paymentMethod: PaymentMethod
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  processPayment: () => Promise<Invoice>
}
```

### 3.2. React Query Configuration

#### API Hooks (`hooks/api/`)
```typescript
// Products
export const useProducts = (filters?: ProductFilters) =>
  useQuery({
    queryKey: ['products', filters],
    queryFn: () => api.products.getAll(filters),
  })

export const useProduct = (id: string) =>
  useQuery({
    queryKey: ['products', id],
    queryFn: () => api.products.getById(id),
  })

export const useCreateProduct = () =>
  useMutation({
    mutationFn: api.products.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

// Inventory
export const useInventory = (filters?: InventoryFilters) =>
  useQuery({
    queryKey: ['inventory', filters],
    queryFn: () => api.inventory.getAll(filters),
    refetchInterval: 30000, // Auto-refresh every 30s
  })

// Real-time updates for POS
export const useInventoryRealtime = (warehouseId: string) =>
  useQuery({
    queryKey: ['inventory', 'realtime', warehouseId],
    queryFn: () => api.inventory.getRealtime(warehouseId),
    refetchInterval: 5000, // Refresh every 5s for POS
  })
```

## 4. Page Layouts và Routes

### 4.1. Public Layout (`app/(public)/layout.tsx`)
```typescript
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
    </div>
  )
}
```

### 4.2. Admin Layout (`app/(admin)/layout.tsx`)
```typescript
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
```

### 4.3. POS Layout (`app/(pos)/layout.tsx`)
```typescript
export default function POSLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <POSHeader />
      <main className="p-4">{children}</main>
    </div>
  )
}
```

## 5. Specific Page Implementations

### 5.1. Landing Page (`app/(public)/page.tsx`)
```typescript
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
    </>
  )
}
```

### 5.2. Admin Dashboard (`app/(admin)/dashboard/page.tsx`)
```typescript
export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats()
  const { data: recentSales } = useRecentSales()
  const { data: lowStock } = useLowStockProducts()

  if (isLoading) return <DashboardSkeleton />

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Doanh thu hôm nay"
          value={stats?.todayRevenue}
          change={stats?.revenueChange}
          icon={CurrencyDollarIcon}
        />
        <StatsCard
          title="Đơn hàng"
          value={stats?.todayOrders}
          change={stats?.ordersChange}
          icon={ShoppingCartIcon}
        />
        <StatsCard
          title="Khách hàng mới"
          value={stats?.newCustomers}
          change={stats?.customersChange}
          icon={UserGroupIcon}
        />
        <StatsCard
          title="Tồn kho thấp"
          value={stats?.lowStockCount}
          variant="warning"
          icon={ExclamationTriangleIcon}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <TopProductsChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentSalesTable data={recentSales} />
        <LowStockAlert data={lowStock} />
      </div>
    </div>
  )
}
```

### 5.3. Product Management (`app/(admin)/products/page.tsx`)
```typescript
export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductFilters>({})
  const { data: products, isLoading } = useProducts(filters)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'code',
      header: 'Mã sản phẩm',
    },
    {
      accessorKey: 'name',
      header: 'Tên sản phẩm',
    },
    {
      accessorKey: 'category.name',
      header: 'Danh mục',
    },
    {
      accessorKey: 'basePrice',
      header: 'Giá bán',
      cell: ({ row }) => formatCurrency(row.original.basePrice),
    },
    {
      id: 'actions',
      cell: ({ row }) => <ProductActions product={row.original} />,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
        <Button onClick={() => setShowCreateModal(true)}>
          Thêm sản phẩm
        </Button>
      </div>

      <ProductFilters filters={filters} onChange={setFilters} />

      <DataTable
        data={products?.data || []}
        columns={columns}
        loading={isLoading}
        pagination={{
          total: products?.total,
          pageSize: 20,
        }}
      />

      <CreateProductModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  )
}
```

### 5.4. POS Sales Interface (`app/(pos)/sales/page.tsx`)
```typescript
export default function POSSalesPage() {
  const { cart, addToCart, removeFromCart, clearCart } = usePOSStore()
  const { data: products } = useProducts()
  const { data: customers } = useCustomers()
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products?.data || []
    return products?.data.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode?.includes(searchTerm)
    ) || []
  }, [products, searchTerm])

  return (
    <div className="h-screen flex">
      {/* Product Selection */}
      <div className="w-1/2 p-4 border-r">
        <div className="mb-4">
          <SearchInput
            placeholder="Tìm sản phẩm (tên, mã, barcode)..."
            value={searchTerm}
            onChange={setSearchTerm}
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={(qty) => addToCart(product, qty)}
            />
          ))}
        </div>
      </div>

      {/* Cart and Checkout */}
      <div className="w-1/2 p-4 flex flex-col">
        <div className="mb-4">
          <CustomerSelector
            customers={customers?.data || []}
            selected={selectedCustomer}
            onSelect={setSelectedCustomer}
          />
        </div>

        <div className="flex-1 overflow-auto mb-4">
          <CartItems
            items={cart}
            onUpdateQuantity={(id, qty) => updateQuantity(id, qty)}
            onRemove={removeFromCart}
          />
        </div>

        <CartSummary
          items={cart}
          customer={selectedCustomer}
          onCheckout={handleCheckout}
          onClear={clearCart}
        />
      </div>
    </div>
  )
}
```

## 6. Responsive Design Strategy

### 6.1. Breakpoints Strategy
```typescript
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large
}

// Admin interface: Desktop-first
// POS interface: Touch-first (tablet)
// Public pages: Mobile-first
```

### 6.2. Navigation Adaptation
```typescript
// components/navigation/ResponsiveNav.tsx
export function ResponsiveNav() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (isMobile) {
    return <MobileNavigation />
  }

  return <DesktopNavigation />
}
```

## 7. Performance Optimization

### 7.1. Code Splitting và Lazy Loading
```typescript
// Lazy load heavy components
const ReportsPage = dynamic(() => import('./ReportsPage'), {
  loading: () => <PageSkeleton />,
})

const AdvancedCharts = dynamic(() => import('./AdvancedCharts'), {
  ssr: false, // Disable SSR for client-only components
})

// Route-based code splitting
const AdminRoutes = lazy(() => import('./AdminRoutes'))
const POSRoutes = lazy(() => import('./POSRoutes'))
```

### 7.2. Image Optimization
```typescript
// components/ui/OptimizedImage.tsx
import Image from 'next/image'

export function ProductImage({ src, alt, ...props }) {
  return (
    <Image
      src={src || '/images/product-placeholder.jpg'}
      alt={alt}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
      {...props}
    />
  )
}
```

### 7.3. Caching Strategy
```typescript
// lib/queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error.status === 404) return false
        return failureCount < 3
      },
    },
  },
})
```

## 8. Error Handling và User Experience

### 8.1. Error Boundaries
```typescript
// components/ErrorBoundary.tsx
export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundaryProvider
      fallback={({ error, resetError }) => (
        <ErrorPage error={error} onRetry={resetError} />
      )}
    >
      {children}
    </ErrorBoundaryProvider>
  )
}
```

### 8.2. Loading States
```typescript
// components/ui/LoadingStates.tsx
export function TableSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse flex space-x-4">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded flex-1"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      ))}
    </div>
  )
}
```

### 8.3. Toast Notifications
```typescript
// hooks/useNotifications.ts
export function useNotifications() {
  const { addNotification } = useUIStore()

  const showSuccess = (message: string) => {
    addNotification({
      type: 'success',
      message,
      duration: 3000,
    })
  }

  const showError = (message: string) => {
    addNotification({
      type: 'error',
      message,
      duration: 5000,
    })
  }

  return { showSuccess, showError }
}
```

## 9. Security và Authentication

### 9.1. Route Protection
```typescript
// components/auth/ProtectedRoute.tsx
export function ProtectedRoute({
  children,
  permission,
}: {
  children: React.ReactNode
  permission?: string
}) {
  const { user, permissions } = useAuthStore()

  if (!user) {
    redirect('/login')
  }

  if (permission && !permissions.includes(permission)) {
    return <UnauthorizedPage />
  }

  return <>{children}</>
}
```

### 9.2. API Security
```typescript
// lib/api.ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

## 10. Testing Strategy

### 10.1. Component Testing
```typescript
// __tests__/components/ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ProductCard } from '@/components/ProductCard'

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    code: 'TEST001',
    basePrice: 100000,
  }

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} onSelect={jest.fn()} />)
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('TEST001')).toBeInTheDocument()
    expect(screen.getByText('100,000 ₫')).toBeInTheDocument()
  })

  it('calls onSelect when clicked', () => {
    const onSelect = jest.fn()
    render(<ProductCard product={mockProduct} onSelect={onSelect} />)
    
    fireEvent.click(screen.getByRole('button'))
    expect(onSelect).toHaveBeenCalledWith(1)
  })
})
```

### 10.2. Integration Testing
```typescript
// __tests__/pages/ProductsPage.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProductsPage } from '@/app/(admin)/products/page'

describe('ProductsPage', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })
  })

  it('displays products table when data is loaded', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ProductsPage />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument()
    })
  })
})
```

## 11. Deployment và Build Optimization

### 11.1. Next.js Configuration
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['your-api-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_URL}/api/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
```

### 11.2. Environment Configuration
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=ZBase
NEXT_PUBLIC_VERSION=1.0.0

# .env.production
NEXT_PUBLIC_API_URL=https://api.zbase.com/api
NEXT_PUBLIC_CDN_URL=https://cdn.zbase.com
```

## 12. Migration Plan

### Phase 1: Foundation (Week 1-2)
- Setup NextJS project với App Router
- Implement base UI components và design system
- Setup state management (Zustand + React Query)
- Create layouts cho admin, POS, và public pages

### Phase 2: Core Pages (Week 3-4)
- Landing page và public pages
- Authentication flow
- Admin dashboard
- Basic product management

### Phase 3: Advanced Features (Week 5-6)
- Complete admin interface
- POS interface
- Advanced features (reports, analytics)
- Mobile responsive optimizations

### Phase 4: Testing & Polish (Week 7-8)
- Comprehensive testing
- Performance optimization
- Security audit
- Production deployment

## 13. Best Practices và Standards

### 13.1. Code Standards
- Use TypeScript strict mode
- ESLint + Prettier configuration
- Conventional commits
- Component composition over inheritance
- Custom hooks for business logic

### 13.2. Accessibility
- ARIA labels cho interactive elements
- Keyboard navigation support
- Color contrast compliance
- Screen reader compatibility
- Focus management

### 13.3. SEO Optimization
- Meta tags management với next/head
- Structured data markup
- Sitemap generation
- Open Graph tags
- Performance metrics tracking

Tài liệu này cung cấp foundation vững chắc để phát triển frontend cho hệ thống ZBase, đảm bảo scalability, maintainability, và user experience tốt nhất.
