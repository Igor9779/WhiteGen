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
import ConfirmPage from "./components/Auth/ConfirmPage";
import ResetPasswordPage from "./components/Auth/ResetPasswordPage";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import ProtectedLayout from "./components/Auth/ProtectedLayout"; // 🔹 новий layout
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔹 Публічні сторінки */}
        <Route path="/" element={<AuthPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/confirm" element={<ConfirmPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* 🔹 Захищена зона (спільний ProtectedLayout) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ProtectedLayout />
            </ProtectedRoute>
          }
        >
          <Route path="generator" element={<GeneratorPage />} />
          <Route path="instructions" element={<Instructions />} />
          <Route path="apikeys" element={<ApiKeysPage />} />
        </Route>

        {/* 🔹 Усі інші шляхи — редірект */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

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
