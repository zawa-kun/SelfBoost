import React from "react";

function RecommendedChallenges({darkMode}) {
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
        <li className="flex items-center">
          <span className="bg-blue-500 h-2 w-2 rounded-full mr-2"></span>
          30日間連続瞑想チャレンジ
        </li>
        <li className="flex items-center">
          <span className="bg-green-500 h-2 w-2 rounded-full mr-2"></span>
          1週間の感謝日記チャレンジ
        </li>
        <li className="flex items-center">
          <span className="bg-yellow-500 h-2 w-2 rounded-full mr-2"></span>
          21日間早起きチャレンジ
        </li>
      </ul>
      <button
        className={`mt-4 w-full px-4 py-2 rounded-md ${
          darkMode
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-blue-500 hover:bg-blue-600"
        } text-white`}
      >
        新しいチャレンジを始める
      </button>
    </div>
  );
}

export default RecommendedChallenges;
