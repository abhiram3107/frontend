import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPoll, vote } from '../api';
import './PollDetail.css';

function PollDetail({ user }) {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPoll = async () => {
      setLoading(true);
      try {
        const pollData = await getPoll(pollId);
        setPoll(pollData);

        // Check if user has voted (assuming pollData includes this info)
        // Adjust based on your API
        if (pollData.user_has_voted) setHasVoted(true);
      } catch (error) {
        console.error('Error fetching poll:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPoll();
  }, [pollId]);

  const handleVote = async () => {
    if (!selectedOption || hasVoted) return;
    try {
      setLoading(true);
      await vote(pollId, selectedOption);
      setHasVoted(true);
      alert('Vote recorded successfully');
    } catch (error) {
      console.error('Error voting:', error);
      alert('Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleViewResults = () => {
    navigate(`/polls/${pollId}/results`);
  };

  if (!user) return <div className="auth-message">Please log in to view this poll.</div>;
  if (loading || !poll) return <div className="loading-message">Loading...</div>;

  // Map options to a, b, c, d, etc.
  const optionLabels = poll.options.map((_, index) => String.fromCharCode(97 + index) + ')');

  return (
    <div className="poll-detail-container">
      <div className="poll-card">
        <h2 className="poll-title">{poll.title}</h2>
        <p className="poll-description">{poll.description}</p>

        {/* Voting Section */}
        <div className="voting-section">
          <h3 className="section-title">Cast Your Vote</h3>
          {poll.options.map((option, index) => (
            <div key={option.id} className="option-item">
              <input
                type="radio"
                id={`option-${option.id}`}
                name="option"
                value={option.id}
                onChange={() => setSelectedOption(option.id)}
                disabled={hasVoted}
                className="option-input"
              />
              <label htmlFor={`option-${option.id}`} className="option-label">
                {optionLabels[index]} {option.text}
              </label>
            </div>
          ))}
          <div className="button-group">
            <button
              onClick={handleVote}
              disabled={hasVoted || !selectedOption}
              className={`vote-button ${hasVoted || !selectedOption ? 'disabled' : ''}`}
            >
              {hasVoted ? 'Already Voted' : 'Submit Vote'}
            </button>
            <button onClick={handleViewResults} className="results-button">
              View Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PollDetail;