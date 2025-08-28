"use client";

import React, { useState } from "react";
import { Search, Plus, Settings } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { useAppSelector } from "@/lib/slices/headerSlice"; // your Redux typed selector
import { RootState } from "@/lib/store"; // adjust path to your store
import { useSelector } from "react-redux";

const Header = () => {
  const [searchValue, setSearchValue] = useState("");
  const isVisible = useSelector((state: RootState) => state.headerSlice.visible);

  if (!isVisible) return null; // hide header when slice sets visible = false

  return (
    <header className="w-full bg-white border-b border-gray-200 px-3 py-2 sm:px-4 sm:py-3 sticky top-0 z-50 max-h-15 ">
      <div className="flex items-center justify-between mx-auto">
        {/* Search Bar */}
        <div className="flex-1 max-w-xs sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search projects, files, or rooms..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-1 sm:space-x-3 ml-3 sm:ml-6">
          {/* Create Button */}
          <Button className="flex items-center space-x-2 bg-black text-white hover:bg-gray-800">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create</span>
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:text-gray-900"
          >
            <Settings className="w-5 h-5" />
          </Button>

          {/* Profile */}
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-7 h-7 sm:w-8 sm:h-8",
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Header;
