import apiClient from './apiClient';

//投稿作成
export const createPost = async (postData) => {
  try {
    const response = await apiClient.post('/posts', postData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

//投稿編集
export const editPost = async (postId, postData) => {
  try {
    const response = await apiClient.put(`/posts/${postId}`, postData);
    return response.data;
  } catch (error) {
    console.error('Error editing post:', error);
    throw error;
  }
};

//投稿取得
export const getPost = async (postId) => {
  try {
    const response = await apiClient.get(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
};

//投稿削除
export const deletePost = async (postId) => {
  try {
    const response = await apiClient.delete(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

//投稿いいね/いいね取り消し
export const likePost = async (postId) => {
  try {
    const response = await apiClient.put(`/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};
