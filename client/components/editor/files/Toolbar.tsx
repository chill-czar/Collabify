import { Upload, FolderPlus, Grid3X3, List, MoreVertical } from 'lucide-react';
import React from 'react'

const Toolbar = () => {
    return (
      <>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-900">Files</h1>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Upload className="w-4 h-4" />
                Upload
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <FolderPlus className="w-4 h-4" />
                New Folder
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button className="p-2 hover:bg-gray-50 transition-colors">
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-gray-50 transition-colors border-l border-gray-300">
                <List className="w-4 h-4" />
              </button>
            </div>
            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </>
    );
}

export default Toolbar