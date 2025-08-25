import { Home, ChevronRight } from 'lucide-react';
import React from 'react'

const Breadcrumbs = () => {
  const breadcrumbs = [
    { name: "Home", icon: Home },
    { name: "Documents" },
    { name: "Projects" },
  ];

  
  return (
    <>
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.name}>
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              {crumb.icon && <crumb.icon className="w-4 h-4" />}
              {crumb.name}
            </button>
            {index < breadcrumbs.length - 1 && (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
}

export default Breadcrumbs