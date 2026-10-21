import { Bell, Menu, Search } from 'lucide-react'

const pageTitles = {
  dashboard: 'Dashboard', products: 'Products', inventory: 'Inventory', suppliers: 'Suppliers', customers: 'Customers',
  'purchase-orders': 'Purchase Orders', 'sales-orders': 'Sales Orders', 'stock-movement': 'Stock Movement',
  warehouses: 'Warehouses', employees: 'Employees', reports: 'Reports', notifications: 'Notifications', settings: 'Settings',
}

export default function Header({ activePage, onMenuClick, unreadCount, onNavigate }) {
  return (
    <header className="top-header">
      <div className="header-title-group">
        <button className="menu-button" onClick={onMenuClick} aria-label="Open menu"><Menu size={22} /></button>
        <div><h1>{pageTitles[activePage]}</h1><p>Manage your warehouse operations</p></div>
      </div>
      <div className="header-actions">
        <label className="header-search"><Search size={17} /><input placeholder="Search anything..." /></label>
        <button className="notification-button" onClick={() => onNavigate('notifications')} aria-label="Notifications">
          <Bell size={20} />{unreadCount > 0 && <span>{unreadCount}</span>}
        </button>
      </div>
    </header>
  )
}
