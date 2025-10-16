import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Button,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Container,
  IconButton,
  Tooltip,
  Badge,
  Avatar,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment
} from '@mui/material';
// Custom Timeline components using Material-UI
import {
  DirectionsCar as CarIcon,
  History as HistoryIcon,
  Build as BuildIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  Assignment as AssignmentIcon,
  AttachMoney as AttachMoneyIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
  Print as PrintIcon,
  Info as InfoIcon,
  Download as DownloadIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  Timeline as TimelineIcon,
  LocationOn as LocationOnIcon,
  Speed as SpeedIcon,
  LocalGasStation as LocalGasStationIcon,
  Settings as SettingsIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import vehicleHistoryAPI from "@services/vehicleHistoryApiService";

const VehicleHistoryPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleHistory, setVehicleHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load user's vehicles on component mount
  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const response = await vehicleHistoryAPI.getOwnerVehicles();
      setVehicles(response.data.vehicles);
    } catch (error) {
      setError("Failed to load vehicles. Please try again.");
      console.error("Error loading vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadVehicleHistory = async (vehicleId) => {
    try {
      setHistoryLoading(true);
      const response = await vehicleHistoryAPI.getVehicleCompleteHistory(vehicleId);
      setVehicleHistory(response.data);
    } catch (error) {
      setError("Failed to load vehicle history. Please try again.");
      console.error("Error loading vehicle history:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setVehicleHistory(null);
    loadVehicleHistory(vehicle.id);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return `LKR ${amount.toLocaleString()}`;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'COMPLETED': 'success',
      'IN_PROGRESS': 'warning',
      'CONFIRMED': 'info',
      'PENDING': 'default',
      'CANCELLED': 'error',
      'REJECTED': 'error'
    };
    return colorMap[status] || 'default';
  };

  const renderVehicleSelection = () => (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Header Section */}
      <Box sx={{
        textAlign: 'center',
        mb: 8,
        background: 'linear-gradient(135deg, #DFF2EB 0%, #B9E5E8 100%)',
        borderRadius: 4,
        py: 6,
        px: 4,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          bgcolor: '#7AB2D3',
          borderRadius: '50%',
          opacity: 0.1
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 120,
          height: 120,
          bgcolor: '#4A628A',
          borderRadius: '50%',
          opacity: 0.1
        }} />

        <Avatar
          sx={{
            width: 90,
            height: 90,
            bgcolor: '#4A628A',
            mx: 'auto',
            mb: 3,
            boxShadow: '0 8px 24px rgba(74, 98, 138, 0.2)'
          }}
        >
          <CarIcon sx={{ fontSize: 45, color: 'white' }} />
        </Avatar>

        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: '#2c3e50',
            mb: 2
          }}
        >
          My Vehicle Fleet
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: '#495057',
            maxWidth: 600,
            mx: 'auto',
            lineHeight: 1.6,
            mb: 4
          }}
        >
          Monitor your vehicles' complete lifecycle from registration to maintenance history
        </Typography>

        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          flexWrap: 'wrap'
        }}>
          <Chip
            icon={<CarIcon />}
            label={`${vehicles.length} Registered Vehicles`}
            sx={{
              bgcolor: '#ffffff',
              color: '#4A628A',
              fontWeight: 600,
              px: 2,
              py: 0.5,
              fontSize: '0.9rem',
              border: '2px solid #7AB2D3'
            }}
          />
          <Chip
            icon={<HistoryIcon />}
            label="Full Service History"
            sx={{
              bgcolor: '#27ae60',
              color: 'white',
              fontWeight: 600,
              px: 2,
              py: 0.5,
              fontSize: '0.9rem'
            }}
          />
        </Box>
      </Box>

      {/* Search Section */}
      <Box sx={{
        mb: 6,
        display: 'flex',
        justifyContent: 'center'
      }}>
        <TextField
          placeholder="Search by registration number, make, or model..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: { xs: '100%', md: 500 },
            '& .MuiOutlinedInput-root': {
              bgcolor: 'white',
              borderRadius: 3,
              '&:hover': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#7AB2D3'
                }
              },
              '&.Mui-focused': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4A628A',
                  borderWidth: 2
                }
              }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#7AB2D3' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Vehicle Cards Grid */}
      <Grid container spacing={3}>
        {vehicles
          .filter(vehicle =>
            searchTerm === '' ||
            vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((vehicle) => (
          <Grid item xs={12} sm={6} lg={4} key={vehicle.id}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid #f8f9fa',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 28px rgba(74, 98, 138, 0.15)',
                  borderColor: '#7AB2D3',
                  '& .vehicle-header': {
                    background: 'linear-gradient(135deg, #7AB2D3 0%, #4A628A 100%)',
                  },
                  '& .vehicle-icon': {
                    transform: 'scale(1.1)',
                  }
                }
              }}
              onClick={() => handleVehicleSelect(vehicle)}
            >
              {/* Vehicle Header */}
              <Box
                className="vehicle-header"
                sx={{
                  height: 120,
                  background: 'linear-gradient(135deg, #DFF2EB 0%, #B9E5E8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  transition: 'all 0.3s ease'
                }}
              >
                <CarIcon
                  className="vehicle-icon"
                  sx={{
                    fontSize: 48,
                    color: '#4A628A',
                    transition: 'transform 0.3s ease'
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    bgcolor: '#ffffff',
                    color: '#4A628A',
                    borderRadius: 2,
                    px: 1.5,
                    py: 0.5,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  {vehicle.year}
                </Box>
              </Box>

              <CardContent sx={{ p: 3 }}>
                {/* Registration Number */}
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: '#2c3e50',
                    mb: 1,
                    fontSize: '1.3rem'
                  }}
                >
                  {vehicle.registrationNumber}
                </Typography>

                {/* Vehicle Details */}
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#495057',
                    mb: 2.5,
                    fontWeight: 500
                  }}
                >
                  {vehicle.make} {vehicle.model}
                </Typography>

                <Stack spacing={1.5} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <SettingsIcon
                      sx={{
                        fontSize: 18,
                        color: '#7AB2D3'
                      }}
                    />
                    <Typography variant="body2" sx={{ color: '#6c757d', fontSize: '0.85rem' }}>
                      <strong>Engine:</strong> {vehicle.engineNumber}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <AssignmentIcon
                      sx={{
                        fontSize: 18,
                        color: '#7AB2D3'
                      }}
                    />
                    <Typography variant="body2" sx={{ color: '#6c757d', fontSize: '0.85rem' }}>
                      <strong>Chassis:</strong> {vehicle.chassisNumber}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CalendarIcon
                      sx={{
                        fontSize: 18,
                        color: '#7AB2D3'
                      }}
                    />
                    <Typography variant="body2" sx={{ color: '#6c757d', fontSize: '0.85rem' }}>
                      <strong>Registered:</strong> {formatDate(vehicle.registeredDate)}
                    </Typography>
                  </Box>
                </Stack>

                {/* Action Button */}
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<HistoryIcon />}
                  sx={{
                    bgcolor: '#4A628A',
                    color: 'white',
                    borderRadius: 2,
                    py: 1.2,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 4px 12px rgba(74, 98, 138, 0.3)',
                    '&:hover': {
                      bgcolor: '#7AB2D3',
                      boxShadow: '0 6px 16px rgba(74, 98, 138, 0.4)',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  View History
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {vehicles.length === 0 && (
        <Box sx={{
          textAlign: 'center',
          py: 8,
          px: 4,
          bgcolor: '#f8f9fa',
          borderRadius: 3,
          border: '2px dashed #B9E5E8'
        }}>
          <CarIcon sx={{
            fontSize: 80,
            color: '#7AB2D3',
            mb: 3,
            opacity: 0.7
          }} />
          <Typography variant="h5" sx={{
            color: '#495057',
            fontWeight: 600,
            mb: 2
          }}>
            No Vehicles Found
          </Typography>
          <Typography variant="body1" sx={{
            color: '#6c757d',
            maxWidth: 400,
            mx: 'auto',
            lineHeight: 1.6
          }}>
            You don't have any vehicles registered in the system yet. Register your first vehicle to start tracking its history.
          </Typography>
        </Box>
      )}
    </Container>
  );

  const getHistoryTypeIcon = (type) => {
    switch (type) {
      case 'registration':
        return <AssignmentIcon />;
      case 'service':
        return <BuildIcon />;
      case 'accident':
        return <WarningIcon />;
      default:
        return <HistoryIcon />;
    }
  };

  const getHistoryTypeColor = (type, status) => {
    switch (type) {
      case 'registration':
        return 'primary';
      case 'service':
        return status === 'COMPLETED' ? 'success' :
               status === 'IN_PROGRESS' ? 'warning' : 'info';
      case 'accident':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredHistory = vehicleHistory?.completeHistory?.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  }) || [];

  const renderVehicleHistory = () => {
    if (!vehicleHistory) return null;

    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{
          bgcolor: 'white',
          borderRadius: 3,
          p: 4,
          mb: 4,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #f8f9fa'
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <IconButton
                onClick={() => {
                  setSelectedVehicle(null);
                  setVehicleHistory(null);
                }}
                sx={{
                  bgcolor: '#DFF2EB',
                  color: '#4A628A',
                  width: 48,
                  height: 48,
                  '&:hover': {
                    bgcolor: '#B9E5E8',
                    transform: 'translateX(-2px)'
                  }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Box>
                <Typography variant="h4" sx={{
                  fontWeight: 700,
                  color: '#2c3e50',
                  mb: 1
                }}>
                  Vehicle History
                </Typography>
                <Typography variant="h6" sx={{
                  color: '#495057',
                  fontWeight: 500
                }}>
                  {vehicleHistory?.vehicle?.registrationNumber} • {vehicleHistory?.vehicle?.year} {vehicleHistory?.vehicle?.make} {vehicleHistory?.vehicle?.model}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Tooltip title="Print History">
                <IconButton sx={{
                  bgcolor: '#f8f9fa',
                  color: '#4A628A',
                  '&:hover': { bgcolor: '#DFF2EB' }
                }}>
                  <PrintIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export Data">
                <IconButton sx={{
                  bgcolor: '#f8f9fa',
                  color: '#4A628A',
                  '&:hover': { bgcolor: '#DFF2EB' }
                }}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        {/* Statistics Dashboard */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={8}>
            <Card sx={{
              background: 'linear-gradient(135deg, #4A628A 0%, #7AB2D3 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(74, 98, 138, 0.3)',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <Box sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                transform: 'translate(50%, -50%)'
              }} />
              <CardContent sx={{ p: 4, position: 'relative' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                  <Box sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: 3,
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CarIcon sx={{ fontSize: 48, color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{
                      fontWeight: 700,
                      mb: 0.5,
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}>
                      {vehicleHistory?.vehicle?.registrationNumber}
                    </Typography>
                    <Typography variant="h6" sx={{
                      opacity: 0.9,
                      fontWeight: 500,
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                    }}>
                      {vehicleHistory?.vehicle?.year} {vehicleHistory?.vehicle?.make} {vehicleHistory?.vehicle?.model}
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={4}>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{
                        fontWeight: 800,
                        mb: 1,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}>
                        {vehicleHistory?.statistics?.totalServices || 0}
                      </Typography>
                      <Typography variant="body1" sx={{
                        opacity: 0.9,
                        fontWeight: 500,
                        fontSize: '0.95rem'
                      }}>
                        Total Services
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{
                        fontWeight: 800,
                        mb: 1,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}>
                        {formatCurrency(vehicleHistory?.statistics?.totalServiceCost)}
                      </Typography>
                      <Typography variant="body1" sx={{
                        opacity: 0.9,
                        fontWeight: 500,
                        fontSize: '0.95rem'
                      }}>
                        Total Cost
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{
                        fontWeight: 800,
                        mb: 1,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}>
                        {formatCurrency(vehicleHistory?.statistics?.averageServiceCost)}
                      </Typography>
                      <Typography variant="body1" sx={{
                        opacity: 0.9,
                        fontWeight: 500,
                        fontSize: '0.95rem'
                      }}>
                        Average Cost
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{
                        fontWeight: 800,
                        mb: 1,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}>
                        {vehicleHistory?.statistics?.averageRating || 'N/A'}
                      </Typography>
                      <Typography variant="body1" sx={{
                        opacity: 0.9,
                        fontWeight: 500,
                        fontSize: '0.95rem'
                      }}>
                        Avg Rating
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{
              height: '100%',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #DFF2EB',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{
                  fontWeight: 700,
                  color: '#2c3e50',
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5
                }}>
                  <Box sx={{
                    bgcolor: '#DFF2EB',
                    borderRadius: 2,
                    p: 1,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <InfoIcon sx={{ color: '#4A628A', fontSize: 20 }} />
                  </Box>
                  Vehicle Details
                </Typography>
                <Stack spacing={2.5}>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1,
                    borderBottom: '1px solid #f8f9fa'
                  }}>
                    <Typography variant="body2" sx={{
                      color: '#6c757d',
                      fontWeight: 500,
                      fontSize: '0.9rem'
                    }}>
                      Engine Number:
                    </Typography>
                    <Typography variant="body2" sx={{
                      color: '#2c3e50',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}>
                      {vehicleHistory?.vehicle?.engineNumber}
                    </Typography>
                  </Box>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1,
                    borderBottom: '1px solid #f8f9fa'
                  }}>
                    <Typography variant="body2" sx={{
                      color: '#6c757d',
                      fontWeight: 500,
                      fontSize: '0.9rem'
                    }}>
                      Chassis Number:
                    </Typography>
                    <Typography variant="body2" sx={{
                      color: '#2c3e50',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}>
                      {vehicleHistory?.vehicle?.chassisNumber}
                    </Typography>
                  </Box>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1
                  }}>
                    <Typography variant="body2" sx={{
                      color: '#6c757d',
                      fontWeight: 500,
                      fontSize: '0.9rem'
                    }}>
                      Last Service:
                    </Typography>
                    <Typography variant="body2" sx={{
                      color: '#2c3e50',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}>
                      {formatDate(vehicleHistory?.statistics?.lastServiceDate)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filter and Statistics Section */}
        <Box sx={{
          bgcolor: 'white',
          borderRadius: 3,
          p: 4,
          mb: 5,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #DFF2EB'
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            mb: 4
          }}>
            <Box>
              <Typography variant="h6" sx={{
                fontWeight: 700,
                color: '#2c3e50',
                mb: 1
              }}>
                Activity Filters
              </Typography>
              <Typography variant="body2" sx={{
                color: '#6c757d'
              }}>
                Filter and view your vehicle's complete activity history
              </Typography>
            </Box>

            <FormControl sx={{
              minWidth: 220,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#7AB2D3'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4A628A'
                }
              }
            }}>
              <InputLabel sx={{ color: '#6c757d' }}>Filter by Type</InputLabel>
              <Select
                value={filterType}
                label="Filter by Type"
                onChange={(e) => setFilterType(e.target.value)}
                sx={{
                  color: '#2c3e50',
                  fontWeight: 500
                }}
              >
                <MenuItem value="all">All Activities</MenuItem>
                <MenuItem value="registration">Registration</MenuItem>
                <MenuItem value="service">Services</MenuItem>
                <MenuItem value="accident">Accidents</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: { xs: 'center', md: 'flex-start' }
          }}>
            <Chip
              icon={<AssignmentIcon />}
              label={`${vehicleHistory?.completeHistory?.filter(h => h.type === 'registration').length || 0} Registration`}
              sx={{
                bgcolor: '#DFF2EB',
                color: '#4A628A',
                fontWeight: 600,
                fontSize: '0.85rem',
                '& .MuiChip-icon': {
                  color: '#4A628A'
                },
                '&:hover': {
                  bgcolor: '#B9E5E8',
                  transform: 'translateY(-1px)'
                }
              }}
            />
            <Chip
              icon={<BuildIcon />}
              label={`${vehicleHistory?.completeHistory?.filter(h => h.type === 'service').length || 0} Services`}
              sx={{
                bgcolor: '#e8f5e8',
                color: '#27ae60',
                fontWeight: 600,
                fontSize: '0.85rem',
                '& .MuiChip-icon': {
                  color: '#27ae60'
                },
                '&:hover': {
                  bgcolor: '#d4edda',
                  transform: 'translateY(-1px)'
                }
              }}
            />
            <Chip
              icon={<WarningIcon />}
              label={`${vehicleHistory?.completeHistory?.filter(h => h.type === 'accident').length || 0} Accidents`}
              sx={{
                bgcolor: '#ffeaa7',
                color: '#f39c12',
                fontWeight: 600,
                fontSize: '0.85rem',
                '& .MuiChip-icon': {
                  color: '#f39c12'
                },
                '&:hover': {
                  bgcolor: '#fdcb6e',
                  transform: 'translateY(-1px)'
                }
              }}
            />
          </Box>
        </Box>

        {/* Timeline Header */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          mb: 4,
          p: 3,
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          border: '1px solid #f8f9fa'
        }}>
          <Box sx={{
            bgcolor: 'linear-gradient(135deg, #DFF2EB 0%, #B9E5E8 100%)',
            borderRadius: 2,
            p: 2,
            display: 'flex',
            alignItems: 'center'
          }}>
            <TimelineIcon sx={{ color: '#4A628A', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{
              fontWeight: 700,
              color: '#2c3e50',
              mb: 0.5
            }}>
              Complete Activity Timeline
            </Typography>
            <Typography variant="body1" sx={{
              color: '#6c757d'
            }}>
              Chronological history of all vehicle activities and services
            </Typography>
          </Box>
        </Box>

        {/* Timeline Items */}
        <Box sx={{ position: 'relative', pl: { xs: 0, md: 2 } }}>
          {filteredHistory.map((historyItem, index) => (
            <Box key={historyItem.id} sx={{ position: 'relative', mb: 6 }}>
              {/* Timeline Connector */}
              {index < filteredHistory.length - 1 && (
                <Box
                  sx={{
                    position: 'absolute',
                    left: { xs: 20, md: 60 },
                    top: 100,
                    width: 3,
                    height: 140,
                    background: 'linear-gradient(180deg, #B9E5E8 0%, #DFF2EB 100%)',
                    borderRadius: 1.5,
                    zIndex: 0
                  }}
                />
              )}

              <Box sx={{
                display: 'flex',
                gap: { xs: 2, md: 4 },
                position: 'relative',
                zIndex: 1,
                flexDirection: { xs: 'column', md: 'row' }
              }}>
                {/* Date and Icon Section */}
                <Box sx={{
                  display: 'flex',
                  flexDirection: { xs: 'row', md: 'column' },
                  alignItems: 'center',
                  gap: { xs: 2, md: 1 },
                  minWidth: { xs: 'auto', md: 180 },
                  textAlign: { xs: 'left', md: 'center' }
                }}>
                  <Box sx={{
                    textAlign: { xs: 'left', md: 'center' },
                    mb: { xs: 0, md: 2 }
                  }}>
                    <Typography variant="h6" sx={{
                      fontWeight: 700,
                      color: '#2c3e50',
                      mb: 0.5
                    }}>
                      {formatDate(historyItem.date)}
                    </Typography>
                    <Typography variant="body2" sx={{
                      color: '#7AB2D3',
                      fontWeight: 500,
                      fontSize: '0.85rem'
                    }}>
                      {new Date(historyItem.date).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </Box>

                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: historyItem.type === 'registration' ? '#4A628A' :
                               historyItem.type === 'service' ? '#27ae60' :
                               historyItem.type === 'accident' ? '#f39c12' : '#7AB2D3',
                      border: '4px solid white',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                      }
                    }}
                  >
                    {getHistoryTypeIcon(historyItem.type)}
                  </Avatar>
                </Box>

                {/* Content Card */}
                <Box sx={{ flexGrow: 1 }}>
                  <Card sx={{
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '1px solid #f8f9fa',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden',
                    '&:hover': {
                      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                      transform: 'translateY(-3px)',
                      borderColor: '#B9E5E8'
                    }
                  }}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 3
                      }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h5" sx={{
                            fontWeight: 700,
                            color: '#2c3e50',
                            mb: 1.5,
                            lineHeight: 1.3
                          }}>
                            {historyItem.type === 'registration' && 'Vehicle Registration'}
                            {historyItem.type === 'service' && historyItem.description}
                            {historyItem.type === 'accident' && historyItem.description}
                          </Typography>

                          {historyItem.status && (
                            <Chip
                              label={historyItem.status}
                              sx={{
                                bgcolor: historyItem.status === 'COMPLETED' ? '#e8f5e8' :
                                        historyItem.status === 'IN_PROGRESS' ? '#ffeaa7' :
                                        historyItem.status === 'PENDING' ? '#E8F4FD' : '#f8f9fa',
                                color: historyItem.status === 'COMPLETED' ? '#27ae60' :
                                       historyItem.status === 'IN_PROGRESS' ? '#f39c12' :
                                       historyItem.status === 'PENDING' ? '#3498db' : '#6c757d',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                mb: 2
                              }}
                            />
                          )}
                        </Box>

                        {historyItem.cost > 0 && (
                          <Box sx={{
                            textAlign: 'right',
                            ml: 3,
                            bgcolor: '#DFF2EB',
                            borderRadius: 2,
                            p: 2,
                            minWidth: 120
                          }}>
                            <Typography variant="h5" sx={{
                              fontWeight: 700,
                              color: '#4A628A',
                              mb: 0.5
                            }}>
                              {formatCurrency(historyItem.cost)}
                            </Typography>
                            <Typography variant="caption" sx={{
                              color: '#6c757d',
                              fontWeight: 500,
                              textTransform: 'uppercase',
                              letterSpacing: 0.5
                            }}>
                              Service Cost
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      <Typography variant="body1" sx={{
                        color: '#6c757d',
                        lineHeight: 1.6,
                        fontSize: '0.95rem'
                      }}>
                        {historyItem.type === 'registration' && 'Vehicle successfully registered in the system with all required documentation and verification.'}
                        {historyItem.type === 'service' && 'Professional service completed by certified technicians with quality assurance.'}
                        {historyItem.type === 'accident' && 'Accident details and related documentation will be available here once the system is implemented.'}
                      </Typography>

                      {historyItem.type === 'service' && historyItem.serviceCenter && (
                        <Box sx={{
                          mt: 3,
                          p: 2,
                          bgcolor: '#f8f9fa',
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2
                        }}>
                          <PersonIcon sx={{ color: '#7AB2D3', fontSize: 20 }} />
                          <Typography variant="body2" sx={{
                            color: '#495057',
                            fontWeight: 500
                          }}>
                            Serviced by: <strong>{historyItem.serviceCenter}</strong>
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Empty State */}
        {filteredHistory.length === 0 && (
          <Box sx={{
            textAlign: 'center',
            py: 10,
            px: 4,
            bgcolor: 'white',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '2px dashed #B9E5E8'
          }}>
            <Box sx={{
              bgcolor: '#DFF2EB',
              borderRadius: '50%',
              width: 120,
              height: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3
            }}>
              <TimelineIcon sx={{ fontSize: 60, color: '#7AB2D3' }} />
            </Box>
            <Typography variant="h4" sx={{
              fontWeight: 700,
              color: '#2c3e50',
              mb: 2
            }}>
              No {filterType === 'all' ? 'Activities' : filterType.charAt(0).toUpperCase() + filterType.slice(1)} Found
            </Typography>
            <Typography variant="body1" sx={{
              color: '#6c757d',
              maxWidth: 500,
              mx: 'auto',
              lineHeight: 1.6,
              fontSize: '1.1rem'
            }}>
              {filterType === 'all'
                ? 'This vehicle has no recorded activities yet. Activities will appear here as they occur.'
                : `No ${filterType} activities found for this vehicle. Try selecting a different filter to view other activities.`
              }
            </Typography>
          </Box>
        )}

        {/* Accident Management Placeholder */}
        {(filterType === 'all' || filterType === 'accident') && (
          <Card sx={{
            mt: 6,
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid #ffeaa7',
            boxShadow: '0 4px 20px rgba(243, 156, 18, 0.1)'
          }}>
            <Box sx={{
              background: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)',
              p: 4
            }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                mb: 2
              }}>
                <Box sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: 3,
                  p: 2,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <WarningIcon sx={{ fontSize: 32, color: '#f39c12' }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{
                    fontWeight: 700,
                    color: '#f39c12',
                    mb: 0.5
                  }}>
                    Accident Management System
                  </Typography>
                  <Typography variant="subtitle1" sx={{
                    color: '#f39c12',
                    opacity: 0.9
                  }}>
                    Coming Soon - Enhanced Safety Features
                  </Typography>
                </Box>
              </Box>
            </Box>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="body1" sx={{
                color: '#495057',
                lineHeight: 1.7,
                fontSize: '1rem',
                mb: 3
              }}>
                Our comprehensive accident tracking system is currently under development. Once implemented, this powerful feature will provide:
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{
                      bgcolor: '#DFF2EB',
                      borderRadius: '50%',
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <CheckCircleIcon sx={{ fontSize: 18, color: '#4A628A' }} />
                    </Box>
                    <Typography variant="body2" sx={{ color: '#495057', fontWeight: 500 }}>
                      Detailed accident reports and documentation
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{
                      bgcolor: '#DFF2EB',
                      borderRadius: '50%',
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <CheckCircleIcon sx={{ fontSize: 18, color: '#4A628A' }} />
                    </Box>
                    <Typography variant="body2" sx={{ color: '#495057', fontWeight: 500 }}>
                      Insurance claim tracking and management
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{
                      bgcolor: '#DFF2EB',
                      borderRadius: '50%',
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <CheckCircleIcon sx={{ fontSize: 18, color: '#4A628A' }} />
                    </Box>
                    <Typography variant="body2" sx={{ color: '#495057', fontWeight: 500 }}>
                      Repair records and damage assessments
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{
                      bgcolor: '#DFF2EB',
                      borderRadius: '50%',
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <CheckCircleIcon sx={{ fontSize: 18, color: '#4A628A' }} />
                    </Box>
                    <Typography variant="body2" sx={{ color: '#495057', fontWeight: 500 }}>
                      Integration with service history
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Container>
    );
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #DFF2EB 0%, #B9E5E8 100%)',
        textAlign: 'center'
      }}>
        <Box sx={{
          bgcolor: 'white',
          borderRadius: 3,
          p: 6,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          maxWidth: 400
        }}>
          <CircularProgress size={64} sx={{ color: '#4A628A', mb: 3 }} />
          <Typography variant="h5" sx={{
            fontWeight: 700,
            color: '#2c3e50',
            mb: 2
          }}>
            Loading Your Vehicles
          </Typography>
          <Typography variant="body1" sx={{
            color: '#6c757d',
            lineHeight: 1.6
          }}>
            Fetching your vehicle information and preparing the dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #DFF2EB 0%, #B9E5E8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3
      }}>
        <Container maxWidth="sm">
          <Box sx={{
            bgcolor: 'white',
            borderRadius: 3,
            p: 6,
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <Box sx={{
              bgcolor: '#fee',
              borderRadius: '50%',
              width: 80,
              height: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3
            }}>
              <WarningIcon sx={{ fontSize: 40, color: '#e74c3c' }} />
            </Box>
            <Typography variant="h4" sx={{
              fontWeight: 700,
              color: '#2c3e50',
              mb: 2
            }}>
              Something went wrong
            </Typography>
            <Typography variant="body1" sx={{
              color: '#6c757d',
              mb: 4,
              lineHeight: 1.6
            }}>
              {error}
            </Typography>
            <Button
              variant="contained"
              onClick={loadVehicles}
              size="large"
              sx={{
                bgcolor: '#4A628A',
                color: 'white',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#7AB2D3'
                }
              }}
            >
              Try Again
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #DFF2EB 0%, #B9E5E8 50%, #f8f9fa 100%)',
      py: 4
    }}>
      {!selectedVehicle ? (
        renderVehicleSelection()
      ) : historyLoading ? (
        <Container maxWidth="sm">
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center'
          }}>
            <Box sx={{
              bgcolor: 'white',
              borderRadius: 3,
              p: 6,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              maxWidth: 400
            }}>
              <CircularProgress size={64} sx={{ color: '#4A628A', mb: 3 }} />
              <Typography variant="h5" sx={{
                fontWeight: 700,
                color: '#2c3e50',
                mb: 2
              }}>
                Loading Vehicle History
              </Typography>
              <Typography variant="body1" sx={{
                color: '#6c757d',
                lineHeight: 1.6
              }}>
                Gathering comprehensive data for <strong>{selectedVehicle?.registrationNumber}</strong>...
              </Typography>
            </Box>
          </Box>
        </Container>
      ) : vehicleHistory ? (
        renderVehicleHistory()
      ) : (
        <Container maxWidth="sm">
          <Box sx={{
            textAlign: 'center',
            py: 8,
            bgcolor: 'white',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            p: 6
          }}>
            <Box sx={{
              bgcolor: '#E8F4FD',
              borderRadius: '50%',
              width: 80,
              height: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3
            }}>
              <InfoIcon sx={{ fontSize: 40, color: '#3498db' }} />
            </Box>
            <Typography variant="h4" sx={{
              fontWeight: 700,
              color: '#2c3e50',
              mb: 2
            }}>
              No History Available
            </Typography>
            <Typography variant="body1" sx={{
              color: '#6c757d',
              mb: 4,
              lineHeight: 1.6
            }}>
              No history data is available for this vehicle yet. Activities will appear here as they occur.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setSelectedVehicle(null);
                setVehicleHistory(null);
              }}
              startIcon={<ArrowBackIcon />}
              size="large"
              sx={{
                borderColor: '#4A628A',
                color: '#4A628A',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#7AB2D3',
                  color: '#7AB2D3',
                  bgcolor: '#DFF2EB'
                }
              }}
            >
              Back to Vehicles
            </Button>
          </Box>
        </Container>
      )}
    </Box>
  );
};

export default VehicleHistoryPage;