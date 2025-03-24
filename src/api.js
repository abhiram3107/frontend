// src/api.js
import axios from 'axios';

const API_URL = 'https://voting-system-backend-uddi.onrender.com/api/';
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`; // JWT uses Bearer
    localStorage.setItem('accessToken', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('accessToken');
  }
};

export const login = async (username, password) => {
  const response = await api.post('token/', { username, password });
  setAuthToken(response.data.access);
  localStorage.setItem('refreshToken', response.data.refresh); // Store refresh token
  return response.data;
};

export const refreshToken = async () => {
  const refresh = localStorage.getItem('refreshToken');
  if (!refresh) throw new Error('No refresh token available');
  const response = await api.post('token/refresh/', { refresh });
  setAuthToken(response.data.access);
  return response.data.access;
};

export const register = async (username, email, password) => {
  const response = await api.post('register/', { username, email, password });
  return response.data;
};

export const getPolls = async () => {
  try {
    return (await api.get('polls/')).data;
  } catch (error) {
    if (error.response?.status === 401) {
      await refreshToken();
      return (await api.get('polls/')).data;
    }
    throw error;
  }
};

export const getPoll = async (pollId) => {
  try {
    return (await api.get(`polls/${pollId}/`)).data;
  } catch (error) {
    if (error.response?.status === 401) {
      await refreshToken();
      return (await api.get(`polls/${pollId}/`)).data;
    }
    throw error;
  }
};

export const vote = async (pollId, optionId) => {
  try {
    return (await api.post(`polls/${pollId}/vote/`, { option_id: optionId })).data;
  } catch (error) {
    if (error.response?.status === 401) {
      await refreshToken();
      return (await api.post(`polls/${pollId}/vote/`, { option_id: optionId })).data;
    }
    throw error;
  }
};

export const getResults = async (pollId) => {
  try {
    return (await api.get(`polls/${pollId}/results/`)).data;
  } catch (error) {
    if (error.response?.status === 401) {
      await refreshToken();
      return (await api.get(`polls/${pollId}/results/`)).data;
    }
    throw error;
  }
};

export const createPoll = async (pollData) => {
  try {
    return (await api.post('polls/create/', pollData)).data;
  } catch (error) {
    if (error.response?.status === 401) {
      await refreshToken();
      return (await api.post('polls/create/', pollData)).data;
    }
    throw error;
  }
};

export const editPoll = async (pollId, pollData) => {
  try {
    return (await api.put(`polls/${pollId}/edit/`, pollData)).data;
  } catch (error) {
    if (error.response?.status === 401) {
      await refreshToken();
      return (await api.put(`polls/${pollId}/edit/`, pollData)).data;
    }
    throw error;
  }
};

export const deletePoll = async (pollId) => {
  try {
    return (await api.delete(`polls/${pollId}/delete/`)).data;
  } catch (error) {
    if (error.response?.status === 401) {
      await refreshToken();
      return (await api.delete(`polls/${pollId}/delete/`)).data;
    }
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    return (await api.get('user/')).data;
  } catch (error) {
    if (error.response?.status === 401) {
      await refreshToken();
      return (await api.get('user/')).data;
    }
    throw error;
  }
};