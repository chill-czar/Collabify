"use client";

import React, { useState } from "react";
import { Search, Plus, Settings, User } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";

const Header = () => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <header className="w-full bg-white border-b border-gray-200 px-3 py-2 sm:px-4 sm:py-3 max-h-15 flex-shrink-0 sticky top-0">
      <div className="flex items-center justify-between mx-auto">
        {/* Search Bar */}
        <div className="flex-1 max-w-xs sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search projects, files, or rooms..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-1 sm:space-x-3 ml-3 sm:ml-6">
          {/* Create Button */}
          <button className="flex items-center space-x-2 bg-black text-white px-3 py-2 sm:px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors duration-200">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create</span>
          </button>

          {/* Settings Icon */}
          <button className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Profile Avatar */}
          <button className="relative">
            <div className="w-7 h-7 sm:w-8 sm:h-8  rounded-full flex items-center justify-center hover:shadow-md transition-shadow duration-200">
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
