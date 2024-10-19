import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRecommendedChallenges } from "../api/challengeApi";

function RecommendedChallenges({ darkMode }) {
  const [recommendedChallenges, setRecommendedChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendedChallenges = async () => {
      try {
        const challenges = await getRecommendedChallenges();
        setRecommendedChallenges(challenges);
      } catch (err) {
        setError("おすすめチャレンジの取得に失敗しました。");
        console.error("おすすめチャレンジ取得エラー:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedChallenges();
  }, []);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div
      className={`p-4 md:p-6 rounded-lg shadow-md ${
        darkMode ? "bg-gray-800" : "bg-white"
      } mb-6`}
    >
      <h2 className="text-lg md:text-xl font-semibold mb-4">
        おすすめのチャレンジ
      </h2>
      <ul className="space-y-3">
        {recommendedChallenges.map((challenge, index) => (
          <li key={challenge._id} className="flex items-center">
            <span className={`bg-${['blue', 'green', 'yellow'][index]}-500 h-2 w-2 rounded-full mr-2`}></span>
            {challenge.title}
          </li>
        ))}
      </ul>
      <Link to="/challenge">
        <button
          className={`mt-4 w-full px-4 py-2 rounded-md ${
            darkMode
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
        >
          新しいチャレンジを始める
        </button>
      </Link>
    </div>
  );
}

export default RecommendedChallenges;
