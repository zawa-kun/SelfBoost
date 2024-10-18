import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { login } from "../api/authApi";
import { useUser } from "../contexts/UserContext";

export default function Login() {
  const [darkMode, setDarkMode] = useState(false);
  const [userData, setuserData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { setUser } = useUser();
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  //データの入力
  const handleChange = (e) => {
    const { name, value } = e.target;
    setuserData((prevData) => ({ ...prevData, [name]: value }));
    setTouched((prevTouched) => ({ ...prevTouched, [name]: true }));
  };

  const validateForm = useCallback(() => {
    let newErrors = {};
    if (!userData.email.trim()) {
      newErrors.email = "メールアドレスは必須です";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "有効なメールアドレスを入力してください";
    }
    if (!userData.password) {
      newErrors.password = "パスワードは必須です";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  },[userData.email,userData.password]);

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const response = await login(userData);
        const { token, user } = response;
        
        // トークンを保存
        if(rememberMe){
          localStorage.setItem('token', token);
        } else {
          sessionStorage.setItem('token', token);
        }

        // ユーザー情報を設定
        setUser(user);

        // ホームページにリダイレクト
        navigate("/");
      } catch (error) {
        console.error("Login failed:", error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          submit: error.response?.data?.message || "ログインに失敗しました。メールアドレスまたはパスワードを確認してください。",
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validateForm();
    }
  }, [userData, touched, validateForm]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div
        className={`max-w-6xl w-full flex flex-col md:flex-row rounded-xl overflow-hidden shadow-2xl ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* 左側：アプリ情報 */}
        <div
          className={`md:w-1/2 p-8 flex flex-col justify-center ${
            darkMode
              ? "bg-gradient-to-br from-gray-700 to-gray-800"
              : "bg-gradient-to-br from-blue-50 to-blue-100"
          }`}
        >
          <h1
            className={`text-4xl md:text-5xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            SelfBoost
          </h1>
          <p
            className={`text-xl md:text-2xl mb-6 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            自分を高める、新しい自分に出会う
          </p>
          <p
            className={`text-md md:text-lg ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            日々の成長を仲間と共有し、互いに高め合いながら、自分の可能性を広げていくソーシャルネットワーク
          </p>
        </div>

        {/* 右側：登録フォーム */}
        <div
          className={`md:w-1/2 p-8 ${darkMode ? "bg-gray-800" : "bg-white"}`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2
              className={`text-3xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              ログイン
            </h2>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                darkMode
                  ? "bg-gray-700 text-yellow-300"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {darkMode ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
            </button>
          </div>
          <form
            className="space-y-4"
            action="#"
            method="POST"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                htmlFor="email-address"
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                メールアドレス
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                value={userData.email}
                onChange={handleChange}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  darkMode
                    ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                    : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="メールアドレスを入力"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={userData.password}
                onChange={handleChange}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  darkMode
                    ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                    : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="パスワードを入力"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberMeChange}
                className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                  darkMode ? "bg-gray-700 border-gray-600" : ""
                }`}
              />
              <label
                htmlFor="remember-me"
                className={`ml-2 block text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-900"
                }`}
              >
                ログイン状態を保持する
              </label>
            </div>
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                  darkMode
                    ? "text-gray-900 bg-white hover:bg-gray-100"
                    : "text-white bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isSubmitting ? "ログイン中..." : "ログイン"}
              </button>
              {errors.submit && (
                <p className="mt-1 text-xs text-red-500">{errors.submit}</p>
              )}
            </div>
          </form>
          <p
            className={`mt-4 text-center text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            アカウントをお持ちでないですか？{" "}
            <Link
              to="/register"
              className={`font-medium ${
                darkMode
                  ? "text-blue-300 hover:text-blue-200"
                  : "text-blue-600 hover:text-blue-500"
              }`}
            >
              新規作成
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
