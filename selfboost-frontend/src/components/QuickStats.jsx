import React from "react";

function QuickStats({darkMode}) {
  return (
    <div
      className={`p-4 md:p-6 rounded-lg shadow-md ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <h2 className="text-lg md:text-xl font-semibold mb-4">
        クイックスタッツ
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold">15</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            達成したゴール
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">7</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            進行中のチャレンジ
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">124</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">つながり</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">30</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            連続ログイン日数
          </p>
        </div>
      </div>
    </div>
  );
}

export default QuickStats;
