import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search...",
  autoFocus = false,
  onSearchClick
}) => {
  // If onSearchClick is provided, render as clickable search bar
  if (onSearchClick) {
    return (
      <div 
        className="relative cursor-pointer" 
        onClick={onSearchClick}
      >
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <div className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-500 dark:text-gray-400">
          {placeholder}
        </div>
      </div>
    );
  }
  
  // Regular search input for search page
  return (
    <div className="relative">
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
        className="search-input w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-[#09302f] dark:focus:ring-[#4ade80] focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        style={{
          padding: '12px 16px 12px 48px !important'
        }}
      />
    </div>
  );
};

export default SearchBar;