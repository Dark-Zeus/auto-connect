import React, { useState } from "react";

export default function CompanyRegistrationForm() {
  const [formData, setFormData] = useState({
    companyName: "",
    owner: "",
    licenseNumber: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    establishedDate: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
  };

  return (
    <div className="tw:min-h-screen tw:bg-[#DFF2EB] tw:flex tw:items-center tw:justify-center tw:p-4">
      <form
        onSubmit={handleSubmit}
        className="tw:bg-white tw:shadow-lg tw:rounded-lg tw:p-8 tw:w-full tw:max-w-3xl"
      >
        <h2 className="tw:text-2xl tw:font-bold tw:text-center tw:text-[#4A628A] tw:mb-6">
          Insurance Company Registration
        </h2>

        <div className="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-4">
          {/* Row 1 */}
          <div>
            <label className="tw:block tw:text-[#4A628A] tw:font-medium tw:mb-1">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="tw:w-full tw:px-4 tw:py-2 tw:border tw:border-[#B9E5E8] tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-[#7AB2D3]"
            />
          </div>
          <div>
            <label className="tw:block tw:text-[#4A628A] tw:font-medium tw:mb-1">
              Owner
            </label>
            <input
              type="text"
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              required
              className="tw:w-full tw:px-4 tw:py-2 tw:border tw:border-[#B9E5E8] tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-[#7AB2D3]"
            />
          </div>

          {/* Row 2 */}
          <div>
            <label className="tw:block tw:text-[#4A628A] tw:font-medium tw:mb-1">
              License Number
            </label>
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              required
              className="tw:w-full tw:px-4 tw:py-2 tw:border tw:border-[#B9E5E8] tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-[#7AB2D3]"
            />
          </div>
          <div>
            <label className="tw:block tw:text-[#4A628A] tw:font-medium tw:mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="tw:w-full tw:px-4 tw:py-2 tw:border tw:border-[#B9E5E8] tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-[#7AB2D3]"
            />
          </div>

          {/* Row 3 */}
          <div>
            <label className="tw:block tw:text-[#4A628A] tw:font-medium tw:mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="tw:w-full tw:px-4 tw:py-2 tw:border tw:border-[#B9E5E8] tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-[#7AB2D3]"
            />
          </div>
          <div>
            <label className="tw:block tw:text-[#4A628A] tw:font-medium tw:mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="tw:w-full tw:px-4 tw:py-2 tw:border tw:border-[#B9E5E8] tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-[#7AB2D3]"
            />
          </div>

          {/* Row 4 */}
          <div>
            <label className="tw:block tw:text-[#4A628A] tw:font-medium tw:mb-1">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              required
              className="tw:w-full tw:px-4 tw:py-2 tw:border tw:border-[#B9E5E8] tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-[#7AB2D3]"
            />
          </div>
           <div>
            <label className="tw:block tw:text-[#4A628A] tw:font-medium tw:mb-1">
              Established Date
            </label>
            <input
              type="date"
              name="establishedDate"
              value={formData.establishedDate}
              onChange={handleChange}
              required
              className="tw:w-full tw:px-4 tw:py-2 tw:border tw:border-[#B9E5E8] tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-[#7AB2D3] tw:text-black"
            />
          </div>
        </div>

        {/* Description full width */}
        <div className="tw:mt-4">
          <label className="tw:block tw:text-[#4A628A] tw:font-medium tw:mb-1">
            Company Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
            className="tw:w-full tw:px-4 tw:py-2 tw:border tw:border-[#B9E5E8] tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-[#7AB2D3]"
          />
        </div>

        {/* Register Button */}
        <div className="tw:mt-6 tw:flex tw:justify-center">
          <button
            type="submit"
            className="tw:bg-[#7AB2D3] tw:text-white tw:font-semibold tw:py-2 tw:px-6 tw:rounded tw:hover:bg-[#4A628A] tw:transition"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
