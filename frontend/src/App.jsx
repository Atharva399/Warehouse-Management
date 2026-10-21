import { useState } from 'react'
import Header from './components/Header'
import LoginPage from './pages/LoginPage'
import Sidebar from './components/Sidebar'
import { employees, initialCustomers, initialMovements, initialNotifications, initialProducts, initialPurchaseOrders, initialSalesOrders, initialSuppliers } from './data/mockData'
import CustomersPage from './pages/CustomersPage'
import Dashboard from './pages/Dashboard'
import EmployeesPage from './pages/EmployeesPage'
import InventoryPage from './pages/InventoryPage'
import NotificationsPage from './pages/NotificationsPage'
import ProductsPage from './pages/ProductsPage'
import PurchaseOrdersPage from './pages/PurchaseOrdersPage'
import ReportsPage from './pages/ReportsPage'
import SalesOrdersPage from './pages/SalesOrdersPage'
import SettingsPage from './pages/SettingsPage'
import StockMovementPage from './pages/StockMovementPage'
import SuppliersPage from './pages/SuppliersPage'
import WarehousesPage from './pages/WarehousesPage'

const today = '24 Sep 2026'
const stockStatus = (stock, minimum) => stock <= 0 ? 'Out of Stock' : stock <= minimum ? 'Low Stock' : 'In Stock'

const CLERK_PAGES = ['dashboard', 'products', 'inventory', 'stock-movement']

export default function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('wms-user')) } catch { return null } })
  const login = (account) => { localStorage.setItem('wms-user', JSON.stringify(account)); setActivePage('dashboard'); setUser(account) }
  const logout = () => { localStorage.removeItem('wms-user'); setUser(null) }
  if (!user) return <LoginPage onLogin={login} />
  const isClerk = user.role === 'Warehouse Clerk'
  const canAccess = (page) => !isClerk || CLERK_PAGES.includes(page)
  const [products, setProducts] = useState(initialProducts)
  const [suppliers, setSuppliers] = useState(initialSuppliers)
  const [customers, setCustomers] = useState(initialCustomers)
  const [purchaseOrders, setPurchaseOrders] = useState(initialPurchaseOrders)
  const [salesOrders, setSalesOrders] = useState(initialSalesOrders)
  const [movements, setMovements] = useState(initialMovements)
  const [notifications, setNotifications] = useState(initialNotifications)

  const saveProduct = (product) => setProducts(items => {
    const existing = items.some(item => item.id === product.id)
    const saved = { ...product, id: product.id || `PRD-${1001 + items.length}`, status: stockStatus(Number(product.stock), Number(product.minimum)) }
    return existing ? items.map(item => item.id === product.id ? saved : item) : [...items, saved]
  })
  const saveSupplier = (supplier) => setSuppliers(items => items.some(item => item.id === supplier.id) ? items.map(item => item.id === supplier.id ? supplier : item) : [...items, { ...supplier, id: `SUP-${201 + items.length}` }])
  const saveCustomer = (customer) => setCustomers(items => items.some(item => item.id === customer.id) ? items.map(item => item.id === customer.id ? customer : item) : [...items, { ...customer, id: `CUS-${301 + items.length}` }])
  const addMovement = (product, type, quantity, reference = 'Manual entry') => setMovements(items => [{ id: `MOV-${9001 + items.length}`, product: product.name, type, quantity, warehouse: product.warehouse, date: '24 Sep 2026, 12:30 PM', reference, by: 'Admin User' }, ...items])
  const changeStock = (productId, action, amount) => {
    const product = products.find(item => item.id === productId)
    if (!product) return
    setProducts(items => items.map(item => {
      if (item.id !== productId) return item
      const stock = action === 'in' ? item.stock + amount : action === 'out' ? Math.max(0, item.stock - amount) : amount
      return { ...item, stock, status: stockStatus(stock, item.minimum) }
    }))
    addMovement(product, action === 'in' ? 'Stock In' : action === 'out' ? 'Stock Out' : 'Adjustment', amount)
  }
  const createPurchaseOrder = (form) => setPurchaseOrders(items => [{ id: `PO-2026-${String(40 + items.length).padStart(3, '0')}`, supplier: form.supplier, date: today, delivery: new Date(form.delivery).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), items: form.quantity, amount: form.quantity * form.price, status: 'Draft' }, ...items])
  const createSalesOrder = ({ customer, productId, quantity }) => {
    const product = products.find(item => item.id === productId)
    if (!product) return
    const amount = product.price * quantity
    setSalesOrders(items => [{ id: `SO-2026-${String(112 + items.length).padStart(3, '0')}`, customer, date: today, items: quantity, amount, payment: 'Pending', status: 'Pending' }, ...items])
    setProducts(items => items.map(item => item.id === productId ? { ...item, stock: item.stock - quantity, status: stockStatus(item.stock - quantity, item.minimum) } : item))
    setCustomers(items => items.map(item => item.name === customer ? { ...item, orders: item.orders + 1, purchase: item.purchase + amount } : item))
    addMovement(product, 'Stock Out', quantity, 'New sales order')
  }
  const pageProps = {
    dashboard: <Dashboard products={products} suppliers={suppliers} customers={customers} salesOrders={salesOrders} purchaseOrders={purchaseOrders} onNavigate={setActivePage} />,
    products: <ProductsPage products={products} suppliers={suppliers} onSaveProduct={saveProduct} onDeleteProduct={id => setProducts(items => items.filter(item => item.id !== id))} />,
    inventory: <InventoryPage products={products} onStockChange={changeStock} />,
    suppliers: <SuppliersPage suppliers={suppliers} onSaveSupplier={saveSupplier} onDeleteSupplier={id => setSuppliers(items => items.filter(item => item.id !== id))} />,
    customers: <CustomersPage customers={customers} onSaveCustomer={saveCustomer} onDeleteCustomer={id => setCustomers(items => items.filter(item => item.id !== id))} />,
    'purchase-orders': <PurchaseOrdersPage purchaseOrders={purchaseOrders} suppliers={suppliers} products={products} onCreatePurchaseOrder={createPurchaseOrder} />,
    'sales-orders': <SalesOrdersPage salesOrders={salesOrders} customers={customers} products={products} onCreateSalesOrder={createSalesOrder} />,
    'stock-movement': <StockMovementPage movements={movements} products={products} />,
    warehouses: <WarehousesPage />,
    employees: <EmployeesPage employees={employees} />,
    reports: <ReportsPage />,
    notifications: <NotificationsPage notifications={notifications} onMarkRead={id => setNotifications(items => items.map(item => item.id === id ? { ...item, read: true } : item))} onMarkAllRead={() => setNotifications(items => items.map(item => ({ ...item, read: true })))} />,
    settings: <SettingsPage />,
  }
  const unreadCount = notifications.filter(note => !note.read).length

  return <div className="app-shell"><Sidebar activePage={activePage} onNavigate={setActivePage} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={logout} user={user} />{sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}<main className="main-area"><Header activePage={activePage} onMenuClick={() => setSidebarOpen(true)} unreadCount={unreadCount} onNavigate={page => { if (canAccess(page)) setActivePage(page) }} />{canAccess(activePage) ? pageProps[activePage] : <div className="page"><section className="content-card access-card"><h2>Access Restricted</h2><p>Your role (Warehouse Clerk) does not have permission to view this module. Please contact the administrator.</p></section></div>}</main></div>
}
