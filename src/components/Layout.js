import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full">
        <div className="flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;