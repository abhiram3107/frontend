import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register, getUserProfile, setAuthToken } from '../api';
import './Login.css';

function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        const data = await register(username, email, password);
        alert('Registered successfully! Please log in.');
        setIsRegister(false);
      } else {
        const { access } = await login(username, password);
        console.log('Login response:', { access }); // Debug log
        setAuthToken(access); // Set the token immediately
        const profile = await getUserProfile();
        console.log('User profile response:', profile); // Debug log
        const isAdmin = profile.is_admin;
        setUser(access, isAdmin); // Pass the token as the first argument
        navigate("/"); // Redirect based on role
      }
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || 'Invalid credentials'));
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">{isRegister ? 'Register' : 'Login'}</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
            required
          />
          {isRegister && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          )}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
          />
          <button type="submit" className="submit-button">
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="switch-button"
        >
          {isRegister ? 'Switch to Login' : 'Switch to Register'}
        </button>
      </div>
    </div>
  );
}

export default Login;