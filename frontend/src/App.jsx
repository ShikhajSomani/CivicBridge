import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import GarbageDetection from './pages/GarbageDetection'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/garbage-detection" element={<GarbageDetection />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App