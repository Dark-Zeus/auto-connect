// @pages/Admin/UserLayout.jsx
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div>
      <h2 className="tw-text-xl tw-font-bold tw-mb-4">User Management</h2>
      <Outlet />
    </div>
  );
}
