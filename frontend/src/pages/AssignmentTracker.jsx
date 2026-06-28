import { useState, useEffect } from 'react';
import { Plus, GripVertical, Trash2, Calendar } from 'lucide-react';
import { fetchAssignments, createAssignment, updateAssignment, deleteAssignment } from '../api/client';

export default function AssignmentTracker() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const data = await fetchAssignments();
      setAssignments(data);
    } catch (err) {
      console.error('Failed to load assignments', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const created = await createAssignment(newTask);
      setAssignments([...assignments, created]);
      setNewTask({ title: '', description: '', dueDate: '' });
      setShowAddForm(false);
    } catch (err) {
      alert('Error creating assignment: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await deleteAssignment(id);
      setAssignments(assignments.filter(a => a._id !== id));
    } catch (err) {
      alert('Error deleting assignment: ' + err.message);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      // Optimistic update
      const updatedAssignments = assignments.map(a => a._id === id ? { ...a, status: newStatus } : a);
      setAssignments(updatedAssignments);
      await updateAssignment(id, { status: newStatus });
    } catch (err) {
      alert('Error updating status: ' + err.message);
      loadAssignments(); // revert
    }
  };

  const columns = [
    { id: 'todo', title: 'Upcoming (To Do)' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'done', title: 'Completed' }
  ];

  if (loading) {
    return <div className="page-body">Loading...</div>;
  }

  return (
    <div className="page-body">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Assignment Tracker</h2>
          <p>Track your upcoming labs, exams, and project deadlines.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
          <Plus size={16} /> Add Assignment
        </button>
      </div>

      {showAddForm && (
        <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 12, marginBottom: '2rem', border: '1px solid var(--border)' }}>
          <h3>Add New Assignment</h3>
          <form onSubmit={handleCreate} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <input 
              type="text" required placeholder="Task Title (e.g., Data Structures Lab 3)"
              className="input" style={{ flex: 1, minWidth: 200 }}
              value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
            />
            <input 
              type="date" required 
              className="input" style={{ width: 160 }}
              value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
            />
            <input 
              type="text" placeholder="Short description (optional)"
              className="input" style={{ flex: 2, minWidth: 250 }}
              value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" className="btn" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        {columns.map(col => (
          <div key={col.id} style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 12, border: '1px solid var(--border)', minHeight: 400 }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              {col.title}
              <span style={{ fontSize: '0.8rem', background: 'var(--bg-elevated)', padding: '0.2rem 0.6rem', borderRadius: 20 }}>
                {assignments.filter(a => a.status === col.id).length}
              </span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {assignments.filter(a => a.status === col.id).map(assignment => (
                <div key={assignment._id} style={{ 
                  background: 'var(--bg-card)', padding: '1rem', borderRadius: 8, 
                  border: '1px solid var(--border)', boxShadow: 'var(--shadow-hard-sm)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{assignment.title}</h4>
                    <button onClick={() => handleDelete(assignment._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-red)' }} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {assignment.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', marginTop: 0 }}>{assignment.description}</p>}
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    <Calendar size={12} /> Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {columns.map(c => (
                      c.id !== col.id && (
                        <button 
                          key={c.id} 
                          onClick={() => updateStatus(assignment._id, c.id)}
                          style={{ 
                            flex: 1, fontSize: '0.75rem', padding: '0.4rem', 
                            background: 'var(--bg-surface)', border: '1px solid var(--border)', 
                            borderRadius: 6, cursor: 'pointer',
                            color: 'var(--text-primary)'
                          }}
                        >
                          Move to {c.title.split(' ')[0]}
                        </button>
                      )
                    ))}
                  </div>
                </div>
              ))}
              {assignments.filter(a => a.status === col.id).length === 0 && (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border)', borderRadius: 8 }}>
                  No tasks here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
