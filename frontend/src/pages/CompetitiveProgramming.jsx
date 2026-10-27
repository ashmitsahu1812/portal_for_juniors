import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, Check, ExternalLink, RefreshCw, Code2, Flame, Target, Clock3, ListChecks } from 'lucide-react';
import { fetchCodeforcesContests, fetchCodeforcesLeaderboard, fetchCuratedProblems, fetchDailyChallenge, fetchExternalStats, syncCodeforcesSubmissions, toggleCuratedProblem } from '../api/client';
import { useAuth } from '../context/AuthContext';

function countdown(timestamp, nowMs = Date.now()) {
  const seconds = Math.max(0, timestamp - Math.floor(nowMs / 1000));
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days ? `${days}d ` : ''}${hours}h ${minutes}m`;
}

export default function CompetitiveProgramming() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [daily, setDaily] = useState(null);
  const [contests, setContests] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [problems, setProblems] = useState([]);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [now, setNow] = useState(Date.now());
  const armedReminders = useRef(new Set());
  const notifiedReminders = useRef(new Set());

  const refresh = async () => {
    const results = await Promise.allSettled([
      fetchExternalStats(), fetchDailyChallenge(), fetchCodeforcesContests(),
      fetchCodeforcesLeaderboard(), fetchCuratedProblems(),
    ]);    const nextErrors = {};
    if (results[0].status === 'fulfilled') setStats(results[0].value);
    else nextErrors.stats = results[0].reason.message;
    if (results[1].status === 'fulfilled') setDaily(results[1].value);
    else nextErrors.daily = results[1].reason.message;
    if (results[2].status === 'fulfilled') setContests(results[2].value);
    else nextErrors.contests = results[2].reason.message;
    if (results[3].status === 'fulfilled') setLeaderboard(results[3].value);
    else nextErrors.leaderboard = results[3].reason.message;
    if (results[4].status === 'fulfilled') setProblems(results[4].value);
    else nextErrors.problems = results[4].reason.message;
    setErrors(nextErrors);
  };

  useEffect(() => { refresh(); }, []);
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    const reminderCheck = setInterval(() => {
      if (!('Notification' in window) || Notification.permission !== 'granted') return;
      const secondsNow = Math.floor(Date.now() / 1000);
      contests.forEach(contest => {
        const key = String(contest.id);
        if (armedReminders.current.has(key) && !notifiedReminders.current.has(key) && contest.startTimeSeconds <= secondsNow && contest.startTimeSeconds > secondsNow - 65) {
          notifiedReminders.current.add(key);
          new Notification('Codeforces contest starting', { body: contest.name });
        }
      });
    }, 30000);
    return () => { clearInterval(interval); clearInterval(reminderCheck); };
  }, [contests]);

  const solvedCount = problems.filter(problem => problem.completed).length;
  const recommended = useMemo(() => {
    const lc = stats?.stats?.leetcode;
    const cf = stats?.stats?.codeforces;
    const level = (cf?.rating || 0) >= 1600 || (lc?.mediumSolved || 0) >= 20 ? 'Hard'
      : (cf?.rating || 0) >= 1000 || (lc?.easySolved || 0) >= 20 ? 'Medium' : 'Easy';
    return { level, problems: problems.filter(problem => !problem.completed && problem.difficulty === level).slice(0, 4) };
  }, [stats, problems]);

  const markDone = async (id) => {
    try {
      const result = await toggleCuratedProblem(id);
      setProblems(current => current.map(problem => problem.id === id ? { ...problem, completed: result.completed } : problem));
    } catch (error) { setErrors(current => ({ ...current, problems: error.message })); }
  };

  const sync = async () => {
    setBusy(true);
    setSyncMessage('');
    try {
      const result = await syncCodeforcesSubmissions();
      setSyncMessage(`Synced ${result.syncedCurated} curated problems; ${result.newArenaSolves} new Coding Arena solves found.`);
      await refresh();
    } catch (error) { setSyncMessage(error.message); }
    finally { setBusy(false); }
  };

  const setReminder = async (contest) => {
    if (!('Notification' in window)) {
      setSyncMessage('Browser notifications are not supported.');
      return;
    }
    const permission = Notification.permission === 'default' ? await Notification.requestPermission() : Notification.permission;
    if (permission !== 'granted') {
      setSyncMessage('Allow browser notifications to set a contest reminder.');
      return;
    }
    armedReminders.current.add(String(contest.id));
    setSyncMessage(`Reminder enabled for ${contest.name}. Keep this portal open to receive it.`);
  };

  const cfRank = stats?.stats?.codeforces;
  const lc = stats?.stats?.leetcode;
  const ownId = user?.id || user?._id;

  return <>
    <header className="page-header flex-between" style={{ gap: '1rem', flexWrap: 'wrap' }}>
      <div><h2><Code2 size={25} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--accent-blue)' }} />Competitive Programming</h2><p>Connect your profiles, practice by topic, and keep up with contests.</p></div>
      <button className="btn btn-ghost" onClick={refresh}><RefreshCw size={15} /> Refresh</button>
    </header>
    <main className="page-body">
      <section className="card-grid" style={{ marginBottom: '1.5rem' }}>
        <article className="card">
          <h3 style={{ marginBottom: 10 }}>LeetCode</h3>
          {lc ? <><div className="stat-value">{lc.totalSolved ?? '—'}</div><div className="stat-label">Problems solved</div><p style={{ marginTop: 12 }}>Easy {lc.easySolved ?? 0} · Medium {lc.mediumSolved ?? 0} · Hard {lc.hardSolved ?? 0}</p><p style={{ marginTop: 5 }}>Global rank: {Number(lc.ranking || 0).toLocaleString()}</p></> : <p>{stats?.profiles?.leetcode ? errors.stats || 'Stats unavailable.' : 'Link a LeetCode username in Settings to view stats.'}</p>}
        </article>
        <article className="card">
          <h3 style={{ marginBottom: 10 }}>Codeforces</h3>
          {cfRank ? <><div className="stat-value">{cfRank.rating || 0}</div><div className="stat-label">{cfRank.rank || 'unrated'} · max {cfRank.maxRating || 0}</div><p style={{ marginTop: 12 }}>Handle: {cfRank.handle}</p></> : <p>{stats?.profiles?.codeforces ? errors.stats || 'Stats unavailable.' : 'Link a Codeforces handle in Settings to view stats.'}</p>}
        </article>
        <article className="card">
          <h3 style={{ marginBottom: 10 }}><ListChecks size={17} style={{ verticalAlign: 'middle', marginRight: 6 }} />Practice progress</h3>
          <div className="stat-value">{solvedCount}/{problems.length}</div><div className="stat-label">Curated problems completed</div>
          <button className="btn btn-primary btn-sm" style={{ marginTop: 14 }} disabled={busy || !stats?.profiles?.codeforces} onClick={sync}><RefreshCw size={14} />{busy ? 'Syncing…' : 'Sync Codeforces submissions'}</button>
        </article>
      </section>
      {syncMessage && <p role="status" style={{ margin: '0 0 1rem', color: 'var(--accent-blue)' }}>{syncMessage}</p>}

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="flex-between" style={{ gap: '1rem', flexWrap: 'wrap' }}><h3><Flame size={18} style={{ verticalAlign: 'middle', marginRight: 7, color: 'var(--accent-red)' }} />LeetCode Daily Challenge</h3>{daily && <span className="badge badge-blue">{daily.difficulty}</span>}</div>
        {daily ? <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}><div><strong>{daily.title}</strong><p style={{ fontSize: 13 }}>Daily problem for {daily.date}</p></div><a className="btn btn-primary btn-sm" href={daily.url} target="_blank" rel="noreferrer">Solve today <ExternalLink size={14} /></a></div> : <p>{errors.daily || 'Loading challenge…'}</p>}
      </section>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: 12 }}><Target size={18} style={{ verticalAlign: 'middle', marginRight: 7 }} />Recommended next ({recommended.level})</h3>
        {recommended.problems.length ? <div className="card-grid">{recommended.problems.map(problem => <article key={problem.id} style={{ border: '2px solid var(--border)', padding: 12, display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}><div><strong>{problem.title}</strong><p style={{ fontSize: 12 }}>{problem.topic} · {problem.platform}</p></div><a href={problem.url} target="_blank" rel="noreferrer" aria-label={`Solve ${problem.title}`}><ExternalLink size={17} /></a></article>)}</div> : <p>{problems.length ? 'You have completed this level’s starter recommendations. Keep practicing!' : errors.problems || 'Loading recommendations…'}</p>}
      </section>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: 12 }}><CalendarDays size={18} style={{ verticalAlign: 'middle', marginRight: 7 }} />Upcoming Codeforces contests</h3>
        {contests.length ? <div style={{ display: 'grid', gap: 8 }}>{contests.slice(0, 8).map(contest => <div key={contest.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 1fr) auto auto', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}><div><strong>{contest.name}</strong><p style={{ fontSize: 12 }}>{new Date(contest.startTimeSeconds * 1000).toLocaleString()} · {Math.floor(contest.durationSeconds / 3600)}h</p></div><span className="badge badge-purple"><Clock3 size={12} />{countdown(contest.startTimeSeconds, now)}</span><button className="btn btn-sm" onClick={() => setReminder(contest)}>Remind me</button></div>)}</div> : <p>{errors.contests || 'No upcoming contests found.'}</p>}
      </section>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: 12 }}>Codeforces class leaderboard</h3>
        {!leaderboard.length ? <p>{errors.leaderboard || 'No linked Codeforces students yet.'}</p> : <div style={{ overflowX: 'auto' }}><div style={{ display: 'grid', gridTemplateColumns: '55px minmax(160px, 1fr) 120px 110px', gap: 10, minWidth: 420, padding: '8px 0', color: 'var(--text-muted)', fontSize: 12, fontWeight: 700 }}><span>Rank</span><span>Student / handle</span><span>CF rank</span><span style={{ textAlign: 'right' }}>Rating</span></div>{leaderboard.map((student, index) => <div key={student._id} style={{ display: 'grid', gridTemplateColumns: '55px minmax(160px, 1fr) 120px 110px', gap: 10, minWidth: 420, alignItems: 'center', padding: '10px 0', borderTop: '1px solid var(--border)', background: student._id === ownId ? 'rgba(0,133,255,.08)' : 'transparent' }}><strong>#{index + 1}</strong><span>{student.name} <small style={{ color: 'var(--text-muted)' }}>@{student.handle}</small></span><span>{student.rank}</span><strong style={{ textAlign: 'right' }}>{student.rating}</strong></div>)}</div>}
      </section>

      <section className="card">
        <h3 style={{ marginBottom: 12 }}>Curated problem sets</h3>
        {!problems.length ? <p>{errors.problems || 'Loading problems…'}</p> : Object.entries(problems.reduce((groups, problem) => ({ ...groups, [problem.topic]: [...(groups[problem.topic] || []), problem] }), {})).map(([topic, topicProblems]) => <div key={topic} style={{ marginBottom: 18 }}><h4 style={{ marginBottom: 6 }}>{topic}</h4>{topicProblems.map(problem => <div key={problem.id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}><button type="button" className="btn btn-sm" aria-label={`${problem.completed ? 'Unmark' : 'Mark'} ${problem.title} as done`} onClick={() => markDone(problem.id)} style={{ padding: '5px 8px', color: problem.completed ? 'var(--accent-green)' : 'var(--text-muted)' }}>{problem.completed ? <Check size={15} /> : <span style={{ width: 15, height: 15, border: '1px solid currentColor' }} />}</button><div style={{ flex: 1 }}><a href={problem.url} target="_blank" rel="noreferrer" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{problem.title}</a><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{problem.platform} · {problem.difficulty}</div></div><a href={problem.url} target="_blank" rel="noreferrer" aria-label={`Open ${problem.title}`}><ExternalLink size={15} /></a></div>)}</div>)}
      </section>
    </main>
  </>;
}
