export default function StatusBadge({ status }) {
  const normalized = String(status || '').toLowerCase().replaceAll(' ', '-')
  return <span className={`status-badge status-${normalized}`}>{status}</span>
}
