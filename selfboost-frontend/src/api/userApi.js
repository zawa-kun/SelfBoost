import apiClient from './apiClient';

export const getUserInfo = async (userId) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};

export const updateUserInfo = async (userId, userData) => {
  try {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user info:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// userApi.js

export const checkFollowStatus = async (userId) => {
  try {
    const response = await apiClient.get(`/users/${userId}/follow-status`);
    return response.data.isFollowing;
  } catch (error) {
    console.error('フォロー状態の確認に失敗しました:', error);
    throw error;
  }
};

export const followUser = async (userId) => {
  try {
    const response = await apiClient.put(`/users/${userId}/follow`);
    return response.data;
  } catch (error) {
    console.error('フォローに失敗しました:', error);
    throw error;
  }
};

export const unfollowUser = async (userId) => {
  try {
    const response = await apiClient.put(`/users/${userId}/unfollow`);
    return response.data;
  } catch (error) {
    console.error('フォロー解除に失敗しました:', error);
    throw error;
  }
};