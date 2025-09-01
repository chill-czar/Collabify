"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "@excalidraw/excalidraw/index.css";

// Dynamically import Excalidraw components (no SSR)
const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  { ssr: false }
);

const Canvas = ({
  onSaveTrigger,
  fileId,
  fileData,
}: {
  onSaveTrigger: (content: string) => void;
  fileId: any;
  fileData: string;
}) => {
  return (
    <div className="h-full w-full">
      <Excalidraw
        theme="light"
        initialData={fileData ? { elements: JSON.parse(fileData) } : undefined}
        UIOptions={{
          canvasActions: {
            export: false,
            loadScene: false,
            saveAsImage: false,
          },
        }}
        onChange={(elements, appState, files) => {
          onSaveTrigger(JSON.stringify(elements));
        }}
      ></Excalidraw>
    </div>
  );
};

export default Canvas;
