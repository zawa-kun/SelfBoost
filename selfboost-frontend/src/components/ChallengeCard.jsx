import React, { useState } from "react";
import ChallengeDetailsModal from "./ChallengeDetailsModal";

function ChallengeCard({challenge,darkMode,onUpdateProgress,onJoinChallenge,currentUserId,isPersonal,}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { _id, title, goalValue, goalType, participants, totalParticipants } = challenge;
  const userParticipation = participants.find((p) => p.user === currentUserId);
  const isParticipating = !!userParticipation;
  const progress = userParticipation ? userParticipation.progress : 0;
  const progressPercentage = goalValue ? (progress / goalValue) * 100 : 0;



  const handleProgressUpdate = (e) => {
    e.stopPropagation();
    onUpdateProgress(challenge);
  };

  const handleJoinChallenge = (e) => {
    e.stopPropagation();
    onJoinChallenge(_id);
  };

  return (
    <>
      <div
        className={`p-4 rounded-lg ${
          darkMode ? "bg-gray-800" : "bg-white"
        } shadow cursor-pointer`}
        onClick={() => setIsModalOpen(true)}
      >
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {isPersonal || isParticipating ? (
          <>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span>進捗状況</span>
              <span>{progressPercentage.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>
                {progress} / {goalValue} {goalType}
              </span>
              <button
                onClick={handleProgressUpdate}
                className={`px-3 py-1 rounded-md text-sm ${
                  darkMode
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-green-500 hover:bg-green-600"
                } text-white`}
              >
                進捗更新
              </button>
            </div>
          </>
        ) : (
          <div className="flex justify-between items-center">
            <span>{totalParticipants} 人が参加中</span>
            <button
              onClick={handleJoinChallenge}
              className={`px-3 py-1 rounded-md text-sm ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              参加する
            </button>
          </div>
        )}
      </div>
      {isModalOpen && (
        <ChallengeDetailsModal
          challenge={challenge}
          darkMode={darkMode}
          onClose={() => setIsModalOpen(false)}
          onUpdateProgress={onUpdateProgress}
          onJoinChallenge={onJoinChallenge}
          isPersonal={isPersonal}
          currentUserId={currentUserId}
        />
      )}
    </>
  );
}

export default ChallengeCard;
