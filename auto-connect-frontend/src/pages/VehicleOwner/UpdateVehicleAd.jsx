import UpdateSellVehicleForm from "@components/CarSeller/UpdateSellVehicleForm";
import MarketplaceNavigation from "@components/CarSeller/MarketplaceNavigation";
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import listVehicleAPI from "../../services/listVehicleApiService";
import userApiService from "../../services/userApiService";
import { UserContext } from "../../contexts/UserContext";

const UpdateVehicleAd = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fixedName, setFixedName] = useState("");
  const [fixedEmail, setFixedEmail] = useState("");
  const { userContext: user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch vehicle details
        const res = await listVehicleAPI.getListing(id);
        setVehicle(res.data);

        // Fetch user details for fixedName/fixedEmail
        let userData;
        if (user) {
          userData = user;
        } else {
          const apiRes = await userApiService.getCurrentUser();
          userData = apiRes.user;
        }
        setFixedName(
          userData.name ||
            `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
            "Unknown User"
        );
        setFixedEmail(userData.email || "email@example.com");
      } catch (e) {
        setVehicle(null);
      }
      setLoading(false);
    };
    fetchData();
  }, [id, user]);

  return (
    <div className="tw:min-h-screen tw:w-full tw:bg-gradient-to-br tw:from-slate-100 tw:to-blue-50 tw:py-8 tw:px-4 tw:overflow-auto">
      {/* <MarketplaceNavigation /> */}
      <div className="tw:w-full sm:tw:w-11/12 md:tw:w-4/5 lg:tw:w-[70%] tw:mx-auto">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <UpdateSellVehicleForm
            vehicle={vehicle}
            fixedName={fixedName}
            fixedEmail={fixedEmail}
          />
        )}
      </div>
    </div>
  );
};

export default UpdateVehicleAd;