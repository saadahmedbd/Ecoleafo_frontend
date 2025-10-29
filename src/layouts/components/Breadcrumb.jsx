
import { Link, useLocation } from 'react-router-dom';
import { useMemo } from 'react';

/**
 * Breadcrumb Navigation Component
 * Automatically generates breadcrumb trail from current route
 * 
 * @returns {React.ReactNode}
 */
export const Breadcrumb = () => {
  const location = useLocation();

  /**
   * Generate breadcrumb items from pathname
   */
  const breadcrumbs = useMemo(() => {
    const paths = location.pathname.split('/').filter(Boolean);
    const items = [{ name: 'Home', path: '/' }];

    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      
      // Format path name (capitalize and remove dashes)
      const name = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      items.push({
        name,
        path: currentPath,
        isLast: index === paths.length - 1,
      });
    });

    return items;
  }, [location.pathname]);

  return (
    <nav className="flex items-center space-x-2 text-sm">
      {breadcrumbs.map((item, index) => (
        <div key={item.path} className="flex items-center">
          {index > 0 && (
            <svg
              className="w-4 h-4 text-gray-400 mx-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
          {item.isLast ? (
            <span className="text-gray-700 font-medium">{item.name}</span>
          ) : (
            <Link
              to={item.path}
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};