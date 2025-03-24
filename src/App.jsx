import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import CreatePoll from './pages/CreatePoll';
import PollList from './pages/PollList';
import PollDetail from './pages/PollDetail';
import { setAuthToken, getUserProfile } from './api';
import './App.css';
import PollResults from './pages/PollResults';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAuthToken(token);
      getUserProfile()
        .then((profile) => {
          setUser({ token, isAdmin: profile.is_admin, username: profile.username });
        })
        .catch(() => {
          setAuthToken(null);
          setUser(null);
          navigate('/');
        });
    }
  }, [navigate]);

  const handleLogin = (token, isAdmin, username) => {
    setUser({ token, isAdmin, username });
    navigate('/home');
  };

  const handleLogout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  return (
    <div className="app-container">
      <div className="container">
        <Routes>
          <Route path="/" element={<Home setUser={handleLogin} user={user} handleLogout={handleLogout} />} />
          <Route path="/home" element={<Home setUser={handleLogin} user={user} handleLogout={handleLogout} />} />
          <Route path="/create-poll" element={<CreatePoll user={user} />} />
          <Route path="/polls" element={<PollList user={user} />} />
          <Route path="/polls/:pollId" element={<PollDetail user={user} />} />
          <Route path="/polls/:pollId" element={<PollDetail user={user} />} />
        <Route path="/polls/:pollId/results" element={<PollResults user={user} />} />
        </Routes>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}