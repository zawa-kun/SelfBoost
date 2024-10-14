import React, { useState } from 'react';
import ChallengeCard from './ChallengeCard';

function ChallengeList({ darkMode, onUpdateProgress, onJoinChallenge }) {
  const [activeTab, setActiveTab] = useState('my');

  // ハードコーディングされたデータ
  const myChallenges = [
    { _id: '1', title: '毎日30分読書', goalValue: 30, progress: 15 },
    { _id: '2', title: '週3回ジョギング', goalValue: 3, progress: 2 },
  ];

  const publicChallenges = [
    { _id: '3', title: '1ヶ月間瞑想チャレンジ', participants: 120 },
    { _id: '4', title: '毎日1時間コーディング', participants: 250 },
    { _id: '5', title: '30日間早起きチャレンジ', participants: 180 },
  ];

  const challenges = activeTab === 'my' ? myChallenges : publicChallenges;

  return (
    <div>
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`py-2 px-4 ${activeTab === 'my' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
          onClick={() => setActiveTab('my')}
        >
          マイチャレンジ
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'public' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
          onClick={() => setActiveTab('public')}
        >
          みんなのチャレンジ
        </button>
      </div>

      <div className="space-y-4">
        {challenges.map(challenge => (
          <ChallengeCard 
            key={challenge._id}
            challenge={challenge}
            darkMode={darkMode}
            onUpdateProgress={onUpdateProgress}
            onJoinChallenge={onJoinChallenge}
            isPersonal={activeTab === 'my'}
          />
        ))}
      </div>
    </div>
  );
}

export default ChallengeList;