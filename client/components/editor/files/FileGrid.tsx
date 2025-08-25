import React from 'react'
import EmptyState from './EmptyState';

const FileGrid = () => {
    const hasFiles = false;

    if (!hasFiles) {
      return <EmptyState />;
    }

    return (
      <>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* This would render FileCard and FolderTile components when we have data */}
          </div>
        </div>
      </>
    );
}

export default FileGrid