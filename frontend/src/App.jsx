import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ModulesPage from './pages/ModulesPage';
import ModuleDetail from './pages/ModuleDetail';
import LectureNotes from './pages/LectureNotes';
import QuizPage from './pages/QuizPage';
import CodingArena from './pages/CodingArena';
import ProgressTracker from './pages/ProgressTracker';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-secondary)' }}>Loading session...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function MainLayout({ children }) {
  const { user } = useAuth();
  if (!user) return <>{children}</>;
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
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
  );
}
