import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import routesConfig from "./routesConfig";

const renderRoutes = (routes) => {
  return routes.map((route) => {
    if (route.children) {
      return (
        <Route key={route.path} path={route.path} element={route.element}>
          {renderRoutes(route.children)}
        </Route>
      );
    } else if (!route.isProtected) {
      return (
        <Route key={route.path} path={route.path} element={route.element} />
      );
    }
    return (
      <Route
        key={route.path}
        path={route.path}
        element={
          <ProtectedRoute>
            <Layout>{route.element}</Layout>
          </ProtectedRoute>
        }
      />
    );
  });
};

function App() {
  return (
    <Router>
      <Routes>{renderRoutes(routesConfig)}</Routes>
    </Router>
  );
}

export default App;
