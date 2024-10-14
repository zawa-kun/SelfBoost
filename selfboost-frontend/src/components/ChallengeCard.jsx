import React from 'react';

function ChallengeCard({ challenge, darkMode, onUpdateProgress, onJoinChallenge, isPersonal }) {
  return (
    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
      <h3 className="text-lg font-semibold mb-2">{challenge.title}</h3>
      <div className="flex justify-between items-center">
        {isPersonal ? (
          <>
            <div className="w-2/3">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{width: `${(challenge.progress / challenge.goalValue) * 100}%`}}
                ></div>
              </div>
            </div>
            <span>{challenge.progress} / {challenge.goalValue}</span>
            <button 
              onClick={() => onUpdateProgress(challenge)}
              className={`px-3 py-1 rounded-md text-sm ${
                darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
              } text-white`}
            >
              進捗更新
            </button>
          </>
        ) : (
          <>
            <span>{challenge.participants} 人が参加中</span>
            <button 
              onClick={() => onJoinChallenge(challenge._id)}
              className={`px-3 py-1 rounded-md text-sm ${
                darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              登録する
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ChallengeCard;