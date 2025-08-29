// src/pages/ServiceProvider/vehicleServiceRequests.jsx
import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  IconButton,
  Tooltip,
  Badge,
  Divider,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
  Stack,
  InputAdornment,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  DirectionsCar as CarIcon,
  Build as ServiceIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { UserContext } from "../../contexts/UserContext";
import bookingAPI from "../../services/bookingApiService";
import ServiceCompletionForm from "../../components/ServiceProvider/ServiceCompletionForm";
import "./vehicleServiceRequests.css";

const VehicleServiceRequests = () => {
  const { userContext } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [statusUpdateDialogOpen, setStatusUpdateDialogOpen] = useState(false);
  const [completionFormOpen, setCompletionFormOpen] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    limit: 10,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  });
  const [statusUpdate, setStatusUpdate] = useState({
    status: "",
    message: "",
    proposedDate: "",
    proposedTimeSlot: "",
    estimatedDuration: "",
  });

  // Status configurations
  const statusConfig = {
    PENDING: { color: "warning", icon: <ScheduleIcon />, label: "Pending" },
    CONFIRMED: { color: "info", icon: <CheckCircleIcon />, label: "Confirmed" },
    IN_PROGRESS: { color: "primary", icon: <AssignmentIcon />, label: "In Progress" },
    COMPLETED: { color: "success", icon: <CheckCircleIcon />, label: "Completed" },
    CANCELLED: { color: "error", icon: <CancelIcon />, label: "Cancelled" },
    REJECTED: { color: "error", icon: <CancelIcon />, label: "Rejected" },
  };

  // Tab configurations
  const tabs = [
    { label: "All Requests", value: "", count: 0 },
    { label: "Pending", value: "PENDING", count: 0 },
    { label: "Confirmed", value: "CONFIRMED", count: 0 },
    { label: "In Progress", value: "IN_PROGRESS", count: 0 },
    { label: "Completed", value: "COMPLETED", count: 0 },
  ];

  // Update tab counts based on current bookings
  const getTabCounts = () => {
    const counts = {};
    bookings.forEach((booking) => {
      counts[booking.status] = (counts[booking.status] || 0) + 1;
    });
    return counts;
  };

  // Fetch bookings
  const fetchBookings = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page,
        limit: pagination.limit,
        ...filters,
        status: tabs[selectedTab]?.value || "",
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === "" || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      console.log("Fetching bookings with params:", params);
      
      const response = await bookingAPI.getBookings(params);
      
      if (response.success) {
        setBookings(response.data.bookings || []);
        setPagination(response.data.pagination || pagination);
      } else {
        throw new Error(response.message || "Failed to fetch bookings");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err.message);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (userContext?.role === "service_center") {
      fetchBookings();
    }
  }, [userContext, selectedTab, filters]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Handle pagination change
  const handlePageChange = (event, page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    fetchBookings(page);
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    try {
      if (!selectedBooking || !statusUpdate.status) {
        toast.error("Please select a status");
        return;
      }

      // If status is being updated to COMPLETED, open completion form instead
      if (statusUpdate.status === "COMPLETED") {
        setStatusUpdateDialogOpen(false);
        setCompletionFormOpen(true);
        return;
      }

      const updateData = {
        status: statusUpdate.status,
        message: statusUpdate.message,
        proposedDate: statusUpdate.proposedDate || undefined,
        proposedTimeSlot: statusUpdate.proposedTimeSlot || undefined,
        estimatedDuration: statusUpdate.estimatedDuration || undefined,
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined || updateData[key] === "") {
          delete updateData[key];
        }
      });

      const response = await bookingAPI.updateBookingStatus(selectedBooking._id, updateData);
      
      if (response.success) {
        setStatusUpdateDialogOpen(false);
        setStatusUpdate({
          status: "",
          message: "",
          proposedDate: "",
          proposedTimeSlot: "",
          estimatedDuration: "",
        });
        fetchBookings(pagination.currentPage);
        toast.success("Booking status updated successfully");
      }
    } catch (err) {
      console.error("Error updating booking status:", err);
    }
  };

  // View booking details
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailsDialogOpen(true);
  };

  // Open status update dialog
  const handleOpenStatusUpdate = (booking) => {
    setSelectedBooking(booking);
    setStatusUpdate({
      status: booking.status,
      message: "",
      proposedDate: "",
      proposedTimeSlot: "",
      estimatedDuration: "",
    });
    setStatusUpdateDialogOpen(true);
  };

  // Open completion form dialog
  const handleOpenCompletionForm = (booking) => {
    setSelectedBooking(booking);
    setCompletionFormOpen(true);
  };

  // Handle service completion
  const handleServiceCompletion = (updatedBooking) => {
    // Update the booking in the list
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking._id === updatedBooking._id ? updatedBooking : booking
      )
    );
    setCompletionFormOpen(false);
    setSelectedBooking(null);
    toast.success("Service completed successfully!");
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check if user is service center
  if (userContext?.role !== "service_center") {
    return (
      <Box p={3}>
        <Alert severity="error">
          Access denied. This page is only available for service centers.
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3} className="vehicle-service-requests-page">
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          Service Requests
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your incoming vehicle service requests
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }} className="filters-paper">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search by booking ID, vehicle registration..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              type="date"
              label="From Date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              type="date"
              label="To Date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => fetchBookings(pagination.currentPage)}
            >
              Refresh
            </Button>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => {
                setFilters({ search: "", status: "", dateFrom: "", dateTo: "" });
                setPagination(prev => ({ ...prev, currentPage: 1 }));
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }} className="service-requests-tabs">
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          className="tabs-container"
        >
          {tabs.map((tab, index) => {
            const counts = getTabCounts();
            const count = index === 0 ? bookings.length : counts[tab.value] || 0;
            return (
              <Tab
                key={index}
                label={
                  <Badge badgeContent={count} color="primary" className="badge-container">
                    {tab.label}
                  </Badge>
                }
              />
            );
          })}
        </Tabs>
      </Paper>

      {/* Content */}
      {loading ? (
        <Box display="flex" justifyContent="center" p={4} className="loading-container">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Button onClick={() => fetchBookings(pagination.currentPage)} sx={{ ml: 2 }}>
            Retry
          </Button>
        </Alert>
      ) : bookings.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <AssignmentIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No service requests found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedTab === 0 
              ? "You don't have any service requests yet."
              : `No ${tabs[selectedTab]?.label.toLowerCase()} requests found.`
            }
          </Typography>
        </Paper>
      ) : (
        <>
          {/* Bookings Grid */}
          <Grid container spacing={3}>
            {bookings.map((booking) => {
              const status = statusConfig[booking.status] || statusConfig.PENDING;
              return (
                <Grid item xs={12} md={6} lg={4} key={booking._id}>
                  <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }} className="booking-card">
                    <CardContent sx={{ flexGrow: 1 }}>
                      {/* Header */}
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" component="div" noWrap>
                          {booking.bookingId}
                        </Typography>
                        <Chip
                          icon={status.icon}
                          label={status.label}
                          color={status.color}
                          size="small"
                          className={`status-chip ${status.color}`}
                        />
                      </Box>

                      {/* Customer Info */}
                      <Box display="flex" alignItems="center" mb={2}>
                        <Avatar sx={{ mr: 2 }}>
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                            {booking.vehicleOwner?.firstName} {booking.vehicleOwner?.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {booking.vehicleOwner?.email}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Vehicle Info */}
                      <Box display="flex" alignItems="center" mb={2} className="vehicle-info">
                        <CarIcon sx={{ mr: 1, color: "text.secondary" }} />
                        <Typography variant="body2">
                          {booking.vehicle?.registrationNumber} - {booking.vehicle?.make} {booking.vehicle?.model} ({booking.vehicle?.year})
                        </Typography>
                      </Box>

                      {/* Date & Time */}
                      <Box display="flex" alignItems="center" mb={2} className="datetime-info">
                        <CalendarIcon sx={{ mr: 1, color: "text.secondary" }} />
                        <Typography variant="body2">
                          {formatDate(booking.preferredDate)}
                        </Typography>
                        <TimeIcon sx={{ ml: 2, mr: 1, color: "text.secondary" }} />
                        <Typography variant="body2">
                          {booking.preferredTimeSlot}
                        </Typography>
                      </Box>

                      {/* Services */}
                      <Box mb={2}>
                        <Box display="flex" alignItems="center" mb={1}>
                          <ServiceIcon sx={{ mr: 1, color: "text.secondary" }} />
                          <Typography variant="body2" fontWeight="medium">
                            Services
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} className="service-chips-container">
                          {booking.services?.slice(0, 3).map((service, index) => (
                            <Chip key={index} label={service} size="small" variant="outlined" className="service-chip" />
                          ))}
                          {booking.services?.length > 3 && (
                            <Chip label={`+${booking.services.length - 3} more`} size="small" className="service-chip" />
                          )}
                        </Stack>
                      </Box>

                      {/* Special Requests */}
                      {booking.specialRequests && (
                        <Typography variant="body2" color="text.secondary" noWrap>
                          Note: {booking.specialRequests}
                        </Typography>
                      )}
                    </CardContent>

                    <Divider />

                    <CardActions className="action-buttons">
                      <Button
                        size="small"
                        startIcon={<ViewIcon />}
                        onClick={() => handleViewDetails(booking)}
                        className="action-button"
                      >
                        View Details
                      </Button>
                      
                      {booking.status === "IN_PROGRESS" && (
                        <Button
                          size="small"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleOpenCompletionForm(booking)}
                          className="action-button"
                          color="success"
                        >
                          Complete Service
                        </Button>
                      )}
                      
                      {booking.status !== "COMPLETED" && booking.status !== "CANCELLED" && (
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleOpenStatusUpdate(booking)}
                          className="action-button"
                        >
                          Update Status
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}

      {/* Booking Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
        className="details-dialog"
      >
        <DialogTitle className="dialog-title">
          Booking Details - {selectedBooking?.bookingId}
        </DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Grid container spacing={3}>
              {/* Customer Information */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Customer Information
                </Typography>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>
                        {selectedBooking.vehicleOwner?.firstName} {selectedBooking.vehicleOwner?.lastName}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>{selectedBooking.vehicleOwner?.email}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Phone</TableCell>
                      <TableCell>{selectedBooking.contactInfo?.phone}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>NIC</TableCell>
                      <TableCell>{selectedBooking.ownerNIC}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>

              {/* Vehicle Information */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Vehicle Information
                </Typography>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell>Registration</TableCell>
                      <TableCell>{selectedBooking.vehicle?.registrationNumber}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Make & Model</TableCell>
                      <TableCell>
                        {selectedBooking.vehicle?.make} {selectedBooking.vehicle?.model}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Year</TableCell>
                      <TableCell>{selectedBooking.vehicle?.year}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>

              {/* Service Details */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Service Details
                </Typography>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell>Preferred Date</TableCell>
                      <TableCell>{formatDate(selectedBooking.preferredDate)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Preferred Time</TableCell>
                      <TableCell>{selectedBooking.preferredTimeSlot}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Services</TableCell>
                      <TableCell>
                        {selectedBooking.services?.join(", ")}
                      </TableCell>
                    </TableRow>
                    {selectedBooking.specialRequests && (
                      <TableRow>
                        <TableCell>Special Requests</TableCell>
                        <TableCell>{selectedBooking.specialRequests}</TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell>Status</TableCell>
                      <TableCell>
                        <Chip
                          icon={statusConfig[selectedBooking.status]?.icon}
                          label={statusConfig[selectedBooking.status]?.label}
                          color={statusConfig[selectedBooking.status]?.color}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>

              {/* Service Center Response */}
              {selectedBooking.serviceCenterResponse?.message && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Your Response
                  </Typography>
                  <Typography variant="body2">
                    {selectedBooking.serviceCenterResponse.message}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={() => setDetailsDialogOpen(false)} className="dialog-button">
            Close
          </Button>
          {selectedBooking && selectedBooking.vehicleOwner?.phone && (
            <Button
              startIcon={<PhoneIcon />}
              href={`tel:${selectedBooking.vehicleOwner.phone}`}
              className="contact-button"
            >
              Call Customer
            </Button>
          )}
          {selectedBooking && selectedBooking.vehicleOwner?.email && (
            <Button
              startIcon={<EmailIcon />}
              href={`mailto:${selectedBooking.vehicleOwner.email}`}
              className="contact-button"
            >
              Email Customer
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog
        open={statusUpdateDialogOpen}
        onClose={() => setStatusUpdateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        className="status-update-dialog"
      >
        <DialogTitle className="dialog-title">
          Update Booking Status - {selectedBooking?.bookingId}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {statusUpdate.status === "CONFIRMED" && (
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Confirming will automatically set the status to "In Progress" and mark work as started.
                </Alert>
              </Grid>
            )}
            {statusUpdate.status === "COMPLETED" && (
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Selecting "Complete Service" will open the detailed service completion form.
                </Alert>
              </Grid>
            )}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusUpdate.status}
                  onChange={(e) => setStatusUpdate(prev => ({ ...prev, status: e.target.value }))}
                  label="Status"
                >
                  <MenuItem value="CONFIRMED">Confirm & Start Work</MenuItem>
                  <MenuItem value="COMPLETED">Complete Service</MenuItem>
                  <MenuItem value="REJECTED">Reject</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message to Customer"
                multiline
                rows={3}
                value={statusUpdate.message}
                onChange={(e) => setStatusUpdate(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Optional message for the customer..."
              />
            </Grid>
            {statusUpdate.status === "CONFIRMED" && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Proposed Date"
                    value={statusUpdate.proposedDate}
                    onChange={(e) => setStatusUpdate(prev => ({ ...prev, proposedDate: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Proposed Time Slot"
                    value={statusUpdate.proposedTimeSlot}
                    onChange={(e) => setStatusUpdate(prev => ({ ...prev, proposedTimeSlot: e.target.value }))}
                    placeholder="e.g., 10:00 AM - 12:00 PM"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Estimated Duration"
                    value={statusUpdate.estimatedDuration}
                    onChange={(e) => setStatusUpdate(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                    placeholder="e.g., 2-3 hours"
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={() => setStatusUpdateDialogOpen(false)} className="dialog-button">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleStatusUpdate}
            disabled={!statusUpdate.status}
            className="update-button"
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Service Completion Form Dialog */}
      <ServiceCompletionForm
        booking={selectedBooking}
        open={completionFormOpen}
        onClose={() => {
          setCompletionFormOpen(false);
          setSelectedBooking(null);
        }}
        onComplete={handleServiceCompletion}
      />
    </Box>
  );
};

export default VehicleServiceRequests;
