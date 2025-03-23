// src/App.jsx

import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "./app/store";
import { PersistGate } from "redux-persist/integration/react";
import Spinner from "./components/Spinner";
import PrivateRoute from "./components/privateRoute";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy-loaded components
const Home = lazy(() => import("./components/Home"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const DashboardHome = lazy(() => import("./components/DashboardHome"));
const Firms = lazy(() => import("./components/Firms"));
const Team = lazy(() => import("./components/Team"));
const Brands = lazy(() => import("./components/Brands"));
const Products = lazy(() => import("./components/Products"));
const Categories = lazy(() => import("./components/Categories"));
const Purchases = lazy(() => import("./components/Purchases"));
const Sales = lazy(() => import("./components/Sales"));
const Calendar = lazy(() => import("./components/Calendar"));
const Reports = lazy(() => import("./components/Reports"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./components/NotFound"));

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<Spinner />} persistor={persistor}>
        <ErrorBoundary>
          <Suspense fallback={<Spinner />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />

              {/* Protected Dashboard Routes */}
              <Route
                path="/dashboard/*"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              >
                {/* Nested Routes within Dashboard */}
                <Route index element={<DashboardHome />} />
                <Route path="team" element={<Team />} />
                <Route path="firms" element={<Firms />} />
                <Route path="brands" element={<Brands />} />
                <Route path="products" element={<Products />} />
                <Route path="categories" element={<Categories />} />
                <Route path="purchases" element={<Purchases />} />
                <Route path="sales" element={<Sales />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="reports" element={<Reports />} />
                {/* Catch-All Route for Dashboard */}
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Catch-All Route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </PersistGate>
    </Provider>
  );
}

export default App;
