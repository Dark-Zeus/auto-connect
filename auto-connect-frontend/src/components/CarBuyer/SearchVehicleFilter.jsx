import React, { useState } from 'react';
import buyVehicleApiService from '../../services/buyVehicleApiService';

const VehicleFilterForm = ({ onFilter }) => {
  const [formData, setFormData] = useState({
    urgency: 'false',
    district: '',
    city: '',
    vehicleType: '',
    make: '',
    model: '',
    minYear: '',
    maxYear: '',
    transmission: '',
    fuelType: '',
    condition: '',
    minPrice: '',
    maxPrice: ''
  });

  const sriLankanDistricts = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 
    'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 
    'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 'Matara', 'Monaragala', 
    'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura', 
    'Trincomalee', 'Vavuniya'
  ];

  const vehicleTypes = [
    'Car', 'Van', 'SUV', 'Crew Cab', 'Pickup/Double Cab', 'Bus', 'Lorry/Tipper', 
    'Tractor', 'Threewheel', 'Heavyduty', 'Other', 'Motorcycle'
  ];

  const vehicleMakes = [
    'Acura', 'Alfa-Romeo', 'Aprilia', 'Ashok Leyland', 'Aston Martin', 'Atco', 'Audi', 'Austin', 'Baic', 
    'Bajaj', 'BYD', 'Borgward', 'Cadillac', 'Cal', 'Ceygra', 'Changan', 'Chevrolet', 
    'Chrysler', 'Citroen', 'Corvette', 'Daewoo','DAF', 'Daido', 'Daihatsu', 'Datsun', 'Deepal', 'Demak', 'Dfac', 
    'DFSK', 'Ducati', 'Dyno', 'Eicher', 'Ferrari', 'Fiat', 'Force', 'Ford', 'Foton', 'GAC', 'Gallant',
    'Hero', 'Hero-Honda', 'Hillman', 'HINO', 'Hitachi', 'Holden', 'Honda', 'Hummer', 'Hyundai', 
    'IHI', 'Isuzu', 'Iveco', 'JCB','Jeep','JiaLing', 'JMC', 'John-Deere', 'Jonway', 'JMEV', 'Kapla', 'Kawasaki', 'Kia', 'Kinetic','King Long', 'Kobelco', 
    'Komatsu', 'KTM', 'Kubota', 'Lamborghini', 'Land-Rover', 'Lexus', 'Lincoln', 'Longjia', 'Lotus', 
    'Lti', 'Mahindra', 'MAN', 'Maserati', 'Massey-Ferguson', 'Mazda', 'Mercedes-Benz', 'Metrocab', 'MG', 
    'Mg-Rover', 'Micro', 'Mini', 'Minnelli', 'Mitsubishi', 'Morgan', 'Morris', 'New-Holland', 'Nissan', 'NWOW',
    'Opel', 'Perodua', 'Peugeot', 'Piaggio', 'Porsche', 'Powertrac', 'Proton', 'Range-Rover', 'Ranomoto', 'Reva', 'REVOLT', 'Renault', 
    'Rolls-Royce', 'Saab', 'Sakai','Scania', 'Seat', 'Senaro', 'Singer', 'Skoda', 'Smart', 'Sonalika', 
    'Subaru','Sunlong', 'Suzuki', 'Swaraj', 'Syuk', 'TAFE', 'TAILG', 'Tata', 'Tesla', 'Toyota', 'Triumph','TVS', 'Vauxhall', 
    'Vespa', 'Volkswagen', 'Volvo', 'Wave', 'Willys', 'Yadea', 'Yamaha', 'Yanmar', 'Yuejin','Yutong', 'Zhongtong', 
    'Zongshen', 'Zotye', 'Other'
  ];

  const years = Array.from({ length: 50 }, (_, i) => 2025 - i).map(year => year.toString());

  const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'CNG'];

  const transmissionTypes = ['Manual', 'Automatic', 'Triptonic', 'Other'];

  const conditionTypes = ['Brand New', 'Used', 'Reconditioned'];

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await buyVehicleApiService.filterVehicles(formData);
      if (onFilter) {
        onFilter(res.data || []);
      }
    } catch (err) {
      if (onFilter) onFilter([]);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setFormData({
      urgency: 'false',
      district: '',
      city: '',
      vehicleType: '',
      make: '',
      model: '',
      minYear: '',
      maxYear: '',
      transmission: '',
      fuelType: '',
      condition: '',
      minPrice: '',
      maxPrice: ''
    });
  };

  return (
    <div className="tw:max-w-sm tw:max-h-sm tw:mx-auto tw:bg-white tw:rounded-2xl tw:shadow-2xl tw:border tw:border-gray-100 tw:overflow-hidden">
      <div className="tw:bg-[linear-gradient(135deg,var(--sky-blue),var(--navy-blue))] tw:p-6 tw:text-white">
        <div className="tw:flex tw:items-center tw:gap-3">
          <svg className="tw:w-6 tw:h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <h2 className="tw:text-xl tw:font-bold">Vehicle Filter</h2>
        </div>
        <p className="tw:text-blue-100 tw:mt-2">Find your perfect vehicle</p>
      </div>

      <form className="tw:p-6 tw:space-y-6" onSubmit={handleSubmit}>
        {/* Urgent Checkbox */}
        {/* <div className="tw:space-y-2">
          <label className="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:font-medium tw:text-gray-700">
            <input
              type="checkbox"
              name="urgency"
              checked={formData.urgency === 'true'}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  urgency: e.target.checked ? 'true' : 'false'
                }))
              }
              className="tw:w-4 tw:h-4 tw:text-blue-600"
            />
            <span className="tw:text-lg tw:px-2 tw:py-1 tw:rounded tw:font-semibold tw:bg-red-500 tw:text-white">
              Urgent
            </span>
          </label>
        </div> */}

        {/* District */}
        <div className="tw:space-y-2">
          <label className="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:font-medium tw:text-gray-700">
            <svg className="tw:w-4 tw:h-4 tw:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            District
          </label>
          <select
            name="district"
            value={formData.district}
            onChange={handleInputChange}
            className="tw:w-full tw:p-3 tw:border tw:border-gray-300 tw:rounded-lg tw:focus:ring-2 tw:focus:ring-blue-500 tw:focus:border-transparent tw:bg-white tw:text-gray-700"
          >
            <option value="">Select District</option>
            {sriLankanDistricts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>

        {/* City */}
        <div className="tw:space-y-2">
          <label className="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:font-medium tw:text-gray-700">
            <svg className="tw:w-4 tw:h-4 tw:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="Enter city name"
            className="tw:w-full tw:p-3 tw:border tw:border-gray-300 tw:rounded-lg tw:focus:ring-2 tw:focus:ring-blue-500 tw:focus:border-transparent tw:bg-white tw:text-gray-700"
          />
        </div>

        {/* Vehicle Type */}
        <div className="tw:space-y-2">
          <label className="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:font-medium tw:text-gray-700">
            <svg className="tw:w-4 tw:h-4 tw:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
            Vehicle Type
          </label>
          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleInputChange}
            className="tw:w-full tw:p-3 tw:border tw:border-gray-300 tw:rounded-lg tw:focus:ring-2 tw:focus:ring-blue-500 tw:focus:border-transparent tw:bg-white tw:text-gray-700"
          >
            <option value="">Select Type</option>
            {vehicleTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Manufacturer */}
        <div className="tw:space-y-2">
          <label className="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:font-medium tw:text-gray-700">
            <svg className="tw:w-4 tw:h-4 tw:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.93 8.35l-3.6 1.68L14 7.7V6.3l2.33-2.33 3.6 1.68c.38.18.82.01 1-.37.18-.38.01-.82-.37-1L16.67 2.6c-.38-.18-.82-.01-1 .37L14 5.3V4c0-.55-.45-1-1-1s-1 .45-1 1v1.3L10.33 2.97c-.18-.38-.62-.55-1-.37L5.44 4.28c-.38.18-.55.62-.37 1 .18.38.62.55 1 .37l3.6-1.68L12 6.3v1.4l-2.33 2.33-3.6-1.68c-.38-.18-.82-.01-1 .37-.18.38-.01.82.37 1l3.89 1.68c.38.18.82.01 1-.37L12 8.7v1.4l-2.33 2.33-3.6-1.68c-.38-.18-.82-.01-1 .37-.18.38-.01.82.37 1l3.89 1.68c.38.18.82.01 1-.37L12 10.7v1.4l-2.33 2.33-3.6-1.68c-.38-.18-.82-.01-1 .37-.18.38-.01.82.37 1l3.89 1.68c.38.18.82.01 1-.37L12 12.7v1.4l-2.33 2.33-3.6-1.68c-.38-.18-.82-.01-1 .37-.18.38-.01.82.37 1l3.89 1.68c.38.18.82.01 1-.37L12 14.7v5.3c0 .55.45 1 1 1s1-.45 1-1v-5.3l1.67 1.67c.18.38.62.55 1 .37l3.89-1.68c.38-.18.55-.62.37-1-.18-.38-.62-.55-1-.37l-3.6 1.68L14 12.7v-1.4l2.33-2.33 3.6 1.68c.38.18.82.01 1-.37.18-.38.01-.82-.37-1l-3.89-1.68c-.38-.18-.82-.01-1 .37L14 10.7V9.3l2.33-2.33 3.6 1.68c.38.18.82.01 1-.37.18-.37.01-.81-.37-.99z"/>
            </svg>
            Manufacturer
          </label>
          <select
            name="make"
            value={formData.make}
            onChange={handleInputChange}
            className="tw:w-full tw:p-3 tw:border tw:border-gray-300 tw:rounded-lg tw:focus:ring-2 tw:focus:ring-blue-500 tw:focus:border-transparent tw:bg-white tw:text-gray-700"
          >
            <option value="">Select Manufacturer</option>
            {vehicleMakes.map(make => (
              <option key={make} value={make}>{make}</option>
            ))}
          </select>
        </div>

        {/* Model */}
        <div className="tw:space-y-2">
          <label className="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:font-medium tw:text-gray-700">
            <svg className="tw:w-4 tw:h-4 tw:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
            Model
          </label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleInputChange}
            placeholder="Enter model name"
            className="tw:w-full tw:p-3 tw:border tw:border-gray-300 tw:rounded-lg tw:focus:ring-2 tw:focus:ring-blue-500 tw:focus:border-transparent tw:bg-white tw:text-gray-700"
          />
        </div>

        {/* Year Range */}
        <div className="tw:space-y-2">
          <label className="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:font-medium tw:text-gray-700">
            <svg className="tw:w-4 tw:h-4 tw:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2.5-9H18V0h-2v2H8V0H6v2H3.5C2.67 2 2 2.67 2 3.5v17C2 21.33 2.67 22 3.5 22h17c.83 0 1.5-.67 1.5-1.5v-17C22 2.67 21.33 2 20.5 2zM20 20H4V7h16v13z"/>
            </svg>
            Year of Manufacture
          </label>
          <div className="tw:grid tw:grid-cols-2 tw:gap-3">
            <select
              name="minYear"
              value={formData.minYear || ""}
              onChange={handleInputChange}
              className="tw:w-full tw:p-3 tw:border tw:border-gray-300 tw:rounded-lg tw:focus:ring-2 tw:focus:ring-blue-500 tw:focus:border-transparent tw:bg-white tw:text-gray-700"
            >
              <option value="">Min Year</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <select
              name="maxYear"
              value={formData.maxYear || ""}
              onChange={handleInputChange}
              className="tw:w-full tw:p-3 tw:border tw:border-gray-300 tw:rounded-lg tw:focus:ring-2 tw:focus:ring-blue-500 tw:focus:border-transparent tw:bg-white tw:text-gray-700"
            >
              <option value="">Max Year</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Transmission */}
        <div className="tw:space-y-2">
          <label className="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:font-medium tw:text-gray-700">
            <svg className="tw:w-4 tw:h-4 tw:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Transmission
          </label>
          <select
            name="transmission"
            value={formData.transmission}
            onChange={handleInputChange}
            className="tw:w-full tw:p-3 tw:border tw:border-gray-300 tw:rounded-lg tw:focus:ring-2 tw:focus:ring-blue-500 tw:focus:border-transparent tw:bg-white tw:text-gray-700"
          >
            <option value="">Select Transmission</option>
            {transmissionTypes.map(transmission => (
              <option key={transmission} value={transmission}>{transmission}</option>
            ))}
          </select>
        </div>

        {/* Fuel */}
        <div className="tw:space-y-2">
          <label className="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:font-medium tw:text-gray-700">
            <svg className="tw:w-4 tw:h-4 tw:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.84 0 1.58-.41 2.03-1.03L19.77 7.23zM9.77 9.73l.01-.01-3.72-3.72L5 6.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.84 0 1.58-.41 2.03-1.03L9.77 9.73zM19.77 16.23l.01-.01-3.72-3.72L15 13.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.84 0 1.58-.41 2.03-1.03L19.77 16.23zM6.23 15.77l.01.01 3.72 3.72L11 18.44l-2.11-2.11c.94-.36 1.61-1.26 1.61-2.33 0-1.38-1.12-2.5-2.5-2.5-.84 0-1.58.41-2.03 1.03L6.23 15.77z"/>
            </svg>
            Fuel Type
          </label>
          <select
            name="fuelType"
            value={formData.fuelType}
            onChange={handleInputChange}
            className="tw:w-full tw:p-3 tw:border tw:border-gray-300 tw:rounded-lg tw:focus:ring-2 tw:focus:ring-blue-500 tw:focus:border-transparent tw:bg-white tw:text-gray-700"
          >
            <option value="">Select Fuel Type</option>
            {fuelTypes.map(fuel => (
              <option key={fuel} value={fuel}>{fuel}</option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div className="tw:space-y-2">
          <label className="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:font-medium tw:text-gray-700">
            <svg className="tw:w-4 tw:h-4 tw:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
            Condition
          </label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleInputChange}
            className="tw:w-full tw:p-3 tw:border tw:border-gray-300 tw:rounded-lg tw:focus:ring-2 tw:focus:ring-blue-500 tw:focus:border-transparent tw:bg-white tw:text-gray-700"
          >
            <option value="">Select Condition</option>
            {conditionTypes.map(condition => (
              <option key={condition} value={condition}>{condition}</option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="tw:space-y-2">
          <label className="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:font-medium tw:text-gray-700">
            <svg className="tw:w-4 tw:h-4 tw:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
            </svg>
            Price Range (LKR)
          </label>
          <div className="tw:grid tw:grid-cols-2 tw:gap-3">
            <input
              type="number"
              name="minPrice"
              value={formData.minPrice}
              onChange={handleInputChange}
              placeholder="Min Price"
              className="tw:w-full tw:p-3 tw:border tw:border-gray-300 tw:rounded-lg tw:focus:ring-2 tw:focus:ring-blue-500 tw:focus:border-transparent tw:bg-white tw:text-gray-700"
            />
            <input
              type="number"
              name="maxPrice"
              value={formData.maxPrice}
              onChange={handleInputChange}
              placeholder="Max Price"
              className="tw:w-full tw:p-3 tw:border tw:border-gray-300 tw:rounded-lg tw:focus:ring-2 tw:focus:ring-blue-500 tw:focus:border-transparent tw:bg-white tw:text-gray-700"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="tw:grid tw:grid-cols-2 tw:gap-3 tw:pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:bg-gradient-to-r tw:bg-[linear-gradient(135deg,var(--sky-blue),var(--navy-blue))] tw:text-white tw:py-3 tw:px-4 tw:rounded-lg tw:font-medium tw:hover:bg-[linear-gradient(135deg,var(--navy-blue),var(--sky-blue))] tw:transform tw:hover:scale-105 tw:transition-all tw:duration-200 tw:shadow-lg tw:hover:shadow-xl tw:hover:cursor-pointer"
          >
            <svg className="tw:w-4 tw:h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
            </svg>
            Filter
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:bg-gray-500 tw:text-white tw:py-3 tw:px-4 tw:rounded-lg tw:font-medium tw:hover:bg-gray-600 tw:transform tw:hover:scale-105 tw:transition-all tw:duration-200 tw:shadow-lg tw:hover:shadow-xl tw:hover:cursor-pointer"
          >
            <svg className="tw:w-4 tw:h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
            </svg>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleFilterForm;