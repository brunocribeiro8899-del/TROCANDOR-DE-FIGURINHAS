import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LandingPage }     from './pages/LandingPage'
import { Login }           from './pages/Login'
import { Cadastro }        from './pages/Cadastro'
import { Dashboard }       from './pages/Dashboard'
import { PainelAdmin }     from './pages/PainelAdmin'
import { ProtectedRoute }  from './components/ProtectedRoute'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<LandingPage />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute apenasAdmin>
            <PainelAdmin />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
