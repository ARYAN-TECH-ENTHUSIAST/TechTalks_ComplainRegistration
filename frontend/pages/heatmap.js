import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { apiFetch } from '../utils/api';

const HeatMapNoSSR = dynamic(() => import('../components/HeatmapMap'), { ssr: false });

export default function HeatmapPage() {
  const [points, setPoints] = useState([]);
  useEffect(()=> {
    (async ()=> {
      const res = await apiFetch('/api/complaints');
      if (!res.ok) return;
      const data = await res.json();
      // convert to [lat, lng, intensity]
      const pts = data
        .filter(c => c.location && c.location.coordinates && c.location.coordinates.length === 2)
        .map(c => [c.location.coordinates[1], c.location.coordinates[0], 0.5]);
      setPoints(pts);
    })();
  }, []);
  return (
    <Layout>
      <h2>Heatmap</h2>
      <div style={{ height: '70vh' }}>
        <HeatMapNoSSR points={points} />
      </div>
    </Layout>
  );
}
