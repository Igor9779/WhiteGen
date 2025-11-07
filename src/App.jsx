import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthPage from "./components/Auth/AuthPage";
import RegisterPage from "./components/Auth/RegisterPage";
import GeneratorPage from "./pages/GeneratorPage";
import Instructions from "./pages/Instructions";
import ApiKeysPage from "./pages/ApiKeysPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmPage from "./components/Auth/ConfirmPage";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import PublicRoute from "./components/Auth/PublicRoute";
import ResetPasswordPage from "./components/Auth/ResetPasswordPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔹 Публічні сторінки (доступні тільки неавторизованим) */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route path="/confirm" element={<ConfirmPage />} />
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPasswordPage />
            </PublicRoute>
          }
        />

        {/* 🔹 Захищені сторінки — тільки для залогінених */}
        <Route
          path="/generator"
          element={
            <ProtectedRoute>
              <GeneratorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructions"
          element={
            <ProtectedRoute>
              <Instructions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/apikeys"
          element={
            <ProtectedRoute>
              <ApiKeysPage />
            </ProtectedRoute>
          }
        />

        {/* 🔹 Будь-який інший шлях — редірект */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* 🔔 Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </Router>
  );
}

export default App;
