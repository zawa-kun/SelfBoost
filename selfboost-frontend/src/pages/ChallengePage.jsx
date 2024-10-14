import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import CreateChallengeModal from '../components/CreateChallengeModal';
import ChallengeList from '../components/ChallengeList';
import ProgressUpdateModal from '../components/ProgressUpdateModal';

function ChallengePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleUpdateProgress = (challenge) => {
    setSelectedChallenge(challenge);
    setIsProgressModalOpen(true);
  };

  const handleJoinChallenge = (challengeId) => {
    console.log(`チャレンジに参加: チャレンジID ${challengeId}`);
    // ここでチャレンジ参加のロジックを実装します
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
            
            <ChallengeList 
              darkMode={darkMode}
              onUpdateProgress={handleUpdateProgress}
              onJoinChallenge={handleJoinChallenge}
            />
          </div>
        </main>
      </div>
      
      <Footer darkMode={darkMode} />
      
      {isCreateModalOpen && (
        <CreateChallengeModal
          darkMode={darkMode}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateSuccess={() => {
            console.log('新しいチャレンジが作成されました');
            setIsCreateModalOpen(false);
            // ここでチャレンジリストを更新するロジックを実装します
          }}
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
        />
      )}
    </div>
  );
}

export default ChallengePage;
