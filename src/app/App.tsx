import { Suspense } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ErrorBoundary } from '@/shared/components/ui/ErrorBoundary';
import { ToastProvider } from '@/shared/components/ui/Toast';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { AppLayout } from '@/shared/layout/AppLayout';
import { ProtectedRoute } from '@/shared/layout/ProtectedRoute';
import { Spinner } from '@/shared/components/ui/Spinner';
import { useInit } from '@/shared/hooks/useInit';
import routesConfig from './routes';

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Spinner size="lg" />
    </div>
  );
}

function renderRoutes(routes: typeof routesConfig) {
  return routes.map((route) => {
    if (route.children) {
      return (
        <Route key={route.path} path={route.path} element={route.element}>
          {renderRoutes(route.children)}
        </Route>
      );
    }

    const element = (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          {route.element}
        </Suspense>
      </ErrorBoundary>
    );

    if (!route.isProtected) {
      return <Route key={route.path} path={route.path} element={element} />;
    }

    return (
      <Route
        key={route.path}
        path={route.path}
        element={
          <ProtectedRoute>
            <AppLayout>{element}</AppLayout>
          </ProtectedRoute>
        }
      />
    );
  });
}

export default function App() {
  const ready = useInit();

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider />
        <Router>
          <Routes>{renderRoutes(routesConfig)}</Routes>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
