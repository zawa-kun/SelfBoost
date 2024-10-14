import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sideber from '../components/Sidebar';
import PostForm from '../components/PostForm';
import PostTabs from '../components/PostTabs';
import Post from '../components/Post';
import UserProgress from '../components/UserProgress';
import RecommendedChallenges from '../components/RecommendedChallenges';
import QuickStats from '../components/QuickStats';
import Footer from '../components/Footer';
import { getAllPosts, getFollowingTimeline } from '../api/timelineApi';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [postContent, setPostContent] = useState(''); //テキストボックスの大きさを自動調整するため
  const [activeTab, setActiveTab] = useState('all'); //タイムラインに表示する投稿主の設定（すべての投稿orフォロー中）
  const [posts,setPosts] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const onPostCreated = (newPost) => {
    setPosts(prevPosts =>  [newPost, ...prevPosts]);
  };

  useEffect(() => {
    fetchTimeline();
  },[]);

  //ローディング状態とエラー状態を管理
  const fetchTimeline = async (tab = 'all') => {
    try {
      setLoading(true);
      let timelineData;
      if (tab === 'all') {
        timelineData = await getAllPosts();
      } else if (tab === 'following') {
        timelineData = await getFollowingTimeline();
      }
      setPosts(timelineData);

    } catch (err) {
      setError("タイムラインの取得に失敗しました。後でもう一度お試しください。");
      console.error("タイムライン取得エラー:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline(activeTab);
  }, [activeTab]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar}/>
      <div className="flex pt-16">
        <Sideber darkMode={darkMode} sidebarOpen={sidebarOpen}/>
        {/* メインコンテンツ */}
        <main className="flex-1 md:ml-64 px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto py-6">
            <div className="space-y-6">
              <PostForm darkMode={darkMode} postContent={postContent} setPostContent={setPostContent} onPostCreated={onPostCreated} />
              <PostTabs activeTab={activeTab} setActiveTab={setActiveTab} />
              {loading ? (
                <p>ロード中...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                posts.map((post) => (
                  <Post key={post._id} darkMode ={darkMode} post={post}/>
                ))
              )}
            </div>
          </div>
        </main>

        {/* サイドバー（右） */}
        <aside className="hidden lg:block w-64 p-6 overflow-y-auto">
          <UserProgress darkMode={darkMode}/>
          <RecommendedChallenges darkMode={darkMode}/>
          <QuickStats darkMode={darkMode}/>
        </aside>
      </div>
      <Footer darkMode={darkMode}/>
    </div>
  );
}