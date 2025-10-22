import React from 'react';

const Logo = ({ darkMode }) => {
  return (
    <div className="flex items-center">
      <h1 className={`text-2xl font-light tracking-wider ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
        <span className={darkMode ? 'text-purple-300' : 'text-purple-500'}>[ </span>
        <span className={`font-medium bg-gradient-to-r ${darkMode ? 'from-purple-400 to-pink-400' : 'from-purple-600 to-pink-500'} bg-clip-text text-transparent`}>Avora</span>
        <span className={darkMode ? 'text-purple-300' : 'text-purple-500'}> ]</span>
      </h1>
    </div>
  );
};

export default Logo;
