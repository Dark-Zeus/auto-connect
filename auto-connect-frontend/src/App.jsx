import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Existing Components (preserve your imports)
import IconButton from "@components/atoms/IconButton";
import Dashboard from "@pages/Dashboard";
import AuthPage from "@pages/AuthPage";
import LoginForm from "@components/LoginForm";
import { UserContext } from "@contexts/UserContext";

import AdaptiveSubTable from "@components/atoms/AdaptiveSubTable";
import Confirm from "@components/atoms/Confirm";
import AdaptiveTable from "@components/atoms/AdaptiveTable";
import AdaptivePaginatableTable from "@components/atoms/AdaptivePaginatableTable";

// New Components
import LandingPage from "./pages/LandingPage";
import RegisterForm from "./components/RegisterForm";

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
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
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
            "& fieldset": {
              borderColor: "#B9E5E8",
            },
            "&:hover fieldset": {
              borderColor: "#7AB2D3",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#4A628A",
            },
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
    // Preserve your existing logic but uncomment auth checking
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (storedUser && token) {
          setUserContext(JSON.parse(storedUser));
        } else {
          // Fallback to your existing default for testing
          // setUserContext({ role: "administrator" });
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

  // Preserve your existing handlers
  const handleEdit = (row) => {
    console.log("Edit action for row:", row);
    // Implement edit logic here, e.g., open a modal with a form
  };

  const handleDelete = (id) => {
    console.log("Delete action for ID:", id);
    // Implement delete logic here, e.g., show a confirmation dialog
    Confirm({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this item?",
      onConfirm: () => {
        console.log("Item deleted");
        // Perform deletion logic here
      },
      onCancel: () => {
        console.log("Deletion cancelled");
      },
    });
  };

  const fetchData = async (page) => {
    const data = [
      { id: "user0001", name: "John Doe", email: "a@b.c" },
      { id: "user0002", name: "Jane Doe", email: "b@c.d" },
      { id: "user0003", name: "Alice Smith", email: "c@d.e" },
      { id: "user0004", name: "Bob Johnson", email: "d@e.f" },
      { id: "user0005", name: "Charlie Brown", email: "e@f.g" },
      { id: "user0006", name: "David Wilson", email: "f@g.h" },
      { id: "user0007", name: "Eve Davis", email: "g@h.i" },
      { id: "user0008", name: "Frank Miller", email: "h@i.j" },
      { id: "user0009", name: "Grace Lee", email: "i@j.k" },
      { id: "user0010", name: "Hank Taylor", email: "j@k.l" },
      { id: "user0011", name: "Ivy Anderson", email: "k@l.m" },
      { id: "user0012", name: "Jack Thomas", email: "l@m.n" },
      { id: "user0013", name: "Kathy Jackson", email: "m@n.o" },
      { id: "user0014", name: "Leo White", email: "n@o.p" },
      { id: "user0015", name: "Mia Harris", email: "o@p.q" },
      { id: "user0016", name: "Noah Martin", email: "p@q.r" },
      { id: "user0017", name: "Olivia Thompson", email: "q@r.s" },
      { id: "user0018", name: "Paul Garcia", email: "r@s.t" },
      { id: "user0019", name: "Quinn Martinez", email: "s@t.u" },
      { id: "user0020", name: "Rita Robinson", email: "t@u.v" },
    ];

    // Simulate fetching data from an API with pagination
    return new Promise((resolve) => {
      setTimeout(() => {
        const pageSize = 10; // Number of items per page
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = data.slice(startIndex, endIndex);
        resolve({
          data: paginatedData,
          totalRecords: data.length,
        });
      }, 1000); // Reduced delay for better UX
    });
  };

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
          <div className="app">
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

              {/* Protected Dashboard Routes - preserve all your existing routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

          <Route path="/*" element={
            <Dashboard/>
          } />
          

          <Route path="/sub2" element={<Dashboard>
            <AdaptivePaginatableTable
              title={"Tenants"}
              subtitle={"List of all tenants"}
              headers={[
                {
                  colKey: "id", icon: "person", label: "ID", visible: true,
                  container: (value) => (
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "8px",
                        backgroundColor: value === "user0001" ? "#e0f7e9" : "#fdecea",
                        color: value === "user0001" ? "#2e7d32" : "#c62828",
                        fontWeight: "bold",
                      }}
                    >
                      {value}
                    </span>)
                },
                { colKey: "name", icon: "person", label: "Name", visible: true },
                { colKey: "email", icon: "email", label: "Email", visible: true },
                { colKey: "address", icon: "location_on", label: "Address", visible: true },
                { colKey: "phone", icon: "phone", label: "Phone", visible: true },
                { colKey: "status", icon: "check_circle", label: "Status" },
                { colKey: "created_at", icon: "calendar_today", label: "Created At" },
                { colKey: "updated_at", icon: "update", label: "Updated At" },
              ]}
              isSettingsBtn={true}
              isExportBtn={true}
              isAddBtn={true}
              isCollapsible={false}
              actions={{
                enable: true,
                actionHeaderLabel: "Actions",
                actionHeaderIcon: "settings",
                dataContainerClass: "horizontal-container flex-end",
                getActions: (row) => [
                  <IconButton icona="edit" c="blue" size={30} onClick={() => handleEdit(row)} />,
                  <IconButton icona="delete" c="red" size={30} onClick={() => handleDelete(row.id)} />
                ]
              }}
            />
          </div>
        </BrowserRouter>
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App;
