import apiClient from './apiClient';

//すべての投稿
export const getAllPosts = async () => {
  try {
    const response = await apiClient.get('/timeline/all');
    return response.data;
  } catch (error) {
    console.error('すべての投稿取得エラー:', error);
    throw error;
  }
};

//フォロー中タイムライン
export const getFollowingTimeline = async () => {
  try {
    const response = await apiClient.get('/timeline');
    return response.data;
  } catch (error) {
    console.error('フォロー中のタイムライン取得エラー:', error);
    throw error;
  }
};

//プロフィール用タイムライン
export const getUserTimeline = async (userId) => {
  try {
    const response = await apiClient.get(`/timeline/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user timeline:', error);
    throw error;
  }
};