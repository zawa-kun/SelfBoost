import React from "react";
import {MoonIcon, SunIcon ,UserCircleIcon,HomeIcon,} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

function Header({ darkMode, toggleSidebar, toggleDarkMode }) {
  return (
    <>
      <header
        className={`py-4 px-4 md:px-6 ${
          darkMode ? "bg-gray-800" : "bg-white"
        } shadow-md fixed top-0 left-0 right-0 z-20`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/">
            <button className="md:hidden" onClick={toggleSidebar}>
              <HomeIcon className="h-6 w-6" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold">SelfBoost</h1>
          </Link>
          <div className="flex items-center space-x-2 md:space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <UserCircleIcon className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            <button
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={toggleDarkMode}
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5 md:h-6 md:w-6" />
              ) : (
                <MoonIcon className="h-5 w-5 md:h-6 md:w-6" />
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
