import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPolls, deletePoll, editPoll, getUserProfile } from '../api';
import { FaPoll, FaEdit, FaTrash } from 'react-icons/fa';
import './PollList.css';

function PollList() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userProfile = await getUserProfile();
        setUser(userProfile);
        const data = await getPolls();
        setPolls(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (pollId) => {
    if (window.confirm('Are you sure you want to delete this poll?')) {
      try {
        setLoading(true);
        await deletePoll(pollId);
        const updatedPolls = await getPolls();
        setPolls(updatedPolls);
      } catch (error) {
        console.error('Error deleting poll:', error);
        alert('Error: ' + (error.response?.data?.error || error.message));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (poll) => {
    navigate('/create-poll', { state: { poll } });
  };

  const handleViewPoll = (pollId) => {
    navigate(`/polls/${pollId}`);
  };

  if (!user) return <div className="auth-message">Please log in to view polls.</div>;

  return (
    <div className="poll-list-container">
      <h2 className="poll-list-title">Active Polls</h2>
      {loading ? (
        <div className="loading-message">
          <div className="spinner"></div>
          Loading...
        </div>
      ) : polls.length ? (
        <div className="polls-grid">
          {polls.map((poll, index) => (
            <div key={poll.id} className="poll-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="poll-content">
                <div className="poll-header">
                  <div className="poll-header-top">
                    <span className="poll-creator">Created by: {poll.creator}</span>
                    {user.username === poll.creator && (
                      <span className="creator-badge">Your Poll</span>
                    )}
                  </div>
                  <h3 className="poll-title">{poll.title}</h3>
                </div>
                <div className="poll-divider"></div>
                <p className="poll-description">{poll.description}</p>
              </div>
              <div className="action-group">
                <button
                  onClick={() => handleViewPoll(poll.id)}
                  className="action-button view-button"
                  title="Vote & View Results"
                >
                  <FaPoll /> Vote
                </button>
                {user.username === poll.creator && (
                  <>
                    <button
                      onClick={() => handleEdit(poll)}
                      className="action-button edit-button"
                      title="Edit Poll"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(poll.id)}
                      className="action-button delete-button"
                      title="Delete Poll"
                    >
                      <FaTrash /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-message">No polls available.</div>
      )}
    </div>
  );
}

export default PollList;