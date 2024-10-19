import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { getUserChallenges } from "../api/challengeApi";

function QuickStats({darkMode}) {
  const { user } = useUser();
  const [challengeStats, setChallengeStats] = useState({
    completedChallenges: 0,
    ongoingChallenges: 0
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChallengeStats = async () => {
      if (user) {
        try {
          const challenges = await getUserChallenges(user._id);
          const completed = challenges.filter(challenge => challenge.progressPercentage >= 100).length;
          const ongoing = challenges.length - completed;
          
          setChallengeStats({
            completedChallenges: completed,
            ongoingChallenges: ongoing
          });
          setError(null);
        } catch (error) {
          console.error("Failed to fetch challenge stats:", error);
          setError("チャレンジ統計情報の取得に失敗しました");
        }
      }
    };

    fetchChallengeStats();
  }, [user]);

  if (error) {
    return (
      <div className={`p-4 md:p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className={`p-4 md:p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
      <h2 className="text-lg md:text-xl font-semibold mb-4">クイックスタッツ</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold">{challengeStats.completedChallenges}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">達成したチャレンジ</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{challengeStats.ongoingChallenges}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">進行中のチャレンジ</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{user.followings ? user.followings.length : 0}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">フォロー</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{user.followers ? user.followers.length : 0}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">フォロワー</p>
        </div>
      </div>
    </div>
  );
}

export default QuickStats;
