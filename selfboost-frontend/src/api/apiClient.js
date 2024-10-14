//アプリケーション全体のAPI通信設定
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api", //APIのベースURL
  headers: {
    "Content-Type": "application/json",
  },
});

//トークンを取得する関数
const getAuthToken = () => {
  //tokenの保存場所はログイン時ユーザー側が保存場所を選択できるため
  let token = localStorage.getItem("token");
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token || "";
};

// リクエストインターセプタ―
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
