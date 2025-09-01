// components/whiteboard/Editor.tsx
"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Brush } from "lucide-react";

export const EmptyCanvas: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 m-4 flex items-center justify-center bg-gray-50 overflow-hidden">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <Brush className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Whiteboard</h3>
            <p className="text-sm text-gray-500 max-w-xs">
              Whiteboard all u need to darw , imagine.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
