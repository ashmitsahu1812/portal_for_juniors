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
import BattleLobby from './pages/BattleLobby';
import BattleArena from './pages/BattleArena';
import MindGamesHub from './pages/MindGamesHub';
import AssignmentTracker from './pages/AssignmentTracker';
import StudyRoom from './pages/StudyRoom';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import { CourseProvider } from './context/CourseContext';
import CourseDropdown from './components/CourseDropdown';

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
        {/* Global Top Bar with Course Dropdown */}
        <header className="app-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
            <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <CourseDropdown />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              className="topbar-status-badge"
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '8px',
                background: 'rgba(0, 133, 255, 0.1)',
                border: '1.5px solid var(--border)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 6px #10b981',
                }}
              />
              <span className="hide-mobile">Live Portal</span>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CourseProvider>
          <SocketProvider>
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

                  {/* Settings */}
                  <Route path="/settings" element={<Settings />} />

                  {/* Profile */}
                  <Route path="/profile" element={<Profile />} />

                  {/* 1v1 Battle */}
                  <Route path="/battle" element={<BattleLobby />} />
                  <Route path="/battle/:roomId" element={<BattleArena />} />

                  {/* Mind Games */}
                  <Route path="/games" element={<MindGamesHub />} />

                  {/* Productivity */}
                  <Route path="/assignments" element={<AssignmentTracker />} />
                  <Route path="/study-room" element={<StudyRoom />} />

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
    </SocketProvider>
  </CourseProvider>
</AuthProvider>
</ThemeProvider>
);
}
