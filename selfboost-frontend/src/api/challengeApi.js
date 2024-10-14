import apiClient from './apiClient';

export const createChallenge = async (challengeData) => {
  try {
    const response = await apiClient.post('/challenges', challengeData);
    return response.data;
  } catch (error) {
    console.error('Error creating challenge:', error);
    throw error;
  }
};

export const getChallenges = async () => {
  try {
    const response = await apiClient.get('/challenges');
    return response.data;
  } catch (error) {
    console.error('Error fetching challenges:', error);
    throw error;
  }
};

export const getChallenge = async (challengeId) => {
  try {
    const response = await apiClient.get(`/challenges/${challengeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching challenge:', error);
    throw error;
  }
};

export const updateChallenge = async (challengeId, challengeData) => {
  try {
    const response = await apiClient.put(`/challenges/${challengeId}`, challengeData);
    return response.data;
  } catch (error) {
    console.error('Error updating challenge:', error);
    throw error;
  }
};

export const deleteChallenge = async (challengeId) => {
  try {
    const response = await apiClient.delete(`/challenges/${challengeId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting challenge:', error);
    throw error;
  }
};

export const joinChallenge = async (challengeId) => {
  try {
    const response = await apiClient.put(`/challenges/${challengeId}/join`);
    return response.data;
  } catch (error) {
    console.error('Error joining challenge:', error);
    throw error;
  }
};

export const updateProgress = async (challengeId, progressData) => {
  try {
    const response = await apiClient.put(`/challenges/${challengeId}/progress`, progressData);
    return response.data;
  } catch (error) {
    console.error('Error updating progress:', error);
    throw error;
  }
};