import { useState } from 'react';
import Layout from '../components/Layout';
import { apiFetch } from '../utils/api';
import { useRouter } from 'next/router';

export default function Submit() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [latLng, setLatLng] = useState(null);
  const router = useRouter();

  function grabLocation() {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    navigator.geolocation.getCurrentPosition(pos => setLatLng([pos.coords.latitude, pos.coords.longitude]));
  }

  async function submit(e) {
    e.preventDefault();
    const form = new FormData();
    form.append('title', title);
    form.append('description', description);
    if (latLng) {
      form.append('lat', latLng[0]);
      form.append('lng', latLng[1]);
    }
    for (let f of files) form.append('images', f);
    const res = await apiFetch('/api/complaints', { method: 'POST', body: form });
    if (res.ok) {
      alert('Submitted');
      router.push('/dashboard');
    } else {
      alert('Error submitting');
    }
  }

  return (
    <Layout>
      <h2>Submit Complaint</h2>
      <form onSubmit={submit}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" required /><br />
        <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" required /><br />
        <input type="file" multiple accept="image/*" onChange={e=>setFiles(e.target.files)} /><br />
        <button type="button" onClick={grabLocation}>Grab My Location</button>
        {latLng && <div>Lat: {latLng[0]}, Lng: {latLng[1]}</div>}
        <button type="submit">Submit</button>
      </form>
    </Layout>
  );
}
