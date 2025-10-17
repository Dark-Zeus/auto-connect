import React, { useState, useRef, useEffect, useContext } from 'react';
import { Camera, X , CarFront, User, Logs, ClipboardCheckIcon, Clipboard} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import listVehicleAPI from '../../services/listVehicleApiService';
import userApiService from '../../services/userApiService';
import { UserContext } from "../../contexts/UserContext";
import { toast } from "react-toastify";

const VehicleListingForm = ({ fixedName, fixedEmail, userId, onSubmit }) => {
  const [formData, setFormData] = useState({
    mobile: '',
    district: '',
    city: '',
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
    description: '',
    // registrationNumber: '',
    name: fixedName || '',
    email: fixedEmail || ''
  });

  const [photos, setPhotos] = useState(Array(6).fill(null));
  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { userContext: user } = useContext(UserContext);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: fixedName || "",
      email: fixedEmail || ""
    }));
  }, [fixedName, fixedEmail]);

  const handleSnackbarClose = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }
  setSnackbarOpen(false);
  
  // If this was a success message, navigate after closing
  if (snackbarSeverity === "success") {
    navigate('/marketplace/my-ads');
  }
};

  const sriLankanDistricts = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha',
    'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala',
    'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa',
    'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
  ];

  const vehicleTypes = [
    'Car', 'Van', 'SUV', 'Crew Cab', 'Pickup/Double Cab', 'Bus', 'Lorry/Tipper',
    'Tractor', 'Threewheel', 'Heavyduty', 'Other', 'Motorcycle'
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

  const fieldRefs = {
    mobile: useRef(null),
    district: useRef(null),
    vehicleType: useRef(null),
    condition: useRef(null),
    make: useRef(null),
    model: useRef(null),
    year: useRef(null),
    transmission: useRef(null),
    fuelType: useRef(null),
    mileage: useRef(null),
    price: useRef(null),
    engineCapacity: useRef(null)
  };

  const validateForm = () => {
    const newErrors = {};
    let firstErrorField = null;

    // Required fields validation
    const requiredFields = ['mobile', 'district', 'vehicleType', 'condition', 'make', 'model', 'year', 'transmission', 'fuelType', 'mileage'];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        if (!firstErrorField) firstErrorField = field;
      }
    });

    // Mobile phone validation
    if (formData.mobile && !/^07[0-9]{8}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must start with 07 and be 10 digits';
      if (!firstErrorField) firstErrorField = 'mobile';
    }

    // Engine capacity validation
    if (formData.engineCapacity && (formData.engineCapacity < 1 || formData.engineCapacity > 10000)) {
      newErrors.engineCapacity = 'Engine capacity must be between 1 and 10000 cc';
      if (!firstErrorField) firstErrorField = 'engineCapacity';
    }

    // Mileage validation
    if (formData.mileage && (formData.mileage < 0 || formData.mileage > 1000000)) {
      newErrors.mileage = 'Mileage must be between 0 and 1000000 km';
      if (!firstErrorField) firstErrorField = 'mileage';
    }

    // Price validation
    if (formData.price && (formData.price < 0 || formData.price > 9990000000)) {
      newErrors.price = 'Price must be between 0 and 9990000000 LKR';
      if (!firstErrorField) firstErrorField = 'price';
    }

    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, firstErrorField };
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run existing validateForm (must already be defined in this component)
    if (typeof validateForm === "function") {
      const { isValid, firstErrorField } = validateForm();
      if (!isValid) {
        if (firstErrorField && fieldRefs[firstErrorField]?.current) {
          fieldRefs[firstErrorField].current.scrollIntoView({ behavior: "smooth", block: "center" });
          fieldRefs[firstErrorField].current.focus();
        }
        return;
      }
    }

    setPaymentProcessing(true);
    try {
      const payload = {
        ...formData,
        userId,
        photos: photos.filter(Boolean),
      };
      // Save for PaymentSuccessPage
      localStorage.setItem("pendingVehicleData", JSON.stringify(payload));

      if (typeof onSubmit !== "function") {
        console.error("onSubmit prop missing");
        return;
      }
      await onSubmit(payload);
    } catch (err) {
      console.error("Submit listing error:", err);
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleDiscard = () => {
    setFormData({
      mobile: '',
      district: '',
      city: '',
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
      description: '',
      // registrationNumber: ''
    });
    setPhotos(Array(6).fill(null));
    setErrors({});
  };

  return (
    <div className="tw:min-h-screen tw:bg-transparent tw:py-8 tw:px-4">
      <Snackbar
      open={snackbarOpen}
      autoHideDuration={4000}
      onClose={handleSnackbarClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={handleSnackbarClose}
        severity={snackbarSeverity}
        variant="filled"
        className="tw:w-full"
      >
        {snackbarMessage}
      </Alert>
    </Snackbar>

      <div className="tw:max-w-4xl tw:mx-auto">
        {/* Header */}
        <div className="tw:bg-gradient-to-r tw:bg-[linear-gradient(135deg,var(--sky-blue),var(--navy-blue))]  tw:text-white tw:p-8 tw:rounded-t-xl tw:shadow-lg">
          <div className="tw:flex tw:items-center tw:gap-3">
            <div className="tw:bg-slate-600 tw:p-2 tw:rounded-lg">
              <CarFront className="tw:w-6 tw:h-6 tw:text-white" />
            </div>
            <div>
              <h1 className="tw:text-3xl tw:font-bold">List Your Vehicle</h1>
              <p className="tw:text-slate-200 tw:mt-1">Items marked with * are required.</p>
            </div>
          </div>
        </div>

        <form className="tw:bg-white tw:rounded-b-xl tw:shadow-lg" onSubmit={handleSubmit}>
          
          {/* Vehicle Information */}
          <div className="tw:p-8 tw:border-b tw:border-slate-200">
            <div className="tw:flex tw:items-center tw:gap-2 tw:mb-6">
              <div className="tw:bg-slate-600 tw:p-2 tw:rounded-lg">
                <Logs className="tw:w-5 tw:h-5 tw:text-white" />
              </div>
              <h2 className="tw:text-xl tw:font-semibold tw:text-slate-700">Vehicle Information</h2>
            </div>

            <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 lg:tw:grid-cols-3 tw:gap-6">
              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-slate-700 tw:mb-2">
                  Vehicle Type <span className="tw:text-red-500">*</span>
                </label>
                <select
                  ref={fieldRefs.vehicleType}
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  className={`tw:w-full tw:text-black tw:px-4 tw:py-3 tw:border ${errors.vehicleType ? 'tw:border-black' : 'tw:border-slate-300'} tw:rounded-lg focus:tw:ring-2 focus:tw:ring-slate-500 focus:tw:border-transparent tw:transition-all`}
                  required
                >
                  <option value="">Select Type</option>
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.vehicleType && <p className="tw:text-red-500 tw:text-sm tw:mt-1">{errors.vehicleType}</p>}
              </div>

              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-slate-700 tw:mb-2">
                  Condition <span className="tw:text-red-500">*</span>
                </label>
                <div className="tw:space-y-2">
                  {['Brand New', 'Used', 'Reconditioned'].map(condition => (
                    <label key={condition} className="tw:flex tw:items-center">
                      <input
                        ref={fieldRefs.condition}
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
                {errors.condition && <p className="tw:text-red-500 tw:text-sm tw:mt-1">{errors.condition}</p>}
              </div>

              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-slate-700 tw:mb-2">
                  Vehicle Make <span className="tw:text-red-500">*</span>
                </label>
                <select
                  ref={fieldRefs.make}
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  className={`tw:text-black tw:w-full tw:px-4 tw:py-3 tw:border ${errors.make ? 'tw:border-red-500' : 'tw:border-slate-300'} tw:rounded-lg focus:tw:ring-2 focus:tw:ring-slate-500 focus:tw:border-transparent tw:transition-all`}
                  required
                >
                  <option value="">Select Make</option>
                  {vehicleMakes.map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
                {errors.make && <p className="tw:text-red-500 tw:text-sm tw:mt-1">{errors.make}</p>}
              </div>

              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-slate-700 tw:mb-2">
                  Model <span className="tw:text-red-500">*</span>
                </label>
                <input
                  ref={fieldRefs.model}
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className={`tw:text-black tw:w-full tw:px-4 tw:py-3 tw:border ${errors.model ? 'tw:border-red-500' : 'tw:border-slate-300'} tw:rounded-lg focus:tw:ring-2 focus:tw:ring-slate-500 focus:tw:border-transparent tw:transition-all`}
                  placeholder="e.g., CLA180, Corolla, CT100"
                  required
                />
                {errors.model && <p className="tw:text-red-500 tw:text-sm tw:mt-1">{errors.model}</p>}
              </div>

              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-slate-700 tw:mb-2">
                  Manufactured Year <span className="tw:text-red-500">*</span>
                </label>
                <select
                  ref={fieldRefs.year}
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className={`tw:text-black tw:w-full tw:px-4 tw:py-3 tw:border ${errors.year ? 'tw:border-red-500' : 'tw:border-slate-300'} tw:rounded-lg focus:tw:ring-2 focus:tw:ring-slate-500 focus:tw:border-transparent tw:transition-all`}
                  required
                >
                  <option value="">Select Year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                {errors.year && <p className="tw:text-red-500 tw:text-sm tw:mt-1">{errors.year}</p>}
              </div>

              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-slate-700 tw:mb-2">Price (Rs.)</label>
                <input
                  ref={fieldRefs.price}
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`tw:text-black tw:w-full tw:px-4 tw:py-3 tw:border ${errors.price ? 'tw:border-red-500' : 'tw:border-slate-300'} tw:rounded-lg focus:tw:ring-2 focus:tw:ring-slate-500 focus:tw:border-transparent tw:transition-all`}
                  placeholder="0"
                  min="0"
                />
                {errors.price && <p className="tw:text-red-500 tw:text-sm tw:mt-1">{errors.price}</p>}
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
                  ref={fieldRefs.transmission}
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                  className={`tw:text-black tw:w-full tw:px-4 tw:py-3 tw:border ${errors.transmission ? 'tw:border-red-500' : 'tw:border-slate-300'} tw:rounded-lg focus:tw:ring-2 focus:tw:ring-slate-500 focus:tw:border-transparent tw:transition-all`}
                  required
                >
                  <option value="">Select Transmission</option>
                  {['Manual', 'Automatic', 'Triptonic', 'Other'].map(trans => (
                    <option key={trans} value={trans}>{trans}</option>
                  ))}
                </select>
                {errors.transmission && <p className="tw:text-red-500 tw:text-sm tw:mt-1">{errors.transmission}</p>}
              </div>

              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-slate-700 tw:mb-2">
                  Fuel Type <span className="tw:text-red-500">*</span>
                </label>
                <select
                  ref={fieldRefs.fuelType}
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  className={`tw:text-black tw:w-full tw:px-4 tw:py-3 tw:border ${errors.fuelType ? 'tw:border-red-500' : 'tw:border-slate-300'} tw:rounded-lg focus:tw:ring-2 focus:tw:ring-slate-500 focus:tw:border-transparent tw:transition-all`}
                  required
                >
                  <option value="">Select Fuel Type</option>
                  {['Petrol', 'Diesel', 'Hybrid', 'Electric', 'CNG'].map(fuel => (
                    <option key={fuel} value={fuel}>{fuel}</option>
                  ))}
                </select>
                {errors.fuelType && <p className="tw:text-red-500 tw:text-sm tw:mt-1">{errors.fuelType}</p>}
              </div>

              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-slate-700 tw:mb-2">Engine Capacity (cc)</label>
                <input
                  ref={fieldRefs.engineCapacity}
                  type="number"
                  name="engineCapacity"
                  value={formData.engineCapacity}
                  onChange={handleInputChange}
                  className={`tw:text-black tw:w-full tw:px-4 tw:py-3 tw:border ${errors.engineCapacity ? 'tw:border-red-500' : 'tw:border-slate-300'} tw:rounded-lg focus:tw:ring-2 focus:tw:ring-slate-500 focus:tw:border-transparent tw:transition-all`}
                  placeholder="1500"
                  min="1"
                  max="10000"
                />
                {errors.engineCapacity && <p className="tw:text-red-500 tw:text-sm tw:mt-1">{errors.engineCapacity}</p>}
              </div>

              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-slate-700 tw:mb-2">
                  Mileage (km) <span className="tw:text-red-500">*</span>
                </label>
                <input
                  ref={fieldRefs.mileage}
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  className={`tw:text-black tw:w-full tw:px-4 tw:py-3 tw:border ${errors.mileage ? 'tw:border-red-500' : 'tw:border-slate-300'} tw:rounded-lg focus:tw:ring-2 focus:tw:ring-slate-500 focus:tw:border-transparent tw:transition-all`}
                  placeholder="45000"
                  min="0"
                  max="1000000"
                  required
                />
                {errors.mileage && <p className="tw:text-red-500 tw:text-sm tw:mt-1">{errors.mileage}</p>}
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
                className="tw:text-black tw:w-full tw:px-4 tw:py-3 tw:border tw:border-slate-300 tw:rounded-lg focus:tw:ring-2 focus:tw:ring-slate-500 focus:tw:border-transparent tw:transition-all tw:resize-none"
                placeholder="Describe your vehicle's features, condition and any additional information..."
              />
              <div className="tw:text-right tw:text-sm tw:text-slate-500 tw:mt-1">
                {formData.description.length}/5000 characters
              </ div>
            </div>
          </div>

          {/* Vehicle Report */}
          {/* <div className="tw:p-8 tw:border-b tw:border-slate-200">
            <div className="tw:flex tw:items-center tw:gap-2 tw:mb-6">
              <div className="tw:bg-slate-600 tw:p-2 tw:rounded-lg">
                <ClipboardCheckIcon className="tw:w-5 tw:h-5 tw:text-white" />
              </div>
              <h2 className="tw:text-xl tw:font-semibold tw:text-slate-700">Vehicle Report</h2>
            </div>
              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-slate-700 tw:mb-2">
                  Vehicle Registration Number <span className="tw:text-red-500">*</span>
                </label>
                <input
                  ref={fieldRefs.registrationNumber}
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  className={`tw:text-black tw:w-full tw:px-4 tw:py-3 tw:border ${errors.registrationNumber ? 'tw:border-red-500' : 'tw:border-slate-300'} tw:rounded-lg focus:tw:ring-2 focus:tw:ring-slate-500 focus:tw:border-transparent tw:transition-all`}
                  placeholder="e.g., CAAXXXX, 300XXX, 17XXXX"
                  required
                />
                {errors.registrationNumber && <p className="tw:text-red-500 tw:text-sm tw:mt-1">{errors.registrationNumber}</p>}
              </div>
          </div> */}

          {/* Photos */}
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
                        className="tw:absolute tw:top-2 tw:right-2 tw:bg-gray-500 tw:text-white tw:rounded-full tw:p-1 tw:hover:cursor-pointer tw:transition-all"
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

          {/* Contact Information */}
          <div className="tw:p-8 tw:border-b tw:border-slate-200">
            <div className="tw:flex tw:items-center tw:gap-2 tw:mb-6">
              <div className="tw:bg-slate-600 tw:p-2 tw:rounded-lg">
                <User className="tw:w-5 tw:h-5 tw:text-white" />
              </div>
              <h2 className="tw:text-xl tw:font-semibold tw:text-slate-700">Contact Information</h2>
            </div>

            <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-6">
              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-slate-700 tw:mb-2">
                  Name
                </label>
                <input 
                  className="tw:w-full tw:px-4 tw:py-3 tw:bg-slate-100 tw:rounded-lg tw:text-slate-700"
                  type="text"
                  value={formData.name}
                  placeholder={isLoading ? 'Loading...' : ''}
                  readOnly
                />
              </div>

              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-slate-700 tw:mb-2">
                  Mobile Phone <span className="tw:text-red-500">*</span>
                </label>
                <input
                  ref={fieldRefs.mobile}
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className={`tw:text-black tw:w-full tw:px-4 tw:py-3 tw:border ${errors.mobile ? 'tw:border-red-500' : 'tw:border-slate-300'} tw:rounded-lg focus:tw:ring-2 focus:tw:ring-slate-500 focus:tw:border-transparent tw:transition-all`}
                  placeholder="07xxxxxxxx"
                  required
                />
                {errors.mobile && <p className="tw:text-red-500 tw:text-sm tw:mt-1">{errors.mobile}</p>}
              </div>

              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-slate-700 tw:mb-2">
                  District <span className="tw:text-red-500">*</span>
                </label>
                <select
                  ref={fieldRefs.district}
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className={`tw:text-black tw:w-full tw:px-4 tw:py-3 tw:border ${errors.district ? 'tw:border-red-500' : 'tw:border-slate-300'} tw:rounded-lg focus:tw:ring-2 focus:tw:ring-slate-500 focus:tw:border-transparent tw:transition-all`}
                  required
                >
                  <option value="">Select District</option>
                  {sriLankanDistricts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                {errors.district && <p className="tw:text-red-500 tw:text-sm tw:mt-1">{errors.district}</p>}
              </div>

              <div>
                <label className="tw:block tw:text-sm tw:font-medium tw:text-slate-700 tw:mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="tw:text-black tw:w-full tw:px-4 tw:py-3 tw:border tw:border-slate-300 tw:rounded-lg focus:tw:ring-2 focus:tw:ring-slate-500 focus:tw:border-transparent tw:transition-all"
                  placeholder="e.g., Akuressa, Ihala Bope, Yatiyana"
                />
              </div>

              <div className="md:tw:col-span-2">
                <label className="tw:block tw:text-sm tw:font-medium tw:text-slate-700 tw:mb-2">Email</label>
                <input 
                  className="tw:w-full tw:px-4 tw:py-3 tw:bg-slate-100 tw:rounded-lg tw:text-slate-700"
                  type="email"
                  value={formData.email}
                  placeholder={isLoading ? 'Loading...' : ''}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="tw:p-8 tw:flex tw:flex-col sm:tw:flex-row tw:gap-4 tw:justify-end">
            <button
              type="button"
              onClick={handleDiscard}
              className="tw:px-8 tw:py-3 tw:border tw:bg-red-700 tw:text-white tw:border-slate-300 tw:rounded-lg tw:hover:bg-red-800 tw:transition-colors tw:font-medium tw:cursor-pointer"
              //disabled={Object.values(formData).every(val => !val) && photos.every(photo => !photo)}
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={paymentProcessing}
              className="tw:px-8 tw:py-3 tw:bg-blue-600 tw:text-white tw:rounded-lg tw:hover:bg-blue-800 tw:transition-all tw:font-medium tw:shadow-lg tw:cursor-pointer"
            >
              {paymentProcessing ? "Processing..." : "Submit Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleListingForm;