// components/whiteboard/Canvas.tsx
"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Palette } from "lucide-react";

export const Canvas: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 m-4 flex items-center justify-center bg-gray-50 overflow-hidden">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
            <Palette className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              Whiteboard Canvas
            </h3>
            <p className="text-sm text-gray-500 max-w-xs">
              Interactive whiteboard canvas will be integrated here. Drawing,
              shapes, and collaboration tools.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
