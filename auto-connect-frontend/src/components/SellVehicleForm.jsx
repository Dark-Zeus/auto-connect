import React, { useState } from 'react';
import { Camera, X } from 'lucide-react';

const SellVehicleForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    district: '',
    city: '',
    email: '',
    vehicleType: '',
    condition: '',
    make: '',
    model: '',
    year: '',
    price: '',
    ongoingLease: false,
    transmission: '',
    fuelType: '',
    engineCapacity: '',
    mileage: '',
    description: ''
  });

  const [photos, setPhotos] = useState(Array(6).fill(null));

  const sriLankanDistricts = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha', 
    'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 
    'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 
    'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
  ];

  const vehicleTypes = [
    'car', 'van', 'suv', 'crew cab', 'pickup/double cab', 'bus', 'lorry/tipper', 
    'tractor', 'threewheel', 'heavyduty', 'other', 'motorcycle'
  ];

  const vehicleMakes = [
    'Acura', 'Alfa-Romeo', 'Aprilia', 'Ashok', 'Aston', 'Atco', 'Audi', 'Austin', 'Baic', 
    'Bajaj', 'BP-U', 'Borgward', 'Cadillac', 'Cal', 'Ceygra', 'Changan', 'Chevrolet', 
    'Chrysler', 'Citroen', 'Corvette', 'Daewoo', 'Daihatsu', 'Datsun', 'Deepal', 'Demak', 
    'Dfac', 'Ducati', 'Dyno', 'Eicher', 'Ferrari', 'Fiat', 'Force', 'Ford', 'Foton', 
    'Hero', 'Hero-Honda', 'Hillman', 'Hitachi', 'Holden', 'Honda', 'Hummer', 'Hyundai', 
    'Iveco', 'JiaLing', 'John-Deere', 'Jonway', 'Kawasaki', 'Kia', 'Kinetic', 'Kobelco', 
    'Komatsu', 'Kubota', 'Lamborghini', 'Land-Rover', 'Lexus', 'Loncin', 'Longjia', 'Lotus', 
    'Lti', 'Mahindra', 'Maserati', 'Massey-Ferguson', 'Mercedes-Benz', 'Metrocab', 'MG', 
    'Mg-Rover', 'Micro', 'Mini', 'Minnelli', 'Mitsubishi', 'Morgan', 'Morris', 'New-Holland', 
    'Opel', 'Perodua', 'Peugeot', 'Piaggio', 'Powertrac', 'Proton', 'Range-Rover', 'Renault', 
    'Rolls-Royce', 'Saab', 'Sakai', 'Seat', 'Senaro', 'Singer', 'Skoda', 'Smart', 'Sonalika', 
    'Subaru', 'Suzuki', 'Swaraj', 'Syuk', 'Tata', 'Tesla', 'Toyota', 'Triumph', 'Vauxhall', 
    'Vespa', 'Volkswagen', 'Volvo', 'Wave', 'Willys', 'Yadea', 'Yamaha', 'Yanmar', 'Yuejin', 
    'Zongshen', 'Zotye'
  ];

  const years = Array.from({ length: 100 }, (_, i) => 2025 - i);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePhotoUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhotos = [...photos];
        newPhotos[index] = e.target.result;
        setPhotos(newPhotos);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (index) => {
    const newPhotos = [...photos];
    newPhotos[index] = null;
    setPhotos(newPhotos);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    console.log('Photos:', photos);
  };

  const handleDiscard = () => {
    setFormData({
      name: '', mobile: '', district: '', city: '', email: '',
      vehicleType: '', condition: '', make: '', model: '', year: '',
      price: '', ongoingLease: false, transmission: '', fuelType: '',
      engineCapacity: '', mileage: '', description: ''
    });
    setPhotos(Array(6).fill(null));
  };

  return (
    <form onSubmit={handleSubmit} className="tw:w-full">
      <div className="tw:w-full">
        
        <div className="tw:bg-gradient-to-r tw:from-slate-600 tw:to-slate-700 tw:text-white tw:p-8 tw:rounded-t-xl tw:shadow-lg">
          <div className="tw:flex tw:items-center tw:gap-3">
            <div className="tw:bg-red-500 tw:p-2 tw:rounded-lg">
              <svg className="tw:w-6 tw:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              {/*  <path d="M3 4a1 1 0 00-1 1v1a1 1 0 001 1h1l1.68 5.39A3 3 0 008.49 15H15a1 1 0 000-2H8.49a1 1 0 01-.96-.73L6.9 11h8.1a1 1 0 00.96-.73l1.5-6A1 1 0 0016.5 3H4.72L4.22 1.39A1 1 0 003.28 1H2a1 1 0 000 2h.72L3 4z"/> */}
              </svg>
            </div>
            <div>
              <h1 className="tw:text-3xl tw:font-bold">List Your Vehicle</h1>
              <p className="tw:text-slate-200 tw:mt-1">Items marked with * are required.</p>
            </div>
          </div>
        </div>

        <div className="tw:bg-white tw:rounded-b-xl tw:shadow-lg">
          
          <div className="tw:p-8 tw:border-b tw:border-slate-200">
            <div className="tw:flex tw:items-center tw:gap-2 tw:mb-6">
              <div className="tw:bg-slate-600 tw:p-2 tw:rounded-lg">
                <svg className="tw:w-5 tw:h-5 tw:text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                </svg>
              </div>
              <h2 className="tw:text-xl tw:font-semibold tw:text-slate-700">Contact Information</h2>
            </div>

            <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-6">
              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-slate-700 tw:mb-2">
                  Name <span className="tw:text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="tw:w-full tw:px-4 tw:py-3 tw:border tw:border-slate-300 tw:rounded-lg focus:tw:ring-2 focus:tw:ring-slate-500 focus:tw:border-transparent tw:transition-all"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-slate-700 tw:mb-2">
                  Mobile Phone <span className="tw:text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  pattern="07[0-9]{8}"
                  className="tw:w-full tw:px-4 tw:py-3 tw:border tw:border-slate-300 tw:rounded-lg focus:tw:ring-2 focus:tw:ring-slate-500 focus:tw:border-transparent tw:transition-all"
                  placeholder="07xxxxxxxx"
                  required
                />
              </div>

              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-slate-700 tw:mb-2">
                  District <span className="tw:text-red-500">*</span>
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="tw:w-full tw:px-4 tw:py-3 tw:border tw:border-slate-300 tw:rounded-lg focus:tw:ring-2 focus:tw:ring-slate-500 focus:tw:border-transparent tw:transition-all"
                  required
                >
                  <option value="">Select District</option>
                  {sriLankanDistricts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-slate-700 tw:mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="tw:w-full tw:px-4 tw:py-3 tw:border tw:border-slate-300 tw:rounded-lg focus:tw:ring-2 focus:tw:ring-slate-500 focus:tw:border-transparent tw:transition-all"
                  placeholder="e.g., Akuressa, Ihala Bope, Yatiyana"
                />
              </div>

              <div className="md:tw:col-span-2">
                <label className="tw:block tw:text-sm tw:font-medium tw:text-slate-700 tw:mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="tw:w-full tw:px-4 tw:py-3 tw:border tw:border-slate-300 tw:rounded-lg focus:tw:ring-2 focus:tw:ring-slate-500 focus:tw:border-transparent tw:transition-all"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
          </div>

          
          <div className="tw:p-8 tw:border-b tw:border-slate-200">
            <div className="tw:flex tw:items-center tw:gap-2 tw:mb-6">
              <div className="tw:bg-slate-600 tw:p-2 tw:rounded-lg">
                <svg className="tw:w-5 tw:h-5 tw:text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                  {/* <path d="M3 4a1 1 0 00-1 1v1a1 1 0 001 1h1l1.68 5.39A3 3 0 008.49 15H15a1 1 0 000-2H8.49a1 1 0 01-.96-.73L6.9 11h8.1a1 1 0 00.96-.73l1.5-6A1 1 0 0016.5 3H4.72L4.22 1.39A1 1 0 003.28 1H2a1 1 0 000 2h.72L3 4z"/> */}
                </svg>
              </div>
              <h2 className="tw:text-xl tw:font-semibold tw:text-slate-700">Vehicle Information</h2>
            </div>

            <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 lg:tw:grid-cols-3 tw:gap-6">
              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-slate-700 tw:mb-2">
                  Vehicle Type <span className="tw:text-red-500">*</span>
                </label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  className="tw:w-full tw:px-4 tw:py-3 tw:border tw:border-slate-300 tw:rounded-lg focus:tw:ring-2 focus:tw:ring-slate-500 focus:tw:border-transparent tw:transition-all"
                  required
                >
                  <option value="">Select Type</option>
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-slate-700 tw:mb-2">
                  Condition <span className="tw:text-red-500">*</span>
                </label>
                <div className="tw:space-y-2">
                  {['Brand New', 'Used', 'Reconditioned'].map(condition => (
                    <label key={condition} className="tw:flex tw:items-center">
                      <input
                        type="radio"
                        name="condition"
                        value={condition}
                        checked={formData.condition === condition}
                        onChange={handleInputChange}
                        className="tw:mr-2 tw:text-slate-600 focus:tw:ring-slate-500"
                        required
                      />
                      <span className="tw:text-sm tw:text-slate-700">{condition}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-slate-700 tw:mb-2">
                  Vehicle Make <span className="tw:text-red-500">*</span>
                </label>
                <select
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  className="tw:w-full tw:px-4 tw:py-3 tw:border tw:border-slate-300 tw:rounded-lg focus:tw:ring-2 focus:tw:ring-slate-500 focus:tw:border-transparent tw:transition-all"
                  required
                >
                  <option value="">Select Make</option>
                  {vehicleMakes.map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-slate-700 tw:mb-2">
                  Model <span className="tw:text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="tw:w-full tw:px-4 tw:py-3 tw:border tw:border-slate-300 tw:rounded-lg focus:tw:ring-2 focus:tw:ring-slate-500 focus:tw:border-transparent tw:transition-all"
                  placeholder="e.g., CLA180, Corolla, CT100"
                  required
                />
              </div>

              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-slate-700 tw:mb-2">
                  Manufactured Year <span className="tw:text-red-500">*</span>
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="tw:w-full tw:px-4 tw:py-3 tw:border tw:border-slate-300 tw:rounded-lg focus:tw:ring-2 focus:tw:ring-slate-500 focus:tw:border-transparent tw:transition-all"
                  required
                >
                  <option value="">Select Year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-slate-700 tw:mb-2">Price (Rs.)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="tw:w-full tw:px-4 tw:py-3 tw:border tw:border-slate-300 tw:rounded-lg focus:tw:ring-2 focus:tw:ring-slate-500 focus:tw:border-transparent tw:transition-all"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="tw:flex tw:items-center">
                <label className="tw:flex tw:items-center">
                  <input
                    type="checkbox"
                    name="ongoingLease"
                    checked={formData.ongoingLease}
                    onChange={handleInputChange}
                    className="tw:mr-2 tw:text-slate-600 focus:tw:ring-slate-500"
                  />
                  <span className="tw:text-sm tw:text-slate-700">Ongoing Lease</span>
                </label>
              </div>

              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-slate-700 tw:mb-2">
                  Transmission <span className="tw:text-red-500">*</span>
                </label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                  className="tw:w-full tw:px-4 tw:py-3 tw:border tw:border-slate-300 tw:rounded-lg focus:tw:ring-2 focus:tw:ring-slate-500 focus:tw:border-transparent tw:transition-all"
                  required
                >
                  <option value="">Select Transmission</option>
                  {['Manual', 'Automatic', 'Triptonic', 'Other'].map(trans => (
                    <option key={trans} value={trans}>{trans}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-slate-700 tw:mb-2">
                  Fuel Type <span className="tw:text-red-500">*</span>
                </label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  className="tw:w-full tw:px-4 tw:py-3 tw:border tw:border-slate-300 tw:rounded-lg focus:tw:ring-2 focus:tw:ring-slate-500 focus:tw:border-transparent tw:transition-all"
                  required
                >
                  <option value="">Select Fuel Type</option>
                  {['Petrol', 'Diesel', 'Hybrid', 'Electric', 'CNG'].map(fuel => (
                    <option key={fuel} value={fuel}>{fuel}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-slate-700 tw:mb-2">Engine Capacity (cc)</label>
                <input
                  type="number"
                  name="engineCapacity"
                  value={formData.engineCapacity}
                  onChange={handleInputChange}
                  className="tw:w-full tw:px-4 tw:py-3 tw:border tw:border-slate-300 tw:rounded-lg focus:tw:ring-2 focus:tw:ring-slate-500 focus:tw:border-transparent tw:transition-all"
                  placeholder="1500"
                  min="1"
                  max="10000"
                />
              </div>

              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-slate-700 tw:mb-2">
                  Mileage (km) <span className="tw:text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  className="tw:w-full tw:px-4 tw:py-3 tw:border tw:border-slate-300 tw:rounded-lg focus:tw:ring-2 focus:tw:ring-slate-500 focus:tw:border-transparent tw:transition-all"
                  placeholder="45000"
                  min="0"
                  max="1000000"
                  required
                />
              </div>
            </div>

            <div className="tw:mt-6">
              <label className="tw:block tw:text-sm tw:font-medium tw:text-slate-700 tw:mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                maxLength="5000"
                className="tw:w-full tw:px-4 tw:py-3 tw:border tw:border-slate-300 tw:rounded-lg focus:tw:ring-2 focus:tw:ring-slate-500 focus:tw:border-transparent tw:transition-all tw:resize-none"
                placeholder="Describe your vehicle's features, condition and any additional information..."
              />
              <div className="tw:text-right tw:text-sm tw:text-slate-500 tw:mt-1">
                {formData.description.length}/5000 characters
              </div>
            </div>
          </div>

          
          <div className="tw:p-8 tw:border-b tw:border-slate-200">
            <div className="tw:flex tw:items-center tw:gap-2 tw:mb-6">
              <div className="tw:bg-slate-600 tw:p-2 tw:rounded-lg">
                <Camera className="tw:w-5 tw:h-5 tw:text-white" />
              </div>
              <h2 className="tw:text-xl tw:font-semibold tw:text-slate-700">Vehicle Photos</h2>
            </div>

            <div className="tw:grid tw:grid-cols-2 md:tw:grid-cols-3 tw:gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="tw:relative">
                  {photo ? (
                    <div className="tw:relative tw:group">
                      <img
                        src={photo}
                        alt={`Vehicle photo ${index + 1}`}
                        className="tw:w-full tw:h-32 tw:object-cover tw:rounded-lg tw:border-2 tw:border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="tw:absolute tw:top-2 tw:right-2 tw:bg-red-500 tw:text-white tw:rounded-full tw:p-1 tw:opacity-0 group-hover:tw:opacity-100 tw:transition-opacity"
                      >
                        <X className="tw:w-4 tw:h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:w-full tw:h-32 tw:border-2 tw:border-dashed tw:border-slate-300 tw:rounded-lg tw:cursor-pointer hover:tw:border-slate-400 tw:transition-colors">
                      <Camera className="tw:w-8 tw:h-8 tw:text-slate-400 tw:mb-2" />
                      <span className="tw:text-sm tw:text-slate-500">Add Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(index, e)}
                        className="tw:hidden"
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          
          <div className="tw:p-8 tw:flex tw:flex-col sm:tw:flex-row tw:gap-4 tw:justify-end">
            <button
              type="button"
              onClick={handleDiscard}
              className="tw:px-8 tw:py-3 tw:border tw:border-slate-300 tw:text-slate-700 tw:rounded-lg hover:tw:bg-slate-50 tw:transition-colors tw:font-medium"
            >
              Discard
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="tw:px-8 tw:py-3 tw:bg-gradient-to-r tw:from-slate-600 tw:to-slate-700 tw:text-white tw:rounded-lg hover:tw:from-slate-700 hover:tw:to-slate-800 tw:transition-all tw:font-medium tw:shadow-lg"
            >
              List Vehicle
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SellVehicleForm;