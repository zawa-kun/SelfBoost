import apiClient from './apiClient';

//チャレンジ作成
export const createChallenge = async (challengeData) => {
  try {
    const response = await apiClient.post('/challenges', challengeData);
    return response.data;
  } catch (error) {
    console.error('チャレンジ作成エラー:', error);
    throw error;
  }
};

// ユーザーの参加しているチャレンジの詳細を取得
export const getUserChallenges = async (userId) => {
  try {
    const response = await apiClient.get(`/challenges/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user challenges:', error);
    throw error;
  }
};

//ユーザー登録数上位３つチャレンジを取得
export const getRecommendedChallenges = async () => {
  try {
    const response = await apiClient.get('/challenges/recommended');
    return response.data;
  } catch (error) {
    console.error('おすすめチャレンジ取得エラー:', error);
    throw error;
  }
};

//ユーザーのチャレンジ達成度上位３つを取得
export const getTopUserChallenges = async () => {
  try {
    const response = await apiClient.get('/challenges/user/top');
    return response.data;
  } catch (error) {
    console.error('トップチャレンジ取得エラー:', error);
    throw error;
  }
};

//チャレンジ取得（すべて）
export const getChallenges = async () => {
  try {
    const response = await apiClient.get('/challenges');
    return response.data;
  } catch (error) {
    console.error('すべてのチャレンジ取得エラー:', error);
    throw error;
  }
};

//チャレンジ取得（自分が登録しているチャレンジ）
export const getMyChallenges = async () => {
  try {
    const response = await apiClient.get('/challenges/my-challenge');
    return response.data;
  } catch (error) {
    console.error('マイチャレンジ取得エラー:', error);
    throw error;
  }
};

//特定のチャレンジ取得
export const getChallenge = async (challengeId) => {
  try {
    const response = await apiClient.get(`/challenges/${challengeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching challenge:', error);
    throw error;
  }
};

//チャレンジの更新
export const updateChallenge = async (challengeId, challengeData) => {
  try {
    const response = await apiClient.put(`/challenges/${challengeId}`, challengeData);
    return response.data;
  } catch (error) {
    console.error('Error updating challenge:', error);
    throw error;
  }
};

//チャレンジの削除
export const deleteChallenge = async (challengeId) => {
  try {
    const response = await apiClient.delete(`/challenges/${challengeId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting challenge:', error);
    throw error;
  }
};

//チャレンジ参加
export const joinChallenge = async (challengeId) => {
  try {
    const response = await apiClient.put(`/challenges/${challengeId}/join`);
    return response.data;
  } catch (error) {
    console.error('Error joining challenge:', error);
    throw error;
  }
};

//進捗更新
export const updateProgress = async (challengeId, progressData) => {
  try {
    console.log(progressData);
    const response = await apiClient.put(`/challenges/${challengeId}/progress`, progressData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating progress:', error);
    throw error;
  }
};