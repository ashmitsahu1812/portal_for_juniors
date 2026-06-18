import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import api from '../api/client';

export default function CommunityCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'Easy',
    description: '# Problem Statement\n\nWrite a program that...\n\n## Input Format\n\n## Output Format\n',
    testCases: [
      { input: '', expectedOutput: '', label: 'Sample 1', isHidden: false }
    ]
  });

  const handleAddTestCase = () => {
    setFormData(prev => ({
      ...prev,
      testCases: [
        ...prev.testCases,
        { input: '', expectedOutput: '', label: `Sample ${prev.testCases.length + 1}`, isHidden: false }
      ]
    }));
  };

  const handleRemoveTestCase = (index) => {
    setFormData(prev => ({
      ...prev,
      testCases: prev.testCases.filter((_, i) => i !== index)
    }));
  };

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...formData.testCases];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, testCases: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/community/problems', formData);
      if (res.data.success) {
        navigate('/community');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create problem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="page-header flex-between">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn btn-ghost" onClick={() => navigate('/community')} style={{ padding: '0.4rem' }}>
            <ArrowLeft size={20} />
          </button>
          <h2>Create Challenge</h2>
        </div>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? <div className="spinner" style={{ width: 16, height: 16 }} /> : <Save size={18} />}
          Publish
        </button>
      </header>

      <main className="page-body">
        {error && (
          <div className="verdict-banner error mb-2">
            <strong>Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Basic Info */}
          <section className="card">
            <h3 style={{ marginBottom: '1rem' }}>Basic Details</h3>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ flex: 2 }}>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'Space Grotesk' }}>Problem Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Reverse a String"
                  style={{ width: '100%', padding: '0.75rem', border: '2px solid #000', borderRadius: 0, fontFamily: 'Space Grotesk', fontSize: '1rem' }}
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'Space Grotesk' }}>Difficulty</label>
                <select 
                  className="select-styled" 
                  style={{ width: '100%' }}
                  value={formData.difficulty}
                  onChange={e => setFormData({...formData, difficulty: e.target.value})}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'Space Grotesk' }}>Description (Markdown)</label>
              <textarea 
                required
                rows={8}
                style={{ width: '100%', padding: '0.75rem', border: '2px solid #000', borderRadius: 0, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', resize: 'vertical' }}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </section>

          {/* Test Cases */}
          <section className="card">
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
              <h3>Test Cases</h3>
              <button type="button" className="btn btn-ghost btn-sm" onClick={handleAddTestCase}>
                <Plus size={16} /> Add Test Case
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {formData.testCases.map((tc, idx) => (
                <div key={idx} style={{ border: '2px solid var(--border)', padding: '1rem', background: 'var(--bg-surface)', position: 'relative' }}>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Label</label>
                      <input 
                        type="text" 
                        value={tc.label}
                        onChange={e => handleTestCaseChange(idx, 'label', e.target.value)}
                        style={{ width: '100%', padding: '0.4rem', border: '1px solid #000' }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.4rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>
                        <input 
                          type="checkbox" 
                          checked={tc.isHidden}
                          onChange={e => handleTestCaseChange(idx, 'isHidden', e.target.checked)}
                        />
                        Hidden (Grading Only)
                      </label>
                    </div>
                    {formData.testCases.length > 1 && (
                      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveTestCase(idx)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Standard Input (stdin)</label>
                      <textarea 
                        rows={3}
                        value={tc.input}
                        onChange={e => handleTestCaseChange(idx, 'input', e.target.value)}
                        style={{ width: '100%', padding: '0.4rem', border: '1px solid #000', fontFamily: 'monospace' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Expected Output (stdout)</label>
                      <textarea 
                        rows={3}
                        required
                        value={tc.expectedOutput}
                        onChange={e => handleTestCaseChange(idx, 'expectedOutput', e.target.value)}
                        style={{ width: '100%', padding: '0.4rem', border: '1px solid #000', fontFamily: 'monospace' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </form>
      </main>
    </>
  );
}
