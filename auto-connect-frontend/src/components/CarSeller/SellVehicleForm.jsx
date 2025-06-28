import React, { useState } from 'react';
import { 
  TextField, Select, MenuItem, FormControl, InputLabel, 
  FormControlLabel, Radio, RadioGroup, Checkbox, Button, 
  Box, Grid, Typography, Paper, InputAdornment,
  FormHelperText, Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Camera, X } from 'lucide-react';

// Custom styled components to match the original design
const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '1.5rem',
}));

const IconBox = styled(Box)(({ theme, bgcolor = theme.palette.grey[700] }) => ({
  backgroundColor: bgcolor,
  padding: '0.5rem',
  borderRadius: '0.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
}));

const HeaderWrapper = styled(Box)(({ theme }) => ({
  background: `linear-gradient(to right, ${theme.palette.grey[700]}, ${theme.palette.grey[800]})`,
  color: 'white',
  padding: '2rem',
  borderTopLeftRadius: '0.75rem',
  borderTopRightRadius: '0.75rem',
  boxShadow: theme.shadows[4],
}));

const FormSectionWrapper = styled(Box)(({ theme }) => ({
  padding: '2rem',
  borderBottom: `1px solid ${theme.palette.grey[200]}`,
}));


const PhotoUploadLabel = styled('label')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '8rem',
  border: `2px dashed ${theme.palette.grey[300]}`,
  borderRadius: '0.5rem',
  cursor: 'pointer',
  transition: 'border-color 0.2s',
  '&:hover': {
    borderColor: theme.palette.grey[400],
  },
}));

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
    'Car', 'Van', 'Suv', 'Crew Cab', 'Pickup/Double Cab', 'Bus', 'Lorry/Tipper', 
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
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: '800px', mx: 'auto', mt: 4, mb: 6}}>
      <Box sx={{ width: '100%' }}>
        
        <HeaderWrapper>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <IconBox bgcolor="#ef4444">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
            </IconBox>
            <Box>
              <Typography variant="h4" fontWeight="700">List Your Vehicle</Typography>
              <Typography variant="subtitle1" color="rgba(255,255,255,0.8)" mt={0.5}>
                Items marked with * are required.
              </Typography>
            </Box>
          </Box>
        </HeaderWrapper>

        <Paper sx={{ borderBottomLeftRadius: '0.75rem', borderBottomRightRadius: '0.75rem', boxShadow: 4 }}>
          
          {/* Vehicle Information Section - Now First */}
          <FormSectionWrapper>
            <SectionHeader>
              <IconBox>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
              </IconBox>
              <Typography variant="h6" fontWeight="600" color="text.primary">
                Vehicle Information
              </Typography>
            </SectionHeader>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControl fullWidth required>
                <InputLabel id="vehicle-type-label">Vehicle Type</InputLabel>
                <Select
                  labelId="vehicle-type-label"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  label="Vehicle Type"
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'black',
                    }
                  }}
                >
                  <MenuItem value=""><em>Select Type</em></MenuItem>
                  {vehicleTypes.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl component="fieldset" required>
                <Typography variant="body2" fontWeight="500" color="text.primary" gutterBottom>
                  Condition *
                </Typography>
                <RadioGroup
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                >
                  {['Brand New', 'Used', 'Reconditioned'].map(condition => (
                    <FormControlLabel 
                      key={condition} 
                      value={condition} 
                      control={<Radio sx={{ '&.Mui-checked': { color: 'black' } }} />} 
                      label={condition} 
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              <FormControl fullWidth required>
                <InputLabel id="make-label">Vehicle Make</InputLabel>
                <Select
                  labelId="make-label"
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  label="Vehicle Make"
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'black',
                    }
                  }}
                >
                  <MenuItem value=""><em>Select Make</em></MenuItem>
                  {vehicleMakes.map(make => (
                    <MenuItem key={make} value={make}>{make}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                required
                label="Model"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                placeholder="e.g., CLA180, Corolla, CT100"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'black',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'black',
                  }
                }}
              />

              <FormControl fullWidth required>
                <InputLabel id="year-label">Manufactured Year</InputLabel>
                <Select
                  labelId="year-label"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  label="Manufactured Year"
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'black',
                    }
                  }}
                >
                  <MenuItem value=""><em>Select Year</em></MenuItem>
                  {years.map(year => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Price (Rs.)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0"
                inputProps={{ min: "0" }}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'black',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'black',
                  }
                }}
              />

              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formData.ongoingLease} 
                    onChange={handleInputChange} 
                    name="ongoingLease" 
                    sx={{ '&.Mui-checked': { color: 'black' } }}
                  />
                }
                label="Ongoing Lease"
              />

              <FormControl fullWidth required>
                <InputLabel id="transmission-label">Transmission</InputLabel>
                <Select
                  labelId="transmission-label"
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                  label="Transmission"
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'black',
                    }
                  }}
                >
                  <MenuItem value=""><em>Select Transmission</em></MenuItem>
                  {['Manual', 'Automatic', 'Triptonic', 'Other'].map(trans => (
                    <MenuItem key={trans} value={trans}>{trans}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth required>
                <InputLabel id="fuel-type-label">Fuel Type</InputLabel>
                <Select
                  labelId="fuel-type-label"
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  label="Fuel Type"
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'black',
                    }
                  }}
                >
                  <MenuItem value=""><em>Select Fuel Type</em></MenuItem>
                  {['Petrol', 'Diesel', 'Hybrid', 'Electric', 'CNG'].map(fuel => (
                    <MenuItem key={fuel} value={fuel}>{fuel}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Engine Capacity (cc)"
                name="engineCapacity"
                type="number"
                value={formData.engineCapacity}
                onChange={handleInputChange}
                placeholder="1500"
                inputProps={{ min: "1", max: "10000" }}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'black',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'black',
                  }
                }}
              />

              <TextField
                fullWidth
                required
                label="Mileage (km)"
                name="mileage"
                type="number"
                value={formData.mileage}
                onChange={handleInputChange}
                placeholder="45000"
                inputProps={{ min: "0", max: "1000000" }}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'black',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'black',
                  }
                }}
              />

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your vehicle's features, condition and any additional information..."
                inputProps={{ maxLength: 5000 }}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'black',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'black',
                  }
                }}
              />
              <Typography variant="caption" color="text.secondary" align="right" sx={{ display: 'block', mt: 0.5 }}>
                {formData.description.length}/5000 characters
              </Typography>
            </Box>
          </FormSectionWrapper>

          {/* Vehicle Photos Section - Now Second */}
          <FormSectionWrapper>
            <SectionHeader>
              <IconBox>
                <Camera size={20} />
              </IconBox>
              <Typography variant="h6" fontWeight="600" color="text.primary">
                Vehicle Photos
              </Typography>
            </SectionHeader>

            <Grid container spacing={2}>
              {[0, 2, 4].map(rowStartIndex => (
                <Grid container item spacing={2} key={`row-${rowStartIndex}`}>
                  {[0, 1].map(colIndex => {
                    const photoIndex = rowStartIndex + colIndex;
                    return (
                      <Grid item xs={6} key={photoIndex}>
                        {photos[photoIndex] ? (
                          <Box sx={{ position: 'relative', '&:hover .removeBtn': { opacity: 1 } }}>
                            <Box
                              component="img"
                              src={photos[photoIndex]}
                              alt={`Vehicle photo ${photoIndex + 1}`}
                              sx={{
                                width: '100%',
                                height: '8rem',
                                objectFit: 'cover',
                                borderRadius: '0.5rem',
                                border: '2px solid',
                                borderColor: 'grey.200'
                              }}
                            />
                            <Button
                              className="removeBtn"
                              onClick={() => removePhoto(photoIndex)}
                              sx={{
                                position: 'absolute',
                                top: '0.5rem',
                                right: '0.5rem',
                                minWidth: 'unset',
                                p: '0.25rem',
                                bgcolor: 'error.main',
                                color: 'white',
                                borderRadius: '50%',
                                opacity: 0,
                                transition: 'opacity 0.2s',
                                '&:hover': {
                                  bgcolor: 'error.dark',
                                }
                              }}
                            >
                              <X size={16} />
                            </Button>
                          </Box>
                        ) : (
                          <PhotoUploadLabel>
                            <Camera size={32} color="#9ca3af" style={{ marginBottom: '0.5rem' }} />
                            <Typography variant="body2" color="text.secondary">Add Photo</Typography>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handlePhotoUpload(photoIndex, e)}
                              style={{ display: 'none' }}
                            />
                          </PhotoUploadLabel>
                        )}
                      </Grid>
                    );
                  })}
                </Grid>
              ))}
            </Grid>
          </FormSectionWrapper>
          
          {/* Contact Information Section - Now Last */}
          <FormSectionWrapper>
            <SectionHeader>
              <IconBox>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                </svg>
              </IconBox>
              <Typography variant="h6" fontWeight="600" color="text.primary">
                Contact Information
              </Typography>
            </SectionHeader>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                required
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your full name"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'black',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'black',
                  }
                }}
              />

              <TextField
                fullWidth
                required
                label="Mobile Phone"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder="07xxxxxxxx"
                inputProps={{ pattern: "07[0-9]{8}" }}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'black',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'black',
                  }
                }}
              />

              <FormControl fullWidth required>
                <InputLabel id="district-label">District</InputLabel>
                <Select
                  labelId="district-label"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  label="District"
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: formData.district ? 'rgba(0, 0, 0, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'black',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'black',
                    }
                  }}
                >
                  <MenuItem value=""><em>Select District</em></MenuItem>
                  {sriLankanDistricts.map(district => (
                    <MenuItem key={district} value={district}>{district}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="e.g., Akuressa, Ihala Bope, Yatiyana"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'black',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'black',
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'grey',
                    opacity: 0.7,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'black',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'black',
                  }
                }}
              />
            </Box>
          </FormSectionWrapper>

          <Box sx={{ p: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={handleDiscard}
              sx={{
                px: 5, 
                py: 1.5, 
                color: 'text.primary', 
                borderColor: 'grey.300',
                fontWeight: 500,
                boxShadow: 3,
                '&:hover': {
                  bgcolor: '#bd2115',
                  borderColor: 'grey.400',
                  color: 'white',
                }
              }}
            >
              Discard
            </Button>
            <Button
              type="submit"
              variant="contained"
              onClick={handleSubmit}
              sx={{
                px: 5, 
                py: 1.5, 
                background: 'linear-gradient(to right, #475569, #334155)',
                color: 'white',
                fontWeight: 500,
                boxShadow: 3,
                '&:hover': {
                  background: '#2563eb',
                }
              }}
            >
              List Vehicle
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default SellVehicleForm;