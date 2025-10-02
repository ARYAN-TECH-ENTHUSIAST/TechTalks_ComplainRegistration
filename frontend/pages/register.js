import { useState } from 'react';
import { useRouter } from 'next/router';
import { apiFetch } from '../utils/api';
import Layout from '../components/Layout';

export default function Register() {
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const router = useRouter();

  async function submit(e){
    e.preventDefault();
    const res = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } else {
      alert('Error registering');
    }
  }

  return (
    <Layout>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" required /><br />
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required /><br />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required /><br />
        <button type="submit">Register</button>
      </form>
    </Layout>
  );
}
