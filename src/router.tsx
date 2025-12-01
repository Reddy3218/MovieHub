import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface RouterContextType {
  currentPath: string;
  navigate: (path: string) => void;
  params: Record<string, string>;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within RouterProvider');
  }
  return context;
};

interface RouterProviderProps {
  children: ReactNode;
}

export const RouterProvider = ({ children }: RouterProviderProps) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [params, setParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  useEffect(() => {
    const pathParts = currentPath.split('/').filter(Boolean);
    const newParams: Record<string, string> = {};

    if (pathParts[0] === 'movie' && pathParts[1]) {
      newParams.id = pathParts[1];
    }

    setParams(newParams);
  }, [currentPath]);

  return (
    <RouterContext.Provider value={{ currentPath, navigate, params }}>
      {children}
    </RouterContext.Provider>
  );
};

interface RouteProps {
  path: string;
  component: React.ComponentType;
}

export const Route = ({ path, component: Component }: RouteProps) => {
  const { currentPath } = useRouter();

  if (path === currentPath) {
    return <Component />;
  }

  if (path.includes(':id')) {
    const basePath = path.split(':')[0];
    if (currentPath.startsWith(basePath)) {
      return <Component />;
    }
  }

  return null;
};

interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}

export const Link = ({ to, children, className = '' }: LinkProps) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};
