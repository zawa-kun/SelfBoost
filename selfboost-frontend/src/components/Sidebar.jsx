import React from 'react'
import { HomeIcon, UserIcon, CogIcon, ChatBubbleLeftIcon, FlagIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

function Sidebar({darkMode,sidebarOpen}) {
  return (
    <>
    <aside className={`fixed left-0 top-16 bottom-0 w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-transform duration-300 ease-in-out z-10 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link to="/">
                  <button className="w-full flex items-center p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                    <HomeIcon className="h-5 w-5 mr-2" />
                    ホーム
                  </button>
                </Link>
                
              </li>
              <li>
                <button className="w-full flex items-center p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                  <UserIcon className="h-5 w-5 mr-2" />
                  プロフィール
                </button>
              </li>
              <li>
                <Link to="/challenge">
                  <button className="w-full flex items-center p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                    <FlagIcon className="h-5 w-5 mr-2" />
                    チャレンジ
                  </button>
                </Link>
              </li>
              <li>
                <button className="w-full flex items-center p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                  <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
                  メッセージ
                </button>
              </li>
              <li>
                <button className="w-full flex items-center p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                  <CogIcon className="h-5 w-5 mr-2" />
                  設定
                </button>
              </li>
            </ul>
          </nav>
        </aside>
      
    </>
  )
}

export default Sidebar
