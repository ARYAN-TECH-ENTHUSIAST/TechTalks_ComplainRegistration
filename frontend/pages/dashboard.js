import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { apiFetch } from '../utils/api';
import ComplaintCard from '../components/ComplaintCard';

export default function Dashboard() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await apiFetch('/api/complaints');
      if (!res.ok) return alert('Please login first');
      const list = await res.json();
      setComplaints(list);
    })();
  }, []);

  // Split into active vs solved
  const active = complaints.filter(c => c.status !== 'RESOLVED');
  const solved = complaints.filter(c => c.status === 'RESOLVED');

  return (
    <Layout>
      <h2>My Complaints</h2>

      <h3>Active Complaints</h3>
      {active.length ? (
        active.map(c => <ComplaintCard key={c._id} c={c} />)
      ) : (
        <p>No active complaints</p>
      )}

      <h3 style={{ marginTop: '20px' }}>Solved Complaints</h3>
      {solved.length ? (
        solved.map(c => <ComplaintCard key={c._id} c={c} />)
      ) : (
        <p>No solved complaints yet</p>
      )}
    </Layout>
  );
}

