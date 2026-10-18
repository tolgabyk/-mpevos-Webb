import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LegalPage from './pages/LegalPage'
import CookieBanner from './components/CookieBanner/CookieBanner'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ekibe-katil" element={<Navigate to="/" replace />} />
        <Route path="/kvkk" element={<LegalPage pageKey="kvkk" />} />
        <Route path="/gizlilik" element={<LegalPage pageKey="privacy" />} />
        <Route path="/cerez-politikasi" element={<LegalPage pageKey="cookies" />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <CookieBanner />
    </BrowserRouter>
  )
}

export default App
