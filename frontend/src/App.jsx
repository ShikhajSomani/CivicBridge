import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import GarbageDetection from './pages/GarbageDetection'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { getCurrentUser, signOut } from './services/auth'
import './App.css'

function ProtectedRoute({ user, children }) {
  return user ? children : <Navigate to="/login" replace />
}

function AppContent() {
  const navigate = useNavigate()
  const [user, setUser] = useState(getCurrentUser)

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser)
    navigate('/')
  }

  const handleLogout = () => {
    signOut()
    setUser(null)
    navigate('/')
  }

  return (
    <div className="app-shell">
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onAuthSuccess={handleAuthSuccess} />} />
        <Route path="/signup" element={<Signup onAuthSuccess={handleAuthSuccess} />} />
        <Route path="/garbage-detection" element={<ProtectedRoute user={user}><GarbageDetection /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
