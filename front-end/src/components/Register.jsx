import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Registering:', { name, email, password }); // Debug
    try {
      const res = await API.post('/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token); // Optional: if token returned
      navigate('/');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h3 className="mb-4 text-center">Register</h3>
      <form onSubmit={handleSubmit} className="border p-4 shadow rounded">
        <div className="mb-3">
          <label>Name</label>
          <input type="text" className="form-control" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary w-100">Register</button>
        <p className="mt-3 text-center">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}
