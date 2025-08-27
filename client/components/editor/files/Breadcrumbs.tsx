import { RootState } from "@/lib/store";
import { Home, ChevronRight, LucideIcon } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { navigateToBreadcrumb } from "@/lib/slices/breadcrumbSlice";
import { setCurrentFolderId } from "@/lib/slices/currentFolderIdSlice";
const Breadcrumbs = () => {
  const breadcrumbs = useSelector((state: RootState) => state.breadCrumb.items);
  const dispatch = useDispatch();
  const handelnavigateToBreadcrumb = (index: number , folderId: string | null ) => {
    dispatch(navigateToBreadcrumb(index));
    dispatch(setCurrentFolderId(folderId));
    

  };
  const iconMap: Record<string, LucideIcon> = {
    Home,
  };

  return (
    <nav className="bg-white border-b border-gray-100" aria-label="Breadcrumb">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 py-3 min-h-[52px]">
          {breadcrumbs.map((crumb, index) => {
            const Icon = crumb.icon ? iconMap[crumb.icon] : null;
            return (
              <li key={crumb.name} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-300 mr-2 flex-shrink-0" />
                )}
                <button
                  className={`
                  flex items-center gap-1.5 text-sm font-medium transition-colors duration-150 ease-in-out
                  hover:bg-gray-50 rounded-md px-2 py-1.5 -mx-2 -my-1.5
                  ${
                    index === breadcrumbs.length - 1
                      ? "text-gray-900 cursor-default"
                      : "text-gray-600 hover:text-gray-900"
                  }
                `}
                  onClick={() => handelnavigateToBreadcrumb(index, crumb.id)}
                  disabled={index === breadcrumbs.length - 1}
                  aria-current={
                    index === breadcrumbs.length - 1 ? "page" : undefined
                  }
                >
                  {Icon && (
                    <Icon
                      className={`
                    w-4 h-4 flex-shrink-0
                    ${
                      index === breadcrumbs.length - 1
                        ? "text-gray-700"
                        : "text-gray-500"
                    }
                  `}
                    />
                  )}
                  <span className="truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
                    {crumb.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
