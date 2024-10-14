import React, { useState } from 'react';
import { updateProgress } from '../api/challengeApi';

export default function ProgressUpdateModal({ challenge, darkMode, onClose }) {
  const [progress, setProgress] = useState(challenge.currentProgress);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProgress(challenge._id, { progress });
      onClose();
    } catch (error) {
      console.error('進捗の更新に失敗しました:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} w-full max-w-md`}>
        <h2 className="text-xl font-bold mb-4">進捗更新</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              現在の進捗 ({challenge.goalType})
            </label>
            <input
              type="number"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}
              min="0"
              max={challenge.goalValue}
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
              更新
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}