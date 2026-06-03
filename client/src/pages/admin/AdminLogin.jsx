import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiUrl, parseJsonResponse } from '../../utils/api'
import styles from './AdminLogin.module.css'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch(apiUrl('/api/admin/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        const { token } = await parseJsonResponse(res)
        localStorage.setItem('impevos-admin-token', token)
        navigate('/admin')
      } else {
        setError('Geçersiz şifre')
      }
    } catch {
      setError('Bağlantı hatası')
    }

    setLoading(false)
  }

  return (
    <div className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.logo}>IMPE<span>VOS</span></div>
        <p className={styles.subtitle}>Staj Başvuru Yönetim Paneli</p>

        <div className={styles.field}>
          <label htmlFor="password">Admin Şifresi</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Şifrenizi girin"
            required
          />
        </div>

        <button type="submit" className={`btn btn-primary ${styles.submit}`} disabled={loading}>
          {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>

        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  )
}
