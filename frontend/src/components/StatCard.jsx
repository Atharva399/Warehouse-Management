export default function StatCard({ icon: Icon, label, value, trend, tone = 'blue' }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${tone}`}><Icon size={21} /></div>
      <div><p>{label}</p><strong>{value}</strong>{trend && <span className={trend.startsWith('+') ? 'positive-trend' : 'negative-trend'}>{trend} this month</span>}</div>
    </article>
  )
}
