import SellVehicleForm from "@components/CarSeller/SellVehicleForm";
import MarketplaceNavigation from "@components/CarSeller/MarketplaceNavigation";
import userApiService from "../../services/userApiService";
import { UserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import React, { useEffect, useState, useContext } from "react";

const SellVehiclePage = () => {
  const [fixedName, setFixedName] = useState("");
  const [fixedEmail, setFixedEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const { userContext: user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        let userData = user;
        if (!userData) {
          const apiRes = await userApiService.getCurrentUser();
          userData = apiRes.user;
        }
        setFixedName(
          userData.name ||
            `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
            "Unknown User"
        );
        setFixedEmail(userData.email || "email@example.com");
        setUserId(userData._id || userData.id);
      } catch (e) {
        toast.error("Please log in to access this page.");
        navigate("/login");
      }
      setLoading(false);
    };
    fetchUser();
  }, [user, navigate]);

  if (loading) return <div>Loading...</div>;
  return (
    <div className="tw:min-h-screen tw:w-full tw:bg-transparent tw:py-8 tw:px-4 tw:overflow-auto">
      {/* <MarketplaceNavigation /> */}
      <div className="tw:w-full sm:tw:w-11/12 md:tw:w-4/5 lg:tw:w-[70%] tw:mx-auto">
        <SellVehicleForm
          fixedName={fixedName}
          fixedEmail={fixedEmail}
          userId={userId}
        />
      </div>
    </div>    
  );
};

export default SellVehiclePage;