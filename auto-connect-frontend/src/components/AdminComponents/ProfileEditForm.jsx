import React from "react";

export default function ProfileEditForm({ userData, onChange, onCancel, onSave }) {
  return (
    <div className="tw:flex tw:flex-col tw:gap-4 tw:w-full">
      <input
        type="text"
        name="name"
        value={userData.name}
        onChange={onChange}
        className="tw:border tw:border-blue-600 tw:rounded-lg tw:px-4 tw:py-2 tw:text-gray-900 tw:font-semibold tw:bg-blue-50 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500"
        placeholder="Name"
      />
      <input
        type="email"
        name="email"
        value={userData.email}
        onChange={onChange}
        className="tw:border tw:border-blue-600 tw:rounded-lg tw:px-4 tw:py-2 tw:text-gray-900 tw:font-semibold tw:bg-blue-50 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500"
        placeholder="Email"
      />
      <input
        type="tel"
        name="phone"
        value={userData.phone}
        onChange={onChange}
        className="tw:border tw:border-blue-600 tw:rounded-lg tw:px-4 tw:py-2 tw:text-gray-900 tw:font-semibold tw:bg-blue-50 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-blue-500"
        placeholder="Phone"
      />
      <div className="tw:flex tw:justify-end tw:gap-3">
        <button
          onClick={onCancel}
          className="tw:bg-gray-300 tw:text-gray-700 tw:px-5 tw:py-2 tw:rounded-lg tw:font-semibold hover:tw:bg-gray-400 tw:transition"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="tw:bg-blue-700 tw:text-white tw:px-5 tw:py-2 tw:rounded-lg tw:font-semibold hover:tw:bg-blue-800 tw:transition"
        >
          Save
        </button>
      </div>
    </div>
  );
}