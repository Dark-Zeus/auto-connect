import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Existing Components
import { UserContext } from "@contexts/UserContext";

import LandingPage from "@pages/LandingPage";
import AuthPage from "@pages/AuthPage";
import LoginForm from "@components/LoginForm";
import RegisterForm from "@components/RegisterForm";
import Dashboard from "@pages/Dashboard";

// ==================== DEVELOPMENT IMPORTS - REMOVE IN PRODUCTION ====================

// Create Material-UI theme with our color scheme
const theme = createTheme({
  palette: {
    primary: {
      light: "#DFF2EB",
      main: "#7AB2D3",
      dark: "#4A628A",
      contrastText: "#ffffff",
    },
    secondary: {
      light: "#B9E5E8",
      main: "#7AB2D3",
      dark: "#4A628A",
      contrastText: "#ffffff",
    },
    background: {
      default: "#DFF2EB",
      paper: "#ffffff",
    },
    text: {
      primary: "#2c3e50",
      secondary: "#6c757d",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "8px 24px",
          fontSize: "1rem",
          fontWeight: 500,
          textTransform: "none",
          boxShadow: "0 2px 8px rgba(74, 98, 138, 0.15)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 4px 16px rgba(74, 98, 138, 0.25)",
          },
        },
        contained: {
          background: "linear-gradient(45deg, #7AB2D3, #4A628A)",
          "&:hover": {
            background: "linear-gradient(45deg, #4A628A, #7AB2D3)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            "& fieldset": { borderColor: "#B9E5E8" },
            "&:hover fieldset": { borderColor: "#7AB2D3" },
            "&.Mui-focused fieldset": { borderColor: "#4A628A" },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(74, 98, 138, 0.12)",
        },
      },
    },
  },
});



function App() {
  const [userContext, setUserContext] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (storedUser && token) {
          setUserContext(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (isCheckingAuth) {
      return (
        <div
          className="loading-screen"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            background:
              "linear-gradient(135deg, #DFF2EB 0%, #B9E5E8 50%, #7AB2D3 100%)",
            fontSize: "1.125rem",
            color: "#4A628A",
          }}
        >
          Loading...
        </div>
      );
    }
    if (!userContext) {
      return <Navigate to="/auth/login" replace />;
    }
    return children;
  };

  // Public Route Component (redirect if already authenticated)
  const PublicRoute = ({ children }) => {
    if (isCheckingAuth) {
      return (
        <div
          className="loading-screen"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            background:
              "linear-gradient(135deg, #DFF2EB 0%, #B9E5E8 50%, #7AB2D3 100%)",
            fontSize: "1.125rem",
            color: "#4A628A",
          }}
        >
          Loading...
        </div>
      );
    }
    if (userContext) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserContext.Provider value={{ userContext, setUserContext }}>
        <BrowserRouter>
          <Routes>
            {/* Landing Page */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <LandingPage />
                </PublicRoute>
              }
            />

            {/* Authentication Routes */}
            <Route
              path="/auth/*"
              element={
                <PublicRoute>
                  <Routes>
                    <Route
                      path="/"
                      element={<Navigate to="/auth/login" replace />}
                    />
                    <Route
                      path=""
                      element={
                        <AuthPage>
                          <LoginForm />
                        </AuthPage>
                      }
                    />
                    <Route
                      path="/login"
                      element={
                        <AuthPage>
                          <LoginForm />
                        </AuthPage>
                      }
                    />
                    <Route
                      path="/register"
                      element={
                        <AuthPage>
                          <RegisterForm />
                        </AuthPage>
                      }
                    />
                    <Route
                      path="/forgot-password"
                      element={
                        <AuthPage>
                          <div
                            style={{ textAlign: "center", padding: "2rem" }}
                          >
                            <h2>Forgot Password</h2>
                            <p>This feature is coming soon!</p>
                          </div>
                        </AuthPage>
                      }
                    />
                    <Route
                      path="/verify"
                      element={
                        <AuthPage>
                          <div
                            style={{ textAlign: "center", padding: "2rem" }}
                          >
                            <h2>Email Verification</h2>
                            <p>
                              Please check your email for verification
                              instructions.
                            </p>
                          </div>
                        </AuthPage>
                      }
                    />
                  </Routes>
                </PublicRoute>
              }
            />


            {/* Protected Dashboard Routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
          {/* Toast Container for notifications */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            toastStyle={{
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(74, 98, 138, 0.15)",
            }}
          />
        </BrowserRouter>
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App;