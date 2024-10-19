import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import CreateChallengeModal from '../components/CreateChallengeModal';
import ChallengeList from '../components/ChallengeList';
import ProgressUpdateModal from '../components/ProgressUpdateModal';
import { getChallenges, getMyChallenges, joinChallenge, updateProgress } from '../api/challengeApi';
import { useUser } from '../contexts/UserContext';
import { DarkModeContext } from '../contexts/DarkModeContext';


function ChallengePage() {
  const currentUser = useUser();
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('my');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    fetchChallenges(activeTab);
  }, [activeTab]);

  const handleJoinChallenge = async (challengeId) => {
    try {
      await joinChallenge(challengeId);
      // 成功後、チャレンジリストを更新
      await fetchChallenges(activeTab);
      // オプション: 成功メッセージを表示
      alert("チャレンジに参加しました！");
    } catch (error) {
      console.error('Challenge join failed:', error);
      // エラーメッセージを表示
      alert("チャレンジへの参加に失敗しました。もう一度お試しください。");
    }
  };

  const handleCreateSuccess = async (newChallenge) => {
    setIsCreateModalOpen(false);
    // チャレンジリストを更新
    await fetchChallenges(activeTab);
    // オプション: 成功メッセージを表示
    alert("新しいチャレンジが作成されました！");
  };
  

  const fetchChallenges = async (tab = 'my') => {
    try {
      setLoading(true);
      setError(null);
      let challengeData;
      if (tab === 'my') {
        challengeData = await getMyChallenges();
      } else if (tab === 'public') {
        challengeData = await getChallenges();
      }
      setChallenges(challengeData);
    } catch (err) {
      setError("チャレンジの取得に失敗しました。後でもう一度お試しください。");
      console.error("チャレンジ取得エラー:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = (challenge) => {
    setSelectedChallenge(challenge);
    setIsProgressModalOpen(true);
  };

  const handleProgressUpdate = async (challengeId, newProgress) => {
    try {
      console.log(challengeId, newProgress);
      await updateProgress(challengeId, { progress: newProgress });
      // 成功後、チャレンジリストを更新
      await fetchChallenges(activeTab);
      setIsProgressModalOpen(false);
    } catch (error) {
      console.error('Progress update failed:', error);
      throw error;
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} toggleSidebar={toggleSidebar} />
      
      <div className="flex pt-16">
        <Sidebar darkMode={darkMode} sidebarOpen={sidebarOpen} />
        
        <main className="flex-1 md:ml-64 px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">チャレンジ</h1>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className={`px-4 py-2 rounded-md ${
                  darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                新規チャレンジ作成
              </button>
            </div>
            
            {loading ? (
              <p>チャレンジを読み込んでいます...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <ChallengeList 
                darkMode={darkMode}
                challenges={challenges}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onUpdateProgress={handleUpdateProgress}
                onJoinChallenge={handleJoinChallenge}
                currentUserId={currentUser.user._id} // 実際のユーザーIDに置き換えてください
              />
            )}
          </div>
        </main>
      </div>
      
      <Footer darkMode={darkMode} />
      
      {isCreateModalOpen && (
        <CreateChallengeModal
          darkMode={darkMode}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateSuccess={handleCreateSuccess}
        />
      )}
      
      {isProgressModalOpen && selectedChallenge && (
        <ProgressUpdateModal
          challenge={selectedChallenge}
          darkMode={darkMode}
          onClose={() => {
            setIsProgressModalOpen(false);
            setSelectedChallenge(null);
          }}
          onUpdateSuccess={handleProgressUpdate}
        />
      )}
    </div>
  );
}

export default ChallengePage;
