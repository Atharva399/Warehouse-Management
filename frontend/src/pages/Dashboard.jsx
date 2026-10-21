import { AlertTriangle, ArrowDownRight, ArrowUpRight, Boxes, CircleDollarSign, Package, ShoppingCart, Truck, Users } from 'lucide-react'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { formatCurrency } from '../data/mockData'

function BarChart({ title, subtitle, data, colors }) {
  const max = Math.max(...data.map((item) => item.value))
  return <section className="chart-card"><div className="section-heading"><div><h2>{title}</h2><p>{subtitle}</p></div><button className="text-button">View report</button></div><div className="bar-chart">{data.map((item, index) => <div className="bar-group" key={item.label}><strong>{item.value}</strong><div className="bar-track"><div className="bar-fill" style={{ height: `${(item.value / max) * 100}%`, backgroundColor: colors[index] }} /></div><span>{item.label}</span></div>)}</div></section>
}

export default function Dashboard({ products, suppliers, customers, salesOrders, purchaseOrders, onNavigate }) {
  const lowStock = products.filter((product) => product.status !== 'In Stock')
  const totalStock = products.reduce((total, product) => total + Number(product.stock), 0)
  const pending = [...salesOrders, ...purchaseOrders].filter((order) => ['Pending', 'Processing'].includes(order.status)).length

  return <div className="page dashboard-page">
    <div className="welcome-row"><div><h2>Good Morning, Admin</h2><p>Here is what is happening in your warehouse today.</p></div><button className="primary-button" onClick={() => onNavigate('sales-orders')}><ShoppingCart size={17} />Create Sales Order</button></div>
    <div className="stat-grid">
      <StatCard icon={Package} label="Total Products" value={products.length} trend="+4.8%" tone="blue" />
      <StatCard icon={Boxes} label="Total Stock" value={totalStock} trend="+6.2%" tone="purple" />
      <StatCard icon={AlertTriangle} label="Low Stock Items" value={lowStock.length} trend="-2.1%" tone="orange" />
      <StatCard icon={ShoppingCart} label="Pending Orders" value={pending} trend="+3.4%" tone="green" />
      <StatCard icon={Truck} label="Total Suppliers" value={suppliers.length} trend="+1.0%" tone="teal" />
      <StatCard icon={Users} label="Total Customers" value={customers.length} trend="+8.6%" tone="pink" />
    </div>
    <div className="charts-grid">
      <BarChart title="Inventory Overview" subtitle="Current product availability" data={[{ label: 'In Stock', value: products.filter(p => p.status === 'In Stock').length }, { label: 'Low Stock', value: products.filter(p => p.status === 'Low Stock').length }, { label: 'Out of Stock', value: products.filter(p => p.status === 'Out of Stock').length }]} colors={['#2f6fed', '#e89722', '#dc5d5d']} />
      <BarChart title="Orders Overview" subtitle="Orders by current status" data={[{ label: 'Pending', value: 4 }, { label: 'Processing', value: 3 }, { label: 'Completed', value: 11 }, { label: 'Cancelled', value: 1 }]} colors={['#e89722', '#6d5bd0', '#2d9b72', '#dc5d5d']} />
      <section className="chart-card movement-chart"><div className="section-heading"><div><h2>Monthly Stock Movement</h2><p>Incoming and outgoing units</p></div><select className="small-select"><option>Last 6 months</option></select></div><div className="movement-legend"><span><i className="legend-in" />Incoming stock</span><span><i className="legend-out" />Outgoing stock</span></div><div className="line-chart"><svg viewBox="0 0 600 180" preserveAspectRatio="none" aria-label="Monthly stock movement chart"><line x1="0" y1="150" x2="600" y2="150" stroke="#e5e9ef"/><line x1="0" y1="95" x2="600" y2="95" stroke="#e5e9ef"/><line x1="0" y1="40" x2="600" y2="40" stroke="#e5e9ef"/><polyline fill="none" stroke="#2f6fed" strokeWidth="3" points="0,121 100,86 200,105 300,61 400,74 500,38 600,63"/><polyline fill="none" stroke="#df8b27" strokeWidth="3" points="0,141 100,117 200,129 300,98 400,111 500,85 600,103"/></svg><div className="chart-months"><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span></div></div></section>
    </div>
    <div className="dashboard-lower-grid">
      <section className="content-card"><div className="section-heading"><div><h2>Recent Orders</h2><p>Latest customer orders</p></div><button className="text-button" onClick={() => onNavigate('sales-orders')}>View all</button></div><div className="table-wrap"><table><thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Items</th><th>Amount</th><th>Status</th></tr></thead><tbody>{salesOrders.slice(0, 4).map((order) => <tr key={order.id}><td className="strong-cell">{order.id}</td><td>{order.customer}</td><td>{order.date}</td><td>{order.items}</td><td>{formatCurrency(order.amount)}</td><td><StatusBadge status={order.status} /></td></tr>)}</tbody></table></div></section>
      <section className="content-card"><div className="section-heading"><div><h2>Low Stock Products</h2><p>Items that need attention</p></div><button className="text-button" onClick={() => onNavigate('inventory')}>View all</button></div><div className="table-wrap"><table><thead><tr><th>Product</th><th>SKU</th><th>Current</th><th>Minimum</th><th>Status</th></tr></thead><tbody>{lowStock.map((product) => <tr key={product.id}><td className="strong-cell">{product.name}</td><td>{product.sku}</td><td>{product.stock}</td><td>{product.minimum}</td><td><StatusBadge status={product.status} /></td></tr>)}</tbody></table></div></section>
    </div>
    <section className="content-card activity-card"><div className="section-heading"><div><h2>Recent Activity</h2><p>Latest warehouse updates</p></div></div><div className="activity-list"><div className="activity-item"><span className="activity-icon green"><ArrowDownRight size={17} /></span><div><strong>Stock received for A4 Copier Paper Box</strong><p>40 units added to Pune Central warehouse</p></div><time>10:40 AM</time></div><div className="activity-item"><span className="activity-icon orange"><ArrowUpRight size={17} /></span><div><strong>Sales order SO-2026-116 is being processed</strong><p>Aarav Enterprises · {formatCurrency(7240)}</p></div><time>09:15 AM</time></div><div className="activity-item"><span className="activity-icon blue"><CircleDollarSign size={17} /></span><div><strong>Purchase order PO-2026-042 was approved</strong><p>PaperPlus Solutions · {formatCurrency(18250)}</p></div><time>Yesterday</time></div></div></section>
  </div>
}
