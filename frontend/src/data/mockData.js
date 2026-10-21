export const initialProducts = [
  { id: 'PRD-1001', name: 'Wireless Mouse', sku: 'WM-LOG-001', category: 'Electronics', supplier: 'TechSource India', price: 799, stock: 12, minimum: 20, warehouse: 'Pune Central', status: 'Low Stock', description: 'Ergonomic 2.4 GHz wireless mouse' },
  { id: 'PRD-1002', name: 'A4 Copier Paper Box', sku: 'CP-A4-500', category: 'Office Supplies', supplier: 'PaperPlus Solutions', price: 2850, stock: 84, minimum: 25, warehouse: 'Pune Central', status: 'In Stock', description: 'Box of 5 reams, 75 GSM' },
  { id: 'PRD-1003', name: 'USB-C Charging Cable', sku: 'UC-1M-003', category: 'Electronics', supplier: 'TechSource India', price: 299, stock: 0, minimum: 15, warehouse: 'Chakan Warehouse', status: 'Out of Stock', description: '1 metre braided USB-C cable' },
  { id: 'PRD-1004', name: 'Steel Water Bottle', sku: 'SWB-750-02', category: 'Home & Kitchen', supplier: 'Urban Home Supplies', price: 540, stock: 46, minimum: 12, warehouse: 'Pune Central', status: 'In Stock', description: '750 ml insulated steel bottle' },
  { id: 'PRD-1005', name: 'Notebook Set', sku: 'NB-A5-SET', category: 'Stationery', supplier: 'PaperPlus Solutions', price: 450, stock: 18, minimum: 20, warehouse: 'Pimpri Store', status: 'Low Stock', description: 'Set of 3 A5 ruled notebooks' },
  { id: 'PRD-1006', name: 'LED Desk Lamp', sku: 'LDL-12W-05', category: 'Electronics', supplier: 'BrightLite Traders', price: 1199, stock: 31, minimum: 10, warehouse: 'Chakan Warehouse', status: 'In Stock', description: '12W adjustable LED desk lamp' },
  { id: 'PRD-1007', name: 'Packing Tape Roll', sku: 'PTR-48-06', category: 'Packaging', supplier: 'PackRight India', price: 85, stock: 9, minimum: 25, warehouse: 'Pune Central', status: 'Low Stock', description: '48 mm clear packing tape' },
  { id: 'PRD-1008', name: 'Bluetooth Keyboard', sku: 'BK-104-08', category: 'Electronics', supplier: 'TechSource India', price: 1599, stock: 22, minimum: 8, warehouse: 'Pimpri Store', status: 'In Stock', description: 'Compact Bluetooth keyboard' },
]

export const initialSuppliers = [
  { id: 'SUP-201', name: 'TechSource India', contact: 'Rohan Mehta', phone: '+91 98220 11872', email: 'rohan@techsource.in', address: 'Baner, Pune, Maharashtra', products: 3, status: 'Active' },
  { id: 'SUP-202', name: 'PaperPlus Solutions', contact: 'Sneha Kulkarni', phone: '+91 97655 42031', email: 'sales@paperplus.in', address: 'Bhosari, Pune, Maharashtra', products: 2, status: 'Active' },
  { id: 'SUP-203', name: 'Urban Home Supplies', contact: 'Amit Shah', phone: '+91 98901 55016', email: 'amit@urbanhome.in', address: 'Viman Nagar, Pune, Maharashtra', products: 1, status: 'Active' },
  { id: 'SUP-204', name: 'BrightLite Traders', contact: 'Priya Nair', phone: '+91 99752 88219', email: 'contact@brightlite.in', address: 'Nashik, Maharashtra', products: 1, status: 'Inactive' },
  { id: 'SUP-205', name: 'PackRight India', contact: 'Vikram Joshi', phone: '+91 98811 63412', email: 'orders@packright.in', address: 'Hadapsar, Pune, Maharashtra', products: 1, status: 'Active' },
]

export const initialCustomers = [
  { id: 'CUS-301', name: 'Aarav Enterprises', phone: '+91 98765 41026', email: 'orders@aaraventerprises.in', address: 'Kothrud, Pune, Maharashtra', orders: 14, purchase: 48500, status: 'Active' },
  { id: 'CUS-302', name: 'Shree Office Solutions', phone: '+91 99228 77154', email: 'purchase@shreeoffice.in', address: 'Wakad, Pune, Maharashtra', orders: 9, purchase: 32750, status: 'Active' },
  { id: 'CUS-303', name: 'Bluebird Technologies', phone: '+91 97631 22980', email: 'admin@bluebirdtech.in', address: 'Hinjawadi, Pune, Maharashtra', orders: 7, purchase: 28600, status: 'Active' },
  { id: 'CUS-304', name: 'Campus Corner', phone: '+91 98501 60017', email: 'contact@campuscorner.in', address: 'Shivajinagar, Pune, Maharashtra', orders: 5, purchase: 14900, status: 'Inactive' },
  { id: 'CUS-305', name: 'Morya Retail', phone: '+91 96045 36912', email: 'moryaretail@gmail.com', address: 'Aundh, Pune, Maharashtra', orders: 11, purchase: 41700, status: 'Active' },
]

export const initialPurchaseOrders = [
  { id: 'PO-2026-043', supplier: 'TechSource India', date: '18 Sep 2026', delivery: '28 Sep 2026', items: 4, amount: 42500, status: 'Pending' },
  { id: 'PO-2026-042', supplier: 'PaperPlus Solutions', date: '15 Sep 2026', delivery: '22 Sep 2026', items: 2, amount: 18250, status: 'Approved' },
  { id: 'PO-2026-041', supplier: 'PackRight India', date: '11 Sep 2026', delivery: '18 Sep 2026', items: 3, amount: 9600, status: 'Received' },
  { id: 'PO-2026-040', supplier: 'Urban Home Supplies', date: '06 Sep 2026', delivery: '16 Sep 2026', items: 2, amount: 14400, status: 'Draft' },
]

export const initialSalesOrders = [
  { id: 'SO-2026-116', customer: 'Aarav Enterprises', date: '24 Sep 2026', items: 5, amount: 7240, payment: 'Paid', status: 'Processing' },
  { id: 'SO-2026-115', customer: 'Bluebird Technologies', date: '23 Sep 2026', items: 3, amount: 4890, payment: 'Pending', status: 'Pending' },
  { id: 'SO-2026-114', customer: 'Morya Retail', date: '22 Sep 2026', items: 7, amount: 11560, payment: 'Paid', status: 'Shipped' },
  { id: 'SO-2026-113', customer: 'Shree Office Solutions', date: '20 Sep 2026', items: 4, amount: 3890, payment: 'Paid', status: 'Delivered' },
  { id: 'SO-2026-112', customer: 'Campus Corner', date: '18 Sep 2026', items: 2, amount: 1350, payment: 'Refunded', status: 'Cancelled' },
]

export const initialMovements = [
  { id: 'MOV-9001', product: 'A4 Copier Paper Box', type: 'Stock In', quantity: 40, warehouse: 'Pune Central', date: '24 Sep 2026, 10:40 AM', reference: 'PO-2026-042', by: 'Kiran Patil' },
  { id: 'MOV-9002', product: 'Wireless Mouse', type: 'Stock Out', quantity: 8, warehouse: 'Pune Central', date: '24 Sep 2026, 09:15 AM', reference: 'SO-2026-116', by: 'Neha More' },
  { id: 'MOV-9003', product: 'Packing Tape Roll', type: 'Adjustment', quantity: 3, warehouse: 'Pune Central', date: '23 Sep 2026, 04:20 PM', reference: 'Physical count', by: 'Kiran Patil' },
  { id: 'MOV-9004', product: 'Bluetooth Keyboard', type: 'Transfer', quantity: 5, warehouse: 'Pimpri Store', date: '23 Sep 2026, 11:05 AM', reference: 'TRF-2026-018', by: 'Admin' },
  { id: 'MOV-9005', product: 'LED Desk Lamp', type: 'Stock In', quantity: 20, warehouse: 'Chakan Warehouse', date: '22 Sep 2026, 02:30 PM', reference: 'PO-2026-039', by: 'Kiran Patil' },
]

export const warehouses = [
  { id: 'WH-01', name: 'Pune Central', location: 'Bhosari MIDC, Pune', manager: 'Kiran Patil', products: 128, capacity: 12000, used: 8160, status: 'Active' },
  { id: 'WH-02', name: 'Chakan Warehouse', location: 'Chakan Industrial Area, Pune', manager: 'Rahul Jadhav', products: 94, capacity: 8500, used: 4420, status: 'Active' },
  { id: 'WH-03', name: 'Pimpri Store', location: 'Pimpri, Pune', manager: 'Neha More', products: 62, capacity: 3000, used: 2160, status: 'Active' },
]

export const employees = [
  { id: 'EMP-001', name: 'Admin User', role: 'Admin', email: 'admin@stockflow.in', phone: '+91 98765 12121', warehouse: 'Pune Central', joining: '10 Jan 2024', status: 'Active' },
  { id: 'EMP-002', name: 'Kiran Patil', role: 'Warehouse Manager', email: 'kiran@stockflow.in', phone: '+91 98220 42010', warehouse: 'Pune Central', joining: '18 Mar 2024', status: 'Active' },
  { id: 'EMP-003', name: 'Neha More', role: 'Warehouse Staff', email: 'neha@stockflow.in', phone: '+91 97652 17419', warehouse: 'Pimpri Store', joining: '05 Jul 2024', status: 'Active' },
  { id: 'EMP-004', name: 'Rahul Jadhav', role: 'Inventory Manager', email: 'rahul@stockflow.in', phone: '+91 98908 33520', warehouse: 'Chakan Warehouse', joining: '14 Aug 2024', status: 'Active' },
]

export const initialNotifications = [
  { id: 1, title: 'Low stock alert', text: 'Product Wireless Mouse is below minimum stock level.', time: '10 minutes ago', type: 'warning', read: false },
  { id: 2, title: 'New sales order', text: 'Aarav Enterprises placed order SO-2026-116.', time: '1 hour ago', type: 'order', read: false },
  { id: 3, title: 'Purchase order approved', text: 'PO-2026-042 from PaperPlus Solutions was approved.', time: 'Yesterday', type: 'success', read: true },
  { id: 4, title: 'Stock received', text: '40 A4 Copier Paper Boxes were added to Pune Central.', time: 'Yesterday', type: 'movement', read: true },
  { id: 5, title: 'Out of stock', text: 'USB-C Charging Cable is currently out of stock.', time: '2 days ago', type: 'warning', read: true },
]

export const categories = ['Electronics', 'Office Supplies', 'Home & Kitchen', 'Stationery', 'Packaging']
export const productStatuses = ['In Stock', 'Low Stock', 'Out of Stock']
export const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`
