import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import IconButton from "@components/atoms/IconButton";

//import Dashboard from "@pages/Dashboard";
import AuthPage from "@pages/AuthPage";
import LoginForm from "@components/LoginForm";
import { UserContext } from "@contexts/UserContext";

import AdaptiveSubTable from "@components/atoms/AdaptiveSubTable";
import Confirm from "@components/atoms/Confirm";
import AdaptiveTable from "@components/atoms/AdaptiveTable";
import AdaptivePaginatableTable from "@components/atoms/AdaptivePaginatableTable";
// import VehicleDetails from "@components/CarBuyer/VehicleDetails";
// import VehicleDescriptionBox from "@components/CarBuyer/VehicleDescriptionBox";
// import SecurityTips from "@components/CarBuyer/SecurityTips";
// import ImageViewer from "@components/CarBuyer/ImageViewer";
// import SellVehicleForm from "@components/CarSeller/SellVehicleForm";
// import ListedVehicleCard from "@components/CarBuyer/ListedVehicleCard";
// import MyVehicleCard from "@components/CarSeller/MyVehicleCard";
// import SearchVehicleFilter from "@components/CarBuyer/SearchVehicleFilter";
// import Form from "@components/Form";
// import SellVehiclePage from "@pages/SellVehiclePage";
//import VehicleViewPage from "@pages/VehicleViewPage";
import DashboardPage from "@pages/Admin/DashboardPage";
import DashboardHome from "@pages/Admin/DashboardHome";
import ServicePage from "@pages/Admin/Service_Centers";
import UserPage from "@pages/Admin/User_Management";

//Pages
function App() {
  const [userContext, setUserContext] = useState(null);
  //const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    setUserContext({ role: "administrator" })

    //   const checkAuth = async () => {
    //     try {
    //       const storedUser = localStorage.getItem('user');
    //       if (storedUser) {
    //         setUserContext(JSON.parse(storedUser));
    //       }
    //     } catch (error) {
    //       console.error('Auth check error:', error);
    //     } finally {
    //       setIsCheckingAuth(false); // Mark auth check as complete
    //     }
    //   };

    //   checkAuth();
  }, []);



  return (

    <UserContext.Provider value={{ userContext, setUserContext }}>

      <BrowserRouter>
        <Routes>
          <Route path="/auth">
            <Route path="" element={<AuthPage><LoginForm /></AuthPage>} />
          </Route>

           <Route path="/*" element={<DashboardPage/> } >
            <Route index element={<DashboardHome />} />
            <Route path="services" element={<ServicePage />} />
            <Route path="users" element={<UserPage />} />
          </Route>
          
          


          {/* <Route path="/*" element={
            <ProtectedRoute isCheckingAuth={isCheckingAuth}>
              <Dashboard />
            </ProtectedRoute>
          } /> */}
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

// function ProtectedRoute({ children, isCheckingAuth }) {
//   const { userContext } = useContext(UserContext);
//   const location = useLocation();

//   if (isCheckingAuth) {
//     return <div className="loading-screen">Loading...</div>; // Show loading indicator
//   }

//   if (!userContext) {
//     return <Navigate to="/auth" state={{ from: location, message: 'Please login to continue' }} replace />;
//   }

//   return children;
// }

export default App;