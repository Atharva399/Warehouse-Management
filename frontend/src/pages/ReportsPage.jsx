import { BarChart3, Download, FileBarChart, PackageSearch, Printer, ShoppingBag, Truck, Users } from 'lucide-react'
import { useState } from 'react'

const reports = [
  { title: 'Inventory Report', text: 'Current stock levels by product and warehouse.', icon: PackageSearch },
  { title: 'Stock Movement Report', text: 'All inventory movement during the selected period.', icon: BarChart3 },
  { title: 'Sales Report', text: 'Sales orders, amounts and order statuses.', icon: ShoppingBag },
  { title: 'Purchase Report', text: 'Purchase orders and supplier spending.', icon: Truck },
  { title: 'Supplier Report', text: 'Supplier contact and supplied product details.', icon: FileBarChart },
  { title: 'Customer Report', text: 'Customer order and purchase summaries.', icon: Users },
  { title: 'Low Stock Report', text: 'Products that need to be reordered soon.', icon: PackageSearch },
]
export default function ReportsPage() { const [from, setFrom] = useState('2026-09-01'); const [to, setTo] = useState('2026-09-24'); const [generated, setGenerated] = useState(''); const exportCsv = () => { const csv = 'Report,Period,Status\nInventory Report,' + from + ' to ' + to + ',Generated'; const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); link.download = 'stockflow-report.csv'; link.click(); URL.revokeObjectURL(link.href) }; return <div className="page"><div className="page-intro"><div><h2>Reports</h2><p>Generate simple operational reports for your warehouse.</p></div></div><section className="report-filter"><div><label>From Date<input type="date" value={from} onChange={e => setFrom(e.target.value)} /></label><label>To Date<input type="date" value={to} onChange={e => setTo(e.target.value)} /></label></div><div className="button-group"><button className="primary-button" onClick={() => setGenerated(`Reports generated for ${from} to ${to}.`)}><FileBarChart size={17} />Generate Report</button><button className="secondary-button" onClick={exportCsv}><Download size={17} />Export CSV</button><button className="secondary-button" onClick={() => window.print()}><Printer size={17} />Print</button></div>{generated && <p className="report-generated">{generated}</p>}</section><div className="report-grid">{reports.map(({ title, text, icon: Icon }) => <article className="report-card" key={title}><span><Icon size={22} /></span><h3>{title}</h3><p>{text}</p><button className="text-button" onClick={() => setGenerated(`${title} generated for ${from} to ${to}.`)}>Generate report</button></article>)}</div></div> }
