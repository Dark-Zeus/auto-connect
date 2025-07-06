import React, { useState } from "react";
import { IconButton } from "@mui/material"; // Or your own IconButton component
import { Edit, Delete } from "@mui/icons-material";

const initialUsers = [
  { id: "user001", name: "John Doe", email: "john@example.com", role: "Admin" },
  { id: "user002", name: "Jane Smith", email: "jane@example.com", role: "User" },
  { id: "user003", name: "Alice Johnson", email: "alice@example.com", role: "User" },
  { id: "user004", name: "Bob Brown", email: "bob@example.com", role: "Moderator" },
];

function UserPage() {
  const [users, setUsers] = useState(initialUsers);

  const handleEdit = (id) => {
    alert(`Edit user ${id} - Implement your edit logic here.`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  return (
    <div className="tw:p-8">
      <h2 className="tw:text-3xl tw:font-bold tw:mb-6">User Management</h2>
      <table className="tw:min-w-full tw:border tw:border-gray-300 tw:rounded-md tw:overflow-hidden">
        <thead className="tw:bg-gray-100">
          <tr>
            <th className="tw:py-3 tw:px-6 tw:border-b tw:text-left">ID</th>
            <th className="tw:py-3 tw:px-6 tw:border-b tw:text-left">Name</th>
            <th className="tw:py-3 tw:px-6 tw:border-b tw:text-left">Email</th>
            <th className="tw:py-3 tw:px-6 tw:border-b tw:text-left">Role</th>
            <th className="tw:py-3 tw:px-6 tw:border-b tw:text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ id, name, email, role }) => (
            <tr key={id} className="tw:hover:bg-gray-50 tw:transition-colors">
              <td className="tw:py-3 tw:px-6 tw:border-b">{id}</td>
              <td className="tw:py-3 tw:px-6 tw:border-b">{name}</td>
              <td className="tw:py-3 tw:px-6 tw:border-b">{email}</td>
              <td className="tw:py-3 tw:px-6 tw:border-b">{role}</td>
              <td className="tw:py-3 tw:px-6 tw:border-b tw:text-center tw:flex tw:justify-center tw:gap-2">
                <IconButton color="primary" size="small" onClick={() => handleEdit(id)}>
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton color="error" size="small" onClick={() => handleDelete(id)}>
                  <Delete fontSize="small" />
                </IconButton>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={5} className="tw:py-6 tw:text-center tw:text-gray-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserPage;
