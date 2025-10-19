import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Switch,
  TextField,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Stack,
} from "@mui/material";
import {
  AccessTime,
  Schedule as ScheduleIcon,
  Settings as SettingsIcon,
  Block as BlockIcon,
  Analytics as AnalyticsIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Event as EventIcon,
  CalendarToday as CalendarTodayIcon,
} from "@mui/icons-material";
import { UserContext } from "../../contexts/UserContext";
import { weeklyScheduleApi } from "../../services/weeklyScheduleApi";
import { toast } from "react-toastify";

const DAYS_OF_WEEK = [
  { key: "monday", label: "Monday", color: "#3498db" },
  { key: "tuesday", label: "Tuesday", color: "#9b59b6" },
  { key: "wednesday", label: "Wednesday", color: "#e67e22" },
  { key: "thursday", label: "Thursday", color: "#27ae60" },
  { key: "friday", label: "Friday", color: "#f39c12" },
  { key: "saturday", label: "Saturday", color: "#e74c3c" },
  { key: "sunday", label: "Sunday", color: "#95a5a6" },
];

const SLOT_DURATIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
];

const ManageSlotsPage = () => {
  const { userContext } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState(null);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewSlots, setPreviewSlots] = useState([]);

  // Schedule state
  const [schedule, setSchedule] = useState({
    monday: { isOpen: false, startTime: "", endTime: "" },
    tuesday: { isOpen: false, startTime: "", endTime: "" },
    wednesday: { isOpen: false, startTime: "", endTime: "" },
    thursday: { isOpen: false, startTime: "", endTime: "" },
    friday: { isOpen: false, startTime: "", endTime: "" },
    saturday: { isOpen: false, startTime: "", endTime: "" },
    sunday: { isOpen: false, startTime: "", endTime: "" },
  });

  const [slotSettings, setSlotSettings] = useState({
    duration: 60,
    bufferTime: 15,
    advanceBookingDays: 30,
  });

  const [blockedDates, setBlockedDates] = useState([]);
  const [blockData, setBlockData] = useState({
    date: "",
    reason: "",
  });

  useEffect(() => {
    if (userContext?.role === "service_center") {
      fetchSchedule();
      fetchStats();
    }
  }, [userContext]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const response = await weeklyScheduleApi.getMySchedule();
      if (response.success) {
        const scheduleData = response.data.schedule;
        setSchedule(scheduleData.schedule);
        setSlotSettings(scheduleData.slotSettings);
        setBlockedDates(scheduleData.blockedDates || []);
        console.log("📅 Schedule loaded:", scheduleData);
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await weeklyScheduleApi.getStats();
      if (response.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleScheduleChange = (day, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
        // If closing the day, clear times
        ...(field === 'isOpen' && !value && { startTime: "", endTime: "" }),
        // If opening the day, set default times
        ...(field === 'isOpen' && value && prev[day].startTime === "" && { 
          startTime: "09:00", 
          endTime: "17:00" 
        })
      }
    }));
  };

  const handleSlotSettingsChange = (field, value) => {
    setSlotSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveSchedule = async () => {
    try {
      setSaving(true);
      
      // Validate schedule
      const hasOpenDay = Object.values(schedule).some(day => day.isOpen);
      if (!hasOpenDay) {
        toast.error("At least one day must be open");
        return;
      }

      await weeklyScheduleApi.updateSchedule({
        schedule,
        slotSettings
      });
      
      fetchStats(); // Refresh stats after saving
    } catch (error) {
      console.error("Error saving schedule:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleBlockDate = async () => {
    try {
      await weeklyScheduleApi.blockDate(blockData.date, blockData.reason);
      setBlockDialogOpen(false);
      setBlockData({ date: "", reason: "" });
      fetchSchedule(); // Refresh to get updated blocked dates
    } catch (error) {
      console.error("Error blocking date:", error);
    }
  };

  const handleUnblockDate = async (date) => {
    if (window.confirm(`Are you sure you want to unblock ${date}?`)) {
      try {
        await weeklyScheduleApi.unblockDate(date);
        fetchSchedule(); // Refresh to get updated blocked dates
      } catch (error) {
        console.error("Error unblocking date:", error);
      }
    }
  };

  const handlePreviewSlots = async () => {
    try {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      
      const response = await weeklyScheduleApi.getAvailableSlots(
        userContext._id,
        today.toISOString().split('T')[0],
        nextWeek.toISOString().split('T')[0]
      );
      
      if (response.success) {
        setPreviewSlots(response.data.slots || []);
        setPreviewDialogOpen(true);
      }
    } catch (error) {
      console.error("Error previewing slots:", error);
    }
  };

  const getOpenDaysCount = () => {
    return Object.values(schedule).filter(day => day.isOpen).length;
  };

  const getTotalWeeklySlots = () => {
    // Rough calculation based on duration
    let totalSlots = 0;
    Object.values(schedule).forEach(day => {
      if (day.isOpen && day.startTime && day.endTime) {
        const start = new Date(`1970-01-01T${day.startTime}`);
        const end = new Date(`1970-01-01T${day.endTime}`);
        const duration = (end - start) / (1000 * 60); // minutes
        const slotsPerDay = Math.floor(duration / (slotSettings.duration + slotSettings.bufferTime));
        totalSlots += Math.max(0, slotsPerDay);
      }
    });
    return totalSlots;
  };

  if (userContext?.role !== "service_center") {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Access denied. Only service centers can manage schedules.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1400, margin: "0 auto" }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#2c3e50" }}>
            <ScheduleIcon sx={{ mr: 2, verticalAlign: "middle" }} />
            Weekly Schedule
          </Typography>
          <Typography variant="body1" sx={{ color: "#7f8c8d", mt: 1 }}>
            Set up your recurring weekly working hours and slot preferences
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => { fetchSchedule(); fetchStats(); }}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<EventIcon />}
            onClick={handlePreviewSlots}
          >
            Preview Slots
          </Button>
          <Button
            variant="contained"
            startIcon={<BlockIcon />}
            onClick={() => setBlockDialogOpen(true)}
            sx={{ backgroundColor: "#e74c3c", "&:hover": { backgroundColor: "#c0392b" } }}
          >
            Block Date
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: "linear-gradient(45deg, #3498db, #2980b9)" }}>
              <CardContent sx={{ color: "white", textAlign: "center" }}>
                <CheckCircleIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {stats.openDays}/7
                </Typography>
                <Typography variant="body2">Open Days</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: "linear-gradient(45deg, #27ae60, #229954)" }}>
              <CardContent sx={{ color: "white", textAlign: "center" }}>
                <AccessTime sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {stats.totalWeeklySlots}
                </Typography>
                <Typography variant="body2">Weekly Slots</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: "linear-gradient(45deg, #f39c12, #e67e22)" }}>
              <CardContent sx={{ color: "white", textAlign: "center" }}>
                <CalendarTodayIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {stats.upcomingBookings}
                </Typography>
                <Typography variant="body2">Upcoming Bookings</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: "linear-gradient(45deg, #e74c3c, #c0392b)" }}>
              <CardContent sx={{ color: "white", textAlign: "center" }}>
                <BlockIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {stats.blockedDatesCount}
                </Typography>
                <Typography variant="body2">Blocked Dates</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Main Content */}
      <Paper sx={{ p: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab 
            label="Working Hours" 
            icon={<AccessTime />} 
            iconPosition="start"
          />
          <Tab 
            label="Slot Settings" 
            icon={<SettingsIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Blocked Dates" 
            icon={<BlockIcon />} 
            iconPosition="start"
          />
        </Tabs>

        {/* Working Hours Tab */}
        {tabValue === 0 && (
          <Box>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={2}>
                {DAYS_OF_WEEK.map((day) => {
                  const daySchedule = schedule[day.key];
                  return (
                    <Grid item xs={12} md={6} lg={4} key={day.key}>
                      <Card 
                        sx={{ 
                          border: daySchedule?.isOpen ? `2px solid ${day.color}` : "2px solid #e0e0e0",
                          backgroundColor: daySchedule?.isOpen ? "#f8f9fa" : "#fafafa"
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {day.label}
                            </Typography>
                            <Switch
                              checked={daySchedule?.isOpen || false}
                              onChange={(e) => handleScheduleChange(day.key, "isOpen", e.target.checked)}
                              color="primary"
                            />
                          </Box>

                          {daySchedule?.isOpen && (
                            <Stack spacing={2}>
                              <TextField
                                fullWidth
                                label="Start Time"
                                type="time"
                                size="small"
                                value={daySchedule.startTime || ""}
                                onChange={(e) => handleScheduleChange(day.key, "startTime", e.target.value)}
                                InputLabelProps={{ shrink: true }}
                              />
                              <TextField
                                fullWidth
                                label="End Time"
                                type="time"
                                size="small"
                                value={daySchedule.endTime || ""}
                                onChange={(e) => handleScheduleChange(day.key, "endTime", e.target.value)}
                                InputLabelProps={{ shrink: true }}
                              />
                              {daySchedule.startTime && daySchedule.endTime && (
                                <Chip 
                                  label={`${daySchedule.startTime} - ${daySchedule.endTime}`}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              )}
                            </Stack>
                          )}

                          {!daySchedule?.isOpen && (
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
                              Closed
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}

            <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                onClick={handleSaveSchedule}
                disabled={saving}
                sx={{ px: 4 }}
              >
                {saving ? "Saving..." : "Save Schedule"}
              </Button>
            </Box>
          </Box>
        )}

        {/* Slot Settings Tab */}
        {tabValue === 1 && (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Slot Duration</InputLabel>
                  <Select
                    value={slotSettings.duration}
                    label="Slot Duration"
                    onChange={(e) => handleSlotSettingsChange("duration", e.target.value)}
                  >
                    {SLOT_DURATIONS.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Buffer Time (minutes)"
                  type="number"
                  value={slotSettings.bufferTime}
                  onChange={(e) => handleSlotSettingsChange("bufferTime", parseInt(e.target.value))}
                  InputProps={{ inputProps: { min: 0, max: 60 } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Advance Booking Days"
                  type="number"
                  value={slotSettings.advanceBookingDays}
                  onChange={(e) => handleSlotSettingsChange("advanceBookingDays", parseInt(e.target.value))}
                  InputProps={{ inputProps: { min: 1, max: 90 } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, backgroundColor: "#f8f9fa" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Quick Preview
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Open Days: {getOpenDaysCount()}/7
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Estimated Weekly Slots: ~{getTotalWeeklySlots()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Slot Duration: {slotSettings.duration} min + {slotSettings.bufferTime} min buffer
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                onClick={handleSaveSchedule}
                disabled={saving}
                sx={{ px: 4 }}
              >
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </Box>
          </Box>
        )}

        {/* Blocked Dates Tab */}
        {tabValue === 2 && (
          <Box>
            {blockedDates.length > 0 ? (
              <List>
                {blockedDates.map((blocked, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={blocked.date}
                      secondary={blocked.reason || "No reason provided"}
                    />
                    <ListItemSecondaryAction>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => handleUnblockDate(blocked.date)}
                      >
                        Unblock
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Alert severity="info">
                No blocked dates. Use the "Block Date" button to add blocked dates.
              </Alert>
            )}
          </Box>
        )}
      </Paper>

      {/* Block Date Dialog */}
      <Dialog 
        open={blockDialogOpen} 
        onClose={() => setBlockDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Block Date</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={blockData.date}
              onChange={(e) => setBlockData(prev => ({ ...prev, date: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Reason (Optional)"
              multiline
              rows={3}
              value={blockData.reason}
              onChange={(e) => setBlockData(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Enter reason for blocking this date..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBlockDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleBlockDate}
            variant="contained"
            color="error"
            startIcon={<BlockIcon />}
            disabled={!blockData.date}
          >
            Block Date
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Slots Dialog */}
      <Dialog 
        open={previewDialogOpen} 
        onClose={() => setPreviewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Slot Preview - Next 7 Days</DialogTitle>
        <DialogContent>
          {previewSlots.length > 0 ? (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Showing {previewSlots.length} available slots
              </Typography>
              <Grid container spacing={2}>
                {previewSlots.slice(0, 20).map((slot, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <Chip 
                      label={`${slot.date} ${slot.startTime}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Grid>
                ))}
                {previewSlots.length > 20 && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">
                      ... and {previewSlots.length - 20} more slots
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          ) : (
            <Alert severity="info">
              No slots available. Please configure your working hours first.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageSlotsPage;
