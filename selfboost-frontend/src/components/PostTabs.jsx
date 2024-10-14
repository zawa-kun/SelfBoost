import React from 'react';

const PostTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700">
      <button
        className={`py-2 px-4 ${activeTab === 'all' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
        onClick={() => setActiveTab('all')}
      >
        すべての投稿
      </button>  
      <button
        className={`py-2 px-4 ${activeTab === 'following' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
        onClick={() => setActiveTab('following')}
      >
        フォロー中
      </button>
    </div>
  );
};

export default PostTabs;