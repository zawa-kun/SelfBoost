import React from 'react';

export const Progress = ({ value, max = 100, className, ...props }) => (
  <div className={`bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 ${className}`} {...props}>
    <div 
      className="bg-blue-600 h-2.5 rounded-full" 
      style={{ width: `${(value / max) * 100}%` }}
    ></div>
  </div>
);