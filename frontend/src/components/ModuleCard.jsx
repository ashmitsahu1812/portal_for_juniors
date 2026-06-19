import { Link } from 'react-router-dom';
import { BookOpen, FileText, Code2, ChevronRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const difficultyBadge = { Easy: 'badge-easy', Medium: 'badge-medium', Hard: 'badge-hard' };

/**
 * ModuleCard — displayed in the modules grid on the syllabus page.
 * Shows module metadata and quick-action buttons for Quiz and Coding problems.
 */
export default function ModuleCard({ module }) {
  const { user } = useAuth();
  const isCompleted = user?.progress?.quizScores?.some(q => q.moduleId === module._id);

  return (
    <div className="card" style={{ 
      display: 'flex', flexDirection: 'column', gap: '1rem',
      background: isCompleted ? 'rgba(0, 255, 102, 0.05)' : 'var(--bg-card)',
      borderColor: isCompleted ? 'var(--accent-green)' : 'var(--border)',
    }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(34,211,238,0.1))',
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BookOpen size={18} color="var(--accent-blue)" />
          </div>
          <span className="badge badge-blue">Sem {module.semester}</span>
        </div>
        <h3 style={{ marginTop: '0.75rem', fontSize: '1rem', fontWeight: 700, lineHeight: 1.3 }}>
          {module.title}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '0.4rem', lineHeight: 1.5 }}>
          {module.description.slice(0, 110)}{module.description.length > 110 ? '…' : ''}
        </p>
      </div>

      {/* Meta row */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: isCompleted ? 'var(--accent-green)' : 'var(--text-muted)', fontWeight: isCompleted ? 700 : 500 }}>
          {isCompleted ? <CheckCircle size={14} /> : <BookOpen size={12} />}
          {isCompleted ? 'Quiz Completed' : 'Module Quiz'}
        </span>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border)' }} />

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.6rem' }}>
        <Link
          to={`/modules/${module._id}/quiz`}
          className={isCompleted ? "btn btn-success btn-sm" : "btn btn-primary btn-sm"}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          {isCompleted ? 'Retake Quiz' : 'Take Quiz'}
          <ChevronRight size={13} />
        </Link>
      </div>
    </div>
  );
}
