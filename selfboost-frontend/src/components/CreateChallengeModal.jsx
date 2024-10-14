import React, { useState } from 'react';
import { createChallenge } from '../api/challengeApi';

function CreateChallengeModal({ darkMode, onClose, onCreateSuccess }) {
  const [challengeData, setChallengeData] = useState({
    title: '',
    description: '',
    goalType: 'days',
    goalValue: 30,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChallengeData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createChallenge(challengeData);
      onCreateSuccess();
      onClose();
    } catch (error) {
      console.error('チャレンジの作成に失敗しました:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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
              <option value="days">日数</option>
              <option value="times">回数</option>
              <option value="pages">ページ数</option>
            </select>
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
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-300 hover:bg-gray-400'}`}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-md ${
                darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              作成
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateChallengeModal;