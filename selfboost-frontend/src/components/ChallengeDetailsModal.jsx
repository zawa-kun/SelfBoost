import React from "react";

function ChallengeDetailsModal({challenge,darkMode,onClose,onUpdateProgress,onJoinChallenge,isPersonal,currentUserId,}) {
  if (!challenge) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} w-full max-w-md`}>
          <h2 className="text-xl font-bold mb-4">エラー</h2>
          <p>チャレンジの詳細を読み込めませんでした。</p>
          <button
            onClick={onClose}
            className={`mt-4 px-4 py-2 rounded-md ${
              darkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-300 hover:bg-gray-400'
            } text-white`}
          >
            閉じる
          </button>
        </div>
      </div>
    );
  }
  const {
    _id,
    title,
    description,
    creator,
    goalType,
    goalValue,
    participants,
    createdAt,
    totalParticipants,
    participantStatus,
  } = challenge || {};
  console.log(createdAt);

  const userParticipation = participants?.find((p) => p.user === currentUserId);
  const isParticipating = !!userParticipation;
  const progress = userParticipation?.progress || 0;
  const progressPercentage = goalValue ? (progress / goalValue) * 100 : 0;

  const getTimeAgo = (date) => {
    // ... 既存の実装をそのまま使用 ...
  };

  const timeAgo = getTimeAgo(createdAt);

  const handleProgressUpdate = () => {
    onUpdateProgress(challenge);
  };

  const handleJoinChallenge = () => {
    onJoinChallenge(_id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`p-6 rounded-lg ${
          darkMode ? "bg-gray-800" : "bg-white"
        } w-full max-w-md`}
      >
        <h2 className="text-xl font-bold mb-4">{title || "チャレンジ"}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {description || "説明なし"}
        </p>
        <div className="mb-2">
          <span className="text-sm">作成者: {creator?.username || "不明"}</span>
          <span className="text-sm ml-4">
            作成: {new Date(createdAt).toLocaleDateString() || "不明"}
          </span>
        </div>
        <div className="mb-2">
          <span className="text-sm">
            目標: {goalValue} {goalType}
          </span>
          <span className="text-sm ml-4">参加者: {totalParticipants}人</span>
        </div>
        <div className="mb-4">
          <span className="text-sm ml-4">状態: {participantStatus}</span>
        </div>
        {(isPersonal || isParticipating) && (
          <>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mb-4">
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
        )}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md ${
              darkMode
                ? "bg-gray-600 hover:bg-gray-700"
                : "bg-gray-300 hover:bg-gray-400"
            } text-white mr-2`}
          >
            閉じる
          </button>
          {!isPersonal && !isParticipating && (
            <button
              onClick={handleJoinChallenge}
              className={`px-4 py-2 rounded-md ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              参加する
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChallengeDetailsModal;
