import React from "react";

function Footer({darkMode}) {
  return (
    <footer className={`py-4 mt-8 ${darkMode ? "bg-gray-800" : "bg-gray-200"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm">
          © 2023 SelfBoost. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
