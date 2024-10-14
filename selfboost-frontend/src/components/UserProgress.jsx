import React from "react";

function UserProgress({darkMode}) {
  return (
    <div className={`p-4 md:p-6 rounded-lg shadow-md ${ darkMode ? "bg-gray-800" : "bg-white" } mb-6`}>
      <h2 className="text-lg md:text-xl font-semibold mb-4">今日の進捗</h2>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span>瞑想</span>
            <span>15/20分</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: "75%" }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span>読書</span>
            <span>2/3章</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-green-600 h-2.5 rounded-full"
              style={{ width: "66%" }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span>エクササイズ</span>
            <span>30/45分</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-yellow-600 h-2.5 rounded-full"
              style={{ width: "66%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProgress;
