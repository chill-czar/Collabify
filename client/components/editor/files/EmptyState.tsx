import { motion } from 'framer-motion';
import { Folder, Upload, FolderPlus } from 'lucide-react';
import React from 'react'

const EmptyState = () => {
    return (
      <>
        <motion.div
          className="flex flex-col items-center justify-center h-full min-h-96 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-24 h-24 bg-gray-200 rounded-2xl mb-6 flex items-center justify-center">
            <Folder className="w-12 h-12 text-gray-400" />
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-2">
            This folder is empty
          </h3>

          <p className="text-sm text-gray-500 text-center mb-6 max-w-sm">
            Upload files or create a new folder to get started
          </p>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Upload className="w-4 h-4" />
              Upload Files
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <FolderPlus className="w-4 h-4" />
              New Folder
            </button>
          </div>
        </motion.div>
      </>
    );
}

export default EmptyState