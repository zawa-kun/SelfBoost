import apiClient from "./apiClient";

//ログイン
export const login = async (userData) => {
    try {
        const response = await apiClient.post('/auth/login', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

//新規登録
export const register = async (userData) => {
    try {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

//ログアウト
export const logout = async () => {
    try {
        const response = await apiClient.post('/auth/logout');
        return response.data;
    } catch (error) {
        throw error;
    }
};