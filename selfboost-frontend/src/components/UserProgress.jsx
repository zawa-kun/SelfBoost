import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTopUserChallenges } from "../api/challengeApi";

const goalTypeColors = {
  'ページ': 'bg-blue-600',
  '日': 'bg-green-600',
  '時間': 'bg-yellow-600',
  '分': 'bg-red-600',
  '回': 'bg-purple-600',
  '章': 'bg-indigo-600',
  'km': 'bg-pink-600',
  // デフォルトの色
  'default': 'bg-gray-600'
};

function UserProgress({darkMode}) {
  const [topChallenges, setTopChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopChallenges = async () => {
      try {
        setLoading(true);
        const challenges = await getTopUserChallenges();
        setTopChallenges(challenges.slice(0, 3)); // 上位3つのチャレンジを取得
      } catch (err) {
        setError("チャレンジの取得に失敗しました。");
        console.error("チャレンジ取得エラー:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopChallenges();
  }, []);

  if(loading) return <div>読み込み中...</div>;
  if(error) return <div>エラー...{error}</div>

  return (
    <Link to="/challenge">
      <div className={`p-4 md:p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"} mb-6`}>
        <h2 className="text-lg md:text-xl font-semibold mb-4">現在の進捗</h2>
        <div className="space-y-4">
          {topChallenges.map((challenge) => (
            <div key={challenge._id}>
              <div className="flex justify-between mb-1">
                <span>{challenge.title}</span>
                <span>{challenge.progress}/{challenge.goalValue} {challenge.goalType}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className={`${goalTypeColors[challenge.goalType] || goalTypeColors['default']} h-2.5 rounded-full`}
                  style={{ width: `${challenge.progressPercentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default UserProgress;
