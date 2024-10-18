import React from 'react';
import ChallengeCard from './ChallengeCard';

function ChallengeList({ darkMode, challenges, activeTab, onTabChange, onUpdateProgress, onJoinChallenge, currentUserId }) {
  return (
    <div>
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`py-2 px-4 ${activeTab === 'my' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
          onClick={() => onTabChange('my')}
        >
          マイチャレンジ
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'public' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
          onClick={() => onTabChange('public')}
        >
          みんなのチャレンジ
        </button>
      </div>

      <div className="space-y-4">
        {challenges.length === 0 ? (
          <p>チャレンジがありません。</p>
        ) : (
          challenges.map(challenge => (
            <ChallengeCard 
              key={challenge._id}
              challenge={challenge}
              darkMode={darkMode}
              onUpdateProgress={onUpdateProgress}
              onJoinChallenge={onJoinChallenge}
              isPersonal={activeTab === 'my'}
              currentUserId={currentUserId}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ChallengeList;