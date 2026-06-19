import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Menu, Terminal } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ModulesPage from './pages/ModulesPage';
import ModuleDetail from './pages/ModuleDetail';
import LectureNotes from './pages/LectureNotes';
import QuizPage from './pages/QuizPage';
import CodingArena from './pages/CodingArena';
import ProgressTracker from './pages/ProgressTracker';
import Leaderboard from './pages/Leaderboard';
import Pathways from './pages/Pathways';
import PathwayDetail from './pages/PathwayDetail';
import Community from './pages/Community';
import CommunityCreate from './pages/CommunityCreate';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-secondary)' }}>Loading session...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function MainLayout({ children }) {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  if (!user) return <>{children}</>;
  return (
    <div className="app-shell">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="main-content">
        {/* Mobile Top Bar */}
        <div className="mobile-topbar">
          <div className="mobile-topbar-brand">
            <div style={{
              width: 22, height: 22,
              background: 'var(--accent-purple)',
              border: '2px solid #000',
              boxShadow: '2px 2px 0px 0px #000',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Terminal size={12} color="#fff" strokeWidth={2.5} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1 style={{ lineHeight: '1', fontSize: '1.25rem' }}>Kick Start</h1>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.5px' }}>
                by <span style={{ color: '#007AFF', fontWeight: 800 }}>RE</span><span style={{ color: 'var(--text-primary)', fontWeight: 800 }}>start</span>
              </span>
            </div>
          </div>
          <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={20} />
          </button>
        </div>

        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/*" element={
            <ProtectedRoute>
              <MainLayout>
                <Routes>
                  {/* Dashboard */}
                  <Route path="/" element={<Dashboard />} />

                  {/* Modules & Notes */}
                  <Route path="/modules" element={<ModulesPage />} />
                  <Route path="/modules/:id" element={<ModuleDetail />} />
                  <Route path="/notes" element={<LectureNotes />} />
                  <Route path="/modules/:moduleId/quiz" element={<QuizPage />} />

                  {/* Coding Arena */}
                  <Route path="/arena" element={<CodingArena />} />
                  <Route path="/arena/:problemId" element={<CodingArena />} />

                  {/* Progress */}
                  <Route path="/progress" element={<ProgressTracker />} />

                  {/* Leaderboard */}
                  <Route path="/leaderboard" element={<Leaderboard />} />

                  {/* Community */}
                  <Route path="/community" element={<Community />} />
                  <Route path="/community/create" element={<CommunityCreate />} />

                  {/* Pathways */}
                  <Route path="/paths" element={<Pathways />} />
                  <Route path="/paths/:id" element={<PathwayDetail />} />

                  {/* 404 */}
                  <Route path="*" element={
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '1rem' }}>
                      <div style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--border)', fontFamily: 'JetBrains Mono' }}>404</div>
                      <p style={{ color: 'var(--text-secondary)' }}>Page not found.</p>
                      <a href="/" className="btn btn-primary btn-sm">Go Home</a>
                    </div>
                  } />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
}
