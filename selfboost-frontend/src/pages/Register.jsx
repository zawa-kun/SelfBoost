import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

function Register() {
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors,setErrors] =useState({});
  const [isSubmitting,setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:value
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    if(!formData.username.trim()) {
      newErrors.username = true;
    }
    if(!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = true;
    }
    if(formData.password.length < 6) {
      newErrors.password = true;
    }
    if(formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = true;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(validateForm()){
      setIsSubmitting(true);
      try {
        //ここでAPI呼び出し
        console.log('Form submitted:', formData);
        //成功した場合ログインページまたはホームページにリダイレクト
        navigate('/login');
      } catch (error) {
        console.error('Registration failed:',error);
        setErrors(prevErrors => ({...prevErrors, submit: '登録に失敗しました。もう一度お試しください'}));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    //フォームデータが更新されたときにエラーをクリア
    validateForm();
  },[formData])


  return (
    <div className={`min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`max-w-6xl w-full flex flex-col md:flex-row rounded-xl overflow-hidden shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {/* 左側：アプリ情報 */}
        <div className={`md:w-1/2 p-8 flex flex-col justify-center ${darkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-blue-100'}`}>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            SelfBoost
          </h1>
          <p className={`text-xl md:text-2xl mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            自分を高める、新しい自分に出会う
          </p>
          <p className={`text-md md:text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            日々の成長を仲間と共有し、互いに高め合いながら、自分の可能性を広げていくソーシャルネットワーク
          </p>
        </div>

        {/* 右側：登録フォーム */}
        <div className={`md:w-1/2 p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`} >
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              アカウント作成
            </h2>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-600'}`}
            >
              {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
            </button>
          </div>
          <form className="space-y-4" action="#" method="POST" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                ユーザー名
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="ユーザー名を入力"
              />
              {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username}</p>}
            </div>
            <div>
              <label htmlFor="email-address" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                メールアドレス
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="メールアドレスを入力"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="パスワードを設定"
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>
            <div>
              <label htmlFor="password-confirm" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                パスワード (確認)
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="パスワードを再入力"
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium ${darkMode ? 'text-gray-900 bg-white hover:bg-gray-100' : 'text-white bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isSubmitting ? '登録中...' : 'アカウントを作成'}
              </button>
            </div>
          </form>
          <p className={`mt-4 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            既にアカウントをお持ちですか？{' '}
            <Link to="/login" className={`font-medium ${darkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-500'}`}>
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;