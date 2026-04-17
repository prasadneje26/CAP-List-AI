// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: frontend-web/src/routes/AppRoutes.jsx
// ============================================================

import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

import Home           from '../pages/Home.jsx'
import Login          from '../pages/Login.jsx'
import Register       from '../pages/Register.jsx'
import Dashboard      from '../pages/Dashboard.jsx'
import InputPage      from '../pages/InputPage.jsx'
import ResultsPage    from '../pages/ResultsPage.jsx'
import ProfilePage    from '../pages/ProfilePage.jsx'
import DocumentsPage  from '../pages/DocumentsPage.jsx'
import MentorshipPage from '../pages/MentorshipPage.jsx'
import FeedbackPage   from '../pages/FeedbackPage.jsx'
import ComparePage    from '../pages/ComparePage.jsx'
import Navbar         from '../components/Navbar.jsx'
import Footer         from '../components/Footer.jsx'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="page-loader"><div className="spinner" /></div>
  if (!user)   return <Navigate to="/login" replace />
  return children
}

function PublicRoute({ children }) {
  const { user } = useAuth()
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

export default function AppRoutes() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/login"     element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register"  element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/input"     element={<ProtectedRoute><InputPage /></ProtectedRoute>} />
          <Route path="/results"   element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
          <Route path="/profile"   element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
          <Route path="/mentorship"element={<ProtectedRoute><MentorshipPage /></ProtectedRoute>} />
          <Route path="/feedback"  element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
          <Route path="/compare"   element={<ProtectedRoute><ComparePage /></ProtectedRoute>} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
