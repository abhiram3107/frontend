import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import { createPoll, editPoll } from '../api';
import './CreatePoll.css'; // Reuse CSS, though you might rename it

function CreatePoll({ user }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [editingPoll, setEditingPoll] = useState(null);
  const location = useLocation();
  const navigate = useNavigate(); // For redirecting after submission

  // Check for passed poll data when component mounts
  useEffect(() => {
    const poll = location.state?.poll;
    if (poll) {
      setEditingPoll(poll);
      setTitle(poll.title);
      setDescription(poll.description || '');
      setOptions(poll.options.map(opt => opt.text));
    }
  }, [location.state]);

  // Remove admin check; allow any authenticated user
  if (!user) return <div className="no-access">Please log in to create polls.</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pollData = { 
      title, 
      description, 
      options: options.filter(opt => opt.trim() !== '') 
    };
    try {
      setLoading(true);
      if (editingPoll) {
        await editPoll(editingPoll.id, pollData);
        setEditingPoll(null);
      } else {
        await createPoll(pollData);
      }
      // Reset form and redirect to poll list
      setTitle('');
      setDescription('');
      setOptions(['', '']);
      navigate('/polls'); // Redirect to poll list after submission
    } catch (error) {
      console.error('Error submitting poll:', error);
      alert('Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAddOption = () => setOptions([...options, '']);
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className="admin-dashboard-container">
      <h2 className="admin-dashboard-title">{editingPoll ? 'Edit Poll' : 'Create Poll'}</h2>
      <form onSubmit={handleSubmit} className="poll-form">
        <div className="form-group">
          <label htmlFor="poll-title" className="form-label">Poll Title</label>
          <input
            type="text"
            id="poll-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="poll-description" className="form-label">Description</label>
          <textarea
            id="poll-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Options</label>
          {options.map((option, index) => (
            <input
              key={index}
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="input-field"
              required
            />
          ))}
          <button type="button" onClick={handleAddOption} className="add-option-button">Add Option</button>
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Submitting...' : editingPoll ? 'Update Poll' : 'Create Poll'}
        </button>
      </form>
    </div>
  );
}

export default CreatePoll;