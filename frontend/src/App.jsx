import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "./layouts/Layout";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage"; 
import Produk from "./pages/Produk";
import TransactionHistory from './pages/TransactionHistory';
import CategoriesData from "./pages/CategoriesData";
import SuppliersData from "./pages/SuppliersData";
import CustomersData from "./pages/CustomersData";
import Purchases from "./pages/Purchases";
import Sales from "./pages/Sales"; 
import RolesData from "./pages/RolesData";
import UsersData from "./pages/UsersData";
import LoginPage from "./pages/LoginPage"; 

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root "/" ke login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Halaman Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Semua halaman lain dibungkus PrivateRoute */}
        {[
          { path: "/dashboard", component: <Dashboard /> },
          { path: "/profile", component: <ProfilePage /> }, 
          { path: "/produk", component: <Produk /> },
          { path: "/transaction-history", component: <TransactionHistory /> },
          { path: "/categories", component: <CategoriesData /> },
          { path: "/suppliers", component: <SuppliersData /> },
          { path: "/purchases", component: <Purchases /> }, 
          { path: "/sales", component: <Sales /> }, 
          { path: "/customers", component: <CustomersData /> }, 
          { path: "/roles", component: <RolesData /> },
          { path: "/users", component: <UsersData /> },
        ].map(({ path, component }) => (
          <Route
            key={path}
            path={path}
            element={
              <PrivateRoute>
                <Layout>{component}</Layout>
              </PrivateRoute>
            }
          />
        ))}

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
