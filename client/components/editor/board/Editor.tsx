// components/whiteboard/Editor.tsx
"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

export const Editor: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 m-4 flex items-center justify-center bg-gray-50 overflow-hidden">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Document Editor</h3>
            <p className="text-sm text-gray-500 max-w-xs">
              BlockNote editor will be integrated here. Rich text editing with
              blocks support.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
