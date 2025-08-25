import { motion } from "framer-motion";
import { X, Calendar, User, HardDrive, File } from "lucide-react";
import React from "react";

const RightSidebar = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <>
      <motion.div
        className={`${
          isOpen ? "w-80" : "w-0"
        } bg-white border-l border-gray-200 transition-all duration-300 overflow-hidden flex-shrink-0`}
        initial={false}
        animate={{ width: isOpen ? 320 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-80 h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">File Details</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
              <File className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">
              Select a file to view details
            </p>
          </div>

          {/* Placeholder sections */}
          <div className="p-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Properties
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Modified today</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>You</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <HardDrive className="w-4 h-4" />
                  <span>1.2 MB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default RightSidebar;
