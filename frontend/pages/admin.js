import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { apiFetch } from '../utils/api';
import ComplaintCard from '../components/ComplaintCard';

export default function Admin() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await apiFetch('/api/complaints');
      if (!res.ok) {
        alert('Please login as admin');
        return;
      }
      const list = await res.json();
      setComplaints(list);
    })();
  }, []);

  async function update(id, status) {
    const res = await apiFetch('/api/complaints/' + id, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      const updated = await res.json();
      setComplaints(prev =>
        prev.map(c => (c._id === updated._id ? updated : c))
      );
    } else {
      alert('Update failed');
    }
  }

  return (
    <Layout>
      <h2>Admin Dashboard</h2>
      <p>Mark complaints as In Progress or Resolved.</p>

      {complaints.length ? (
        complaints.map(c => (
          <ComplaintCard
            key={c._id}
            c={c}
            onUpdate={status => update(c._id, status)}
          />
        ))
      ) : (
        <p>No complaints found</p>
      )}
    </Layout>
  );
}

