import UserCategoryCard from "@components/AdminComponents/UserCategoryCard";
import vehicleImg from "@assets/images/vehicleowner1.jpg";
import insuranceImg from "@assets/images/insurense1.jpg";
import { PersonAddAlt1 } from "@mui/icons-material"; // Icon for "Requests"
import requestImg from "@assets/images/requests.jpg"; // Placeholder for request image
import { Outlet } from "react-router-dom";

function UserManagementPage() {
  return (
    <div className="tw:min-h-screen tw:px-10 tw:py-14">
      <h2 className="tw:text-3xl tw:font-bold tw:text-blue-800 tw:mb-12">
        User Categories
      </h2>

      <div className="tw:mt-20 tw:flex tw:flex-wrap tw:justify-center tw:gap-x-15 tw:gap-y-12">
        <UserCategoryCard
          label="Vehicle Owners"
          to="/users/vehicle-owners"
          image={vehicleImg}
        />
        <UserCategoryCard
          label="Insurance Companies"
          to="/users/insurance-companies"
          image={insuranceImg}
        />
        <UserCategoryCard
          label="Requests"
          to="/users/requests"
          image={requestImg}
        />
      </div>
       <Outlet />
    </div>
  );
}

export default UserManagementPage;
