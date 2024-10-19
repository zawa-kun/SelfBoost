import React from 'react'
import { HomeIcon, UserIcon, CogIcon, ChatBubbleLeftIcon, FlagIcon , ArrowRightOnRectangleIcon} from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/authApi';

function Sidebar({darkMode,sidebarOpen}) {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const currentUserId = user._id;


  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
                <Link to={`/profile/${currentUserId}`}>
                  <button className="w-full flex items-center p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                    <UserIcon className="h-5 w-5 mr-2" />
                    プロフィール
                  </button>
                </Link>
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
              {user && (
              <li>
                <button onClick={handleLogout} className="w-full flex items-center p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                  ログアウト
                </button>
              </li>
            )}
            </ul>
          </nav>
        </aside>
      
    </>
  )
}

export default Sidebar
