// src/Home.js
import { Link, useNavigate } from 'react-router-dom';
import Login from './Login';
import { FaPoll, FaPlusCircle, FaSignOutAlt, FaHome, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Home.css';

function Home({ setUser, user, handleLogout }) {
  const navigate = useNavigate();

  if (!user) return <Login setUser={setUser} />;

  const contentVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const navLinkVariants = {
    hover: { scale: 1.1, color: "#ffffff", transition: { duration: 0.3 } },
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <h1 className="navbar-title">Voting System</h1>
        <div className="navbar-links">
          <motion.div variants={navLinkVariants} whileHover="hover">
            <Link to="/home" className="nav-link">
              <FaHome className="icon" /> Home
            </Link>
          </motion.div>

          <motion.div variants={navLinkVariants} whileHover="hover">
            <Link to="/polls" className="nav-link">
              <FaPoll className="icon" /> Polls
            </Link>
          </motion.div>

          <motion.div variants={navLinkVariants} whileHover="hover">
            <Link to="/create-poll" className="nav-link">
              <FaPlusCircle className="icon" /> Create Poll
            </Link>
          </motion.div>

          <motion.div variants={navLinkVariants} whileHover="hover">
            <span className="nav-link">
              <FaUser className="icon" /> Welcome, {user.username}
            </span>
          </motion.div>

          <motion.div variants={navLinkVariants} whileHover="hover">
            <button onClick={handleLogout} className="logout-btn">
              <FaSignOutAlt className="icon" /> Logout
            </button>
          </motion.div>
        </div>
      </nav>

      <div className="content-container">
        <motion.div
          className="content-card"
          variants={contentVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="content-title">Welcome to the Voting System</h2>
          <p className="content-subtitle">
            Engage in polls, share your opinions, and view real-time results!
          </p>

          <div className="user-greeting">
            <span className="username">Hello, {user.username}!</span>
            <p className="user-role">
              {user.isAdmin ? (
                <span className="role-badge admin">Admin Dashboard Access</span>
              ) : (
                <span className="role-badge voter">Voter Access</span>
              )}
            </p>
          </div>

          <div className="footer-info">
            <p>
              <span className="highlight secure">Secure</span> |{' '}
              <span className="highlight transparent">Transparent</span> |{' '}
              <span className="highlight realtime">Real-Time Voting</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Home;