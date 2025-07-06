import UserCategoryCard from "@components/AdminComponents/UserCategoryCard";
import { DirectionsCar, Business, PersonAddAlt1, AddBox } from "@mui/icons-material";

function UserManagementPage() {
  return (
    <div className="tw:min-h-screen tw:bg-gradient-to-br tw:from-slate-100 tw:to-blue-50 tw:p-10">
      <h2 className="tw:text-3xl tw:font-bold tw:text-blue-800 tw:mb-8">User Categories</h2>

      <div className="tw:flex tw:flex-wrap tw:gap-6">
        <UserCategoryCard
          label="Vehicle Owners"
          to="/users/vehicle-owners"
          icon={<DirectionsCar fontSize="inherit" />}
        />
        <UserCategoryCard
          label="Insurance Companies"
          to="/users/insurance-companies"
          icon={<Business fontSize="inherit" />}
        />
        <UserCategoryCard
          label="Requests"
          to="/users/requests"
          icon={<PersonAddAlt1 fontSize="inherit" />}
        />
        <UserCategoryCard
          label="Add Another"
          to="/users/add-category"
          icon={<AddBox fontSize="inherit" />}
        />
      </div>
    </div>
  );
}

export default UserManagementPage;
