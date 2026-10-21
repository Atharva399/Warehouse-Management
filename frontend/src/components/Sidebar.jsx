import {
  Bell, Box, Building2, ChartNoAxesCombined, ChevronLeft, ClipboardList,
  ClipboardPlus, Factory, LayoutDashboard, LogOut, Package, Settings,
  ShoppingBag, ShoppingCart, Truck, Users, Warehouse,
} from 'lucide-react'

const CLERK_PAGES = ['dashboard', 'products', 'inventory', 'stock-movement']

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'inventory', label: 'Inventory', icon: Box },
  { id: 'suppliers', label: 'Suppliers', icon: Truck },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'purchase-orders', label: 'Purchase Orders', icon: ClipboardPlus },
  { id: 'sales-orders', label: 'Sales Orders', icon: ShoppingCart },
  { id: 'stock-movement', label: 'Stock Movement', icon: ClipboardList },
  { id: 'warehouses', label: 'Warehouses', icon: Warehouse },
  { id: 'employees', label: 'Employees', icon: Building2 },
  { id: 'reports', label: 'Reports', icon: ChartNoAxesCombined },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ activePage, onNavigate, isOpen, onClose, onLogout, user }) {
  const visibleItems = user?.role === 'Warehouse Clerk' ? navItems.filter(item => CLERK_PAGES.includes(item.id)) : navItems
  const initials = (user?.name || 'A U').split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-mark"><Factory size={21} /></div>
        <div><strong>StockFlow</strong><span>Warehouse Management</span></div>
        <button className="sidebar-close" onClick={onClose} aria-label="Close menu"><ChevronLeft size={20} /></button>
      </div>
      <nav className="sidebar-nav">
        <p className="nav-label">MAIN MENU</p>
        {visibleItems.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`nav-item ${activePage === id ? 'active' : ''}`} onClick={() => { onNavigate(id); onClose() }}>
            <Icon size={18} /><span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-user">
        <div className="user-avatar">{initials}</div>
        <div className="user-copy"><strong>{user?.name || 'User'}</strong><span>{user?.role || ''}</span></div>
        <button className="logout-button" title="Logout" onClick={onLogout}><LogOut size={17} /></button>
      </div>
    </aside>
  )
}
