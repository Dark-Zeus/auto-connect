import React, { useState } from "react";
import { IconButton } from "@mui/material"; // Or your own IconButton component
import { Edit, Delete } from "@mui/icons-material";

const initialServices = [
  { id: "svc001", name: "AutoFix", district: "Colombo", phone: "011-1234567", status: "Open" },
  { id: "svc002", name: "QuickServe", district: "Kandy", phone: "081-7654321", status: "Closed" },
  { id: "svc003", name: "SpeedyAuto", district: "Galle", phone: "091-2345678", status: "Open" },
  { id: "svc004", name: "AutoCare", district: "Matara", phone: "041-9876543", status: "Open" },
];

function ServicePage() {
  const [services, setServices] = useState(initialServices);

  const handleEdit = (id) => {
    alert(`Edit service center ${id} - Implement your edit logic here.`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this service center?")) {
      setServices(services.filter((service) => service.id !== id));
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Service Centers</h2>
      <table className="min-w-full border border-gray-300 rounded-md overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-6 border-b text-left">ID</th>
            <th className="py-3 px-6 border-b text-left">Name</th>
            <th className="py-3 px-6 border-b text-left">District</th>
            <th className="py-3 px-6 border-b text-left">Phone</th>
            <th className="py-3 px-6 border-b text-left">Status</th>
            <th className="py-3 px-6 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map(({ id, name, district, phone, status }) => (
            <tr key={id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-6 border-b">{id}</td>
              <td className="py-3 px-6 border-b">{name}</td>
              <td className="py-3 px-6 border-b">{district}</td>
              <td className="py-3 px-6 border-b">{phone}</td>
              <td className="py-3 px-6 border-b">{status}</td>
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
          {services.length === 0 && (
            <tr>
              <td colSpan={6} className="py-6 text-center text-gray-500">
                No service centers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ServicePage;
