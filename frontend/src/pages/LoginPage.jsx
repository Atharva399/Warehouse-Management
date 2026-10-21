import { Factory, Lock, LogIn, UserRound } from 'lucide-react'
import { useState } from 'react'

const USERS = {
  admin: { password: '123456', name: 'Admin User', role: 'Administrator' },
  clerk: { password: '123456', name: 'Clerk User', role: 'Warehouse Clerk' },
}

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const submit = (event) => {
    event.preventDefault()
    if (!form.username || !form.password) return setError('Please enter username and password.')
    const account = USERS[form.username]
    if (account && account.password === form.password) return onLogin({ username: form.username, name: account.name, role: account.role })
    setError('Invalid username or password.')
  }
  return <div className="login-page">
    <div className="login-card">
      <div className="login-brand"><span><Factory size={22} /></span><div><strong>StockFlow WMS</strong><p>Warehouse Management System</p></div></div>
      <h1>Sign in to your account</h1><p className="login-subtitle">Enter your credentials to access the dashboard.</p>
      <form className="login-form" onSubmit={submit}>
        <label>Username<div className="login-input"><UserRound size={17} /><input autoFocus value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="Enter username" /></div></label>
        <label>Password<div className="login-input"><Lock size={17} /><input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Enter password" /></div></label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button login-button" type="submit"><LogIn size={17} />Sign In</button>
      </form>
      <p className="login-hint">Admin — <strong>admin / 123456</strong> · Clerk — <strong>clerk / 123456</strong></p>
    </div>
    <p className="login-footer">StockFlow WMS · College Software Engineering Project</p>
  </div>
}
