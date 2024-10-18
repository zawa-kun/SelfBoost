import React, { useState } from 'react';
import { createChallenge } from '../api/challengeApi';

function CreateChallengeModal({ darkMode, onClose, onCreateSuccess }) {
  const [challengeData, setChallengeData] = useState({
    title: '',
    description: '',
    goalType: 'ページ',
    goalValue: 1,
    isPublic: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const goalTypes = ['ページ', '日', '時間', '分', '回', '章', 'km'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setChallengeData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const newChallenge = await createChallenge(challengeData);
      onCreateSuccess(newChallenge);
      onClose();
    } catch (error) {
      console.error('チャレンジの作成に失敗しました:', error);
      setError('チャレンジの作成に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} w-full max-w-md`}>
        <h2 className="text-xl font-bold mb-4">新規チャレンジ作成</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">タイトル</label>
            <input
              type="text"
              name="title"
              value={challengeData.title}
              onChange={handleChange}
              className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}
              required
              maxLength={100}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">説明</label>
            <textarea
              name="description"
              value={challengeData.description}
              onChange={handleChange}
              className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}
              rows="3"
              required
              maxLength={1000}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">目標値</label>
            <input
              type="number"
              name="goalValue"
              value={challengeData.goalValue}
              onChange={handleChange}
              className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}
              required
              min="1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">目標タイプ</label>
            <select
              name="goalType"
              value={challengeData.goalType}
              onChange={handleChange}
              className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}
            >
              {goalTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isPublic"
                checked={challengeData.isPublic}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm font-medium">公開する</span>
            </label>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-300 hover:bg-gray-400'}`}
              disabled={isSubmitting}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-md ${
                darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
              disabled={isSubmitting}
            >
              {isSubmitting ? '作成中...' : '作成'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateChallengeModal;