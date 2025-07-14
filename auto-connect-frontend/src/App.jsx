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

              <Route
                path="/sub2"
                element={
                  <ProtectedRoute>
                    <Dashboard>
                      <AdaptivePaginatableTable
                        title={"Tenants"}
                        subtitle={"List of all tenants"}
                        headers={[
                          {
                            colKey: "id",
                            icon: "person",
                            label: "ID",
                            visible: true,
                            container: (value) => (
                              <span
                                style={{
                                  padding: "4px 12px",
                                  borderRadius: "8px",
                                  backgroundColor:
                                    value === "user0001"
                                      ? "#e0f7e9"
                                      : "#fdecea",
                                  color:
                                    value === "user0001"
                                      ? "#2e7d32"
                                      : "#c62828",
                                  fontWeight: "bold",
                                }}
                              >
                                {value}
                              </span>
                            ),
                          },
                          {
                            colKey: "name",
                            icon: "person",
                            label: "Name",
                            visible: true,
                          },
                          {
                            colKey: "email",
                            icon: "email",
                            label: "Email",
                            visible: true,
                          },
                          {
                            colKey: "address",
                            icon: "location_on",
                            label: "Address",
                            visible: true,
                          },
                          {
                            colKey: "phone",
                            icon: "phone",
                            label: "Phone",
                            visible: true,
                          },
                          {
                            colKey: "status",
                            icon: "check_circle",
                            label: "Status",
                          },
                          {
                            colKey: "created_at",
                            icon: "calendar_today",
                            label: "Created At",
                          },
                          {
                            colKey: "updated_at",
                            icon: "update",
                            label: "Updated At",
                          },
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
                            <IconButton
                              icona="edit"
                              c="blue"
                              size={30}
                              onClick={() => handleEdit(row)}
                            />,
                            <IconButton
                              icona="delete"
                              c="red"
                              size={30}
                              onClick={() => handleDelete(row.id)}
                            />,
                          ],
                        }}
                        fetchData={fetchData}
                        serverPageSize={10}
                      />

                      <AdaptiveTable
                        title={"Tenants"}
                        subtitle={"List of all tenants"}
                        headers={[
                          {
                            colKey: "id",
                            icon: "person",
                            label: "ID",
                            visible: true,
                            container: (value) => (
                              <span
                                style={{
                                  padding: "4px 12px",
                                  borderRadius: "8px",
                                  backgroundColor:
                                    value === "user0001"
                                      ? "#e0f7e9"
                                      : "#fdecea",
                                  color:
                                    value === "user0001"
                                      ? "#2e7d32"
                                      : "#c62828",
                                  fontWeight: "bold",
                                }}
                              >
                                {value}
                              </span>
                            ),
                          },
                          {
                            colKey: "name",
                            icon: "person",
                            label: "Name",
                            visible: true,
                          },
                          {
                            colKey: "email",
                            icon: "email",
                            label: "Email",
                            visible: true,
                          },
                          {
                            colKey: "address",
                            icon: "location_on",
                            label: "Address",
                            visible: true,
                          },
                          {
                            colKey: "phone",
                            icon: "phone",
                            label: "Phone",
                            visible: true,
                          },
                          {
                            colKey: "status",
                            icon: "check_circle",
                            label: "Status",
                          },
                          {
                            colKey: "created_at",
                            icon: "calendar_today",
                            label: "Created At",
                          },
                          {
                            colKey: "updated_at",
                            icon: "update",
                            label: "Updated At",
                          },
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
                            <IconButton
                              icona="edit"
                              c="blue"
                              size={30}
                              onClick={() => handleEdit(row)}
                            />,
                            <IconButton
                              icona="delete"
                              c="red"
                              size={30}
                              onClick={() => handleDelete(row.id)}
                            />,
                          ],
                        }}
                        data={[
                          {
                            id: "user0001",
                            name: "John Doe",
                            email: "a@b.c",
                            address: "123 Main St",
                            phone: "123-456-7890",
                            status: "Active",
                            created_at: "2023-01-01",
                            updated_at: "2023-01-02",
                          },
                          {
                            id: "user0002",
                            name: "Jane Doe",
                            email: "b@c.d",
                            address: "456 Elm St",
                            phone: "234-567-8901",
                            status: "Inactive",
                            created_at: "2023-01-03",
                            updated_at: "2023-01-04",
                          },
                          {
                            id: "user0003",
                            name: "Alice Smith",
                            email: "c@d.e",
                            address: "789 Oak St",
                            phone: "345-678-9012",
                            status: "Active",
                            created_at: "2023-01-05",
                            updated_at: "2023-01-06",
                          },
                          {
                            id: "user0004",
                            name: "Bob Johnson",
                            email: "d@e.f",
                            address: "321 Pine St",
                            phone: "456-789-0123",
                            status: "Inactive",
                            created_at: "2023-01-07",
                            updated_at: "2023-01-08",
                          },
                          {
                            id: "user0005",
                            name: "Charlie Brown",
                            email: "e@f.g",
                            address: "654 Maple St",
                            phone: "567-890-1234",
                            status: "Active",
                            created_at: "2023-01-09",
                            updated_at: "2023-01-10",
                          },
                          {
                            id: "user0006",
                            name: "David Wilson",
                            email: "f@g.h",
                            address: "987 Cedar St",
                            phone: "678-901-2345",
                            status: "Inactive",
                            created_at: "2023-01-11",
                            updated_at: "2023-01-12",
                          },
                          {
                            id: "user0007",
                            name: "Eve Davis",
                            email: "g@h.i",
                            address: "123 Birch St",
                            phone: "789-012-3456",
                            status: "Active",
                            created_at: "2023-01-13",
                            updated_at: "2023-01-14",
                          },
                          {
                            id: "user0008",
                            name: "Frank Miller",
                            email: "h@i.j",
                            address: "456 Spruce St",
                            phone: "890-123-4567",
                            status: "Inactive",
                            created_at: "2023-01-15",
                            updated_at: "2023-01-16",
                          },
                          {
                            id: "user0009",
                            name: "Grace Lee",
                            email: "i@j.k",
                            address: "789 Fir St",
                            phone: "901-234-5678",
                            status: "Active",
                            created_at: "2023-01-17",
                            updated_at: "2023-01-18",
                          },
                          {
                            id: "user0010",
                            name: "Hank Taylor",
                            email: "j@k.l",
                            address: "321 Willow St",
                            phone: "012-345-6789",
                            status: "Inactive",
                            created_at: "2023-01-19",
                            updated_at: "2023-01-20",
                          },
                        ]}
                        serverPageSize={10}
                      />

                      <AdaptiveSubTable
                        title={"Tenants"}
                        subtitle={"List of all tenants"}
                        headers={[
                          { colKey: "id", icon: "person", label: "ID" },
                          { colKey: "name", icon: "person", label: "Name" },
                          { colKey: "email", icon: "email", label: "Email" },
                        ]}
                        isSettingsBtn={true}
                        isExportBtn={true}
                        isAddBtn={true}
                        isCollapsible={true}
                        actions={{
                          enable: true,
                          actionHeaderLabel: "Actions",
                          actionHeaderIcon: "settings",
                          dataContainerClass: "horizontal-container flex-end",
                          actions: [
                            <IconButton icona="add" c="green" size={30} />,
                            <IconButton icona="edit" c="blue" size={30} />,
                            <IconButton icona="delete" c="red" size={30} />,
                          ],
                          subActions: [
                            <IconButton icona="edit" c="blue" size={30} />,
                            <IconButton icona="delete" c="red" size={30} />,
                          ],
                        }}
                        data={[
                          {
                            id: "user0001",
                            name: "John Doe",
                            email: "ssai",
                            subdata: [
                              { id: "", name: "John Doe", email: "ssai" },
                              { id: "", name: "John Doe1", email: "ssai" },
                              { id: "", name: "John Doe2", email: "ssai" },
                            ],
                          },
                          {
                            id: "user0002",
                            name: "Jane Doe",
                            email: "asfaw",
                            subdata: [
                              { id: "", name: "John Doe", email: "ssai" },
                              { id: "", name: "John Doe1", email: "ssai" },
                              { id: "", name: "John Doe2", email: "ssai" },
                            ],
                          },
                          { id: "user0001", name: "John Doe", email: "ssai" },
                          {
                            id: "user0002",
                            name: "Jane Doe",
                            email: "asfaw",
                            subdata: [
                              { id: "", name: "John Doe", email: "ssai" },
                              { id: "", name: "John Doe1", email: "ssai" },
                            ],
                          },
                          { id: "user0001", name: "John Doe", email: "ssai" },
                          { id: "user0002", name: "Jane Doe", email: "asfaw" },
                        ]}
                      />
                    </Dashboard>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/tab"
                element={
                  <ProtectedRoute>
                    <Dashboard>
                      <AdaptiveSubTable
                        title={"Tenants"}
                        subtitle={"List of all tenants"}
                        headers={[
                          { colKey: "id", icon: "person", label: "ID" },
                          { colKey: "name", icon: "person", label: "Name" },
                          { colKey: "email", icon: "email", label: "Email" },
                          { colKey: "id", icon: "person", label: "ID" },
                          { colKey: "name", icon: "person", label: "Name" },
                          { colKey: "email", icon: "email", label: "Email" },
                          { colKey: "id", icon: "person", label: "ID" },
                          { colKey: "name", icon: "person", label: "Name" },
                          { colKey: "email", icon: "email", label: "Email" },
                          { colKey: "id", icon: "person", label: "ID" },
                          { colKey: "name", icon: "person", label: "Name" },
                        ]}
                        actions={{
                          enable: true,
                          actionHeaderLabel: "Actions",
                          actionHeaderIcon: "settings",
                          dataContainerClass: "horizontal-container flex-end",
                          actions: [
                            <IconButton icona="add" c="green" size={30} />,
                            <IconButton icona="edit" c="blue" size={30} />,
                            <IconButton icona="delete" c="red" size={30} />,
                          ],
                          subActions: [
                            <IconButton icona="edit" c="blue" size={30} />,
                            <IconButton icona="delete" c="red" size={30} />,
                          ],
                        }}
                        data={[
                          {
                            id: "user0001",
                            name: "John Doe",
                            email: "ssai",
                            subdata: [
                              { id: "", name: "John Doe", email: "ssai" },
                              { id: "", name: "John Doe1", email: "ssai" },
                              { id: "", name: "John Doe2", email: "ssai" },
                            ],
                          },
                          {
                            id: "user0002",
                            name: "Jane Doe",
                            email: "asfaw",
                            subdata: [
                              { id: "", name: "John Doe", email: "ssai" },
                              { id: "", name: "John Doe1", email: "ssai" },
                              { id: "", name: "John Doe2", email: "ssai" },
                            ],
                          },
                          { id: "user0001", name: "John Doe", email: "ssai" },
                          {
                            id: "user0002",
                            name: "Jane Doe",
                            email: "asfaw",
                            subdata: [
                              { id: "", name: "John Doe", email: "ssai" },
                              { id: "", name: "John Doe1", email: "ssai" },
                            ],
                          },
                          { id: "user0001", name: "John Doe", email: "ssai" },
                          { id: "user0002", name: "Jane Doe", email: "asfaw" },
                        ]}
                      />
                    </Dashboard>
                  </ProtectedRoute>
                }
              />

              {/* Fallback routes */}
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
          </div>
        </BrowserRouter>
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App;
