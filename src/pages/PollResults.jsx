import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPoll, getResults } from '../api';
import './PollResults.css';

function PollResults({ user }) {
  const { pollId } = useParams();
  const [poll, setPoll] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPollAndResults = async () => {
      setLoading(true);
      try {
        const pollData = await getPoll(pollId);
        setPoll(pollData);

        const resultsData = await getResults(pollId);
        setResults(resultsData);
      } catch (error) {
        console.error('Error fetching poll or results:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPollAndResults();
  }, [pollId]);

  if (!user) return <div className="auth-message">Please log in to view this poll.</div>;
  if (loading || !poll || !results) return <div className="loading-message">Loading...</div>;

  // Map options to a, b, c, d, etc.
  const optionLabels = poll.options.map((_, index) => String.fromCharCode(97 + index) + ')');

  // Calculate total votes for progress bar percentages
  const totalVotes = results.options.reduce((sum, opt) => sum + opt.vote_count, 0);

  return (
    <div className="poll-results-container">
      <div className="poll-card">
        <h2 className="poll-title">{poll.title}</h2>
        <p className="poll-description">{poll.description}</p>

        {/* Results Section */}
        <div className="results-section">
          <h3 className="section-title">Poll Results</h3>
          {results.options.map((opt, index) => {
            const percentage = totalVotes > 0 ? (opt.vote_count / totalVotes) * 100 : 0;
            return (
              <div key={opt.id} className="result-item">
                <div className="result-label">
                  {optionLabels[index]} {opt.text}
                </div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${percentage}%` }}
                  >
                    <span className="progress-text">{opt.vote_count} votes</span>
                  </div>
                </div>
              </div>
            );
          })}
          <p className="winner-text">Winner: {results.winner}</p>
        </div>
      </div>
    </div>
  );
}

export default PollResults;