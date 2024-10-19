import React, { useContext } from "react";
import { MoonIcon, SunIcon, UserCircleIcon, Bars3Icon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { DarkModeContext } from "../contexts/DarkModeContext";

function Header({ toggleSidebar }) {
  const { user } = useUser();
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

  return (
    <header
      className={`py-4 px-4 md:px-6 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      } shadow-md fixed top-0 left-0 right-0 z-20`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <button
            className="mr-2 md:hidden"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <Link to="/" className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold">SelfBoost</h1>
          </Link>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <Link
            to={`/profile/${user?._id}`}
            className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <span className="text-sm truncate max-w-[100px] md:max-w-[150px]">
              {user?.username}
            </span>
            <UserCircleIcon className="h-6 w-6 flex-shrink-0" />
          </Link>
          <button
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <SunIcon className="h-6 w-6" />
            ) : (
              <MoonIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
