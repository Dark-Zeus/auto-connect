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
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">User Management</h2>
      <table className="min-w-full border border-gray-300 rounded-md overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-6 border-b text-left">ID</th>
            <th className="py-3 px-6 border-b text-left">Name</th>
            <th className="py-3 px-6 border-b text-left">Email</th>
            <th className="py-3 px-6 border-b text-left">Role</th>
            <th className="py-3 px-6 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ id, name, email, role }) => (
            <tr key={id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-6 border-b">{id}</td>
              <td className="py-3 px-6 border-b">{name}</td>
              <td className="py-3 px-6 border-b">{email}</td>
              <td className="py-3 px-6 border-b">{role}</td>
              <td className="py-3 px-6 border-b text-center flex justify-center gap-2">
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
              <td colSpan={5} className="py-6 text-center text-gray-500">
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
