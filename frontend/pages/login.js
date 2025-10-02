import { useState } from 'react';
import { useRouter } from 'next/router';
import { apiFetch } from '../utils/api';
import Layout from '../components/Layout';

export default function Login() {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const router = useRouter();

  async function submit(e){
    e.preventDefault();
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  }

  return (
    <Layout>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required /><br />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required /><br />
        <button type="submit">Login</button>
      </form>
    </Layout>
  );
}
