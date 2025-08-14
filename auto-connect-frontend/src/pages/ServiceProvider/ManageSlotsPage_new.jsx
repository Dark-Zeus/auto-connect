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
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  CircularProgress,
  Tooltip,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Fab,
  Snackbar,
} from "@mui/material";
import {
  AccessTime,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  Schedule as ScheduleIcon,
  EventBusy as EventBusyIcon,
  Analytics as AnalyticsIcon,
  Refresh as RefreshIcon,
  CalendarToday as CalendarTodayIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { UserContext } from "../../contexts/UserContext";
import { timeSlotApi } from "../../services/timeSlotApi";
import { toast } from "react-toastify";

const DAYS_OF_WEEK = [
  { key: "MONDAY", label: "Monday" },
  { key: "TUESDAY", label: "Tuesday" },
  { key: "WEDNESDAY", label: "Wednesday" },
  { key: "THURSDAY", label: "Thursday" },
  { key: "FRIDAY", label: "Friday" },
  { key: "SATURDAY", label: "Saturday" },
  { key: "SUNDAY", label: "Sunday" },
];

const DEFAULT_TIME_SLOTS = [
  { startTime: "09:00", endTime: "11:00", duration: 120 },
  { startTime: "11:00", endTime: "13:00", duration: 120 },
  { startTime: "13:00", endTime: "15:00", duration: 120 },
  { startTime: "15:00", endTime: "17:00", duration: 120 },
];

const ManageSlotsPage = () => {
  const { userContext } = useContext(UserContext);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [editingDay, setEditingDay] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);

  // Form state for editing day slots
  const [formData, setFormData] = useState({
    dayOfWeek: "",
    workingHours: {
      isOpen: true,
      startTime: "09:00",
      endTime: "17:00",
    },
    availableSlots: [...DEFAULT_TIME_SLOTS],
  });

  // Block date form state
  const [blockData, setBlockData] = useState({
    dayOfWeek: "",
    blockedDate: "",
    reason: "",
    blockedSlots: [],
  });

  useEffect(() => {
    if (userContext?.role === "service_center") {
      fetchTimeSlots();
      fetchStats();
    }
  }, [userContext]);

  const fetchTimeSlots = async () => {
    try {
      setLoading(true);
      const response = await timeSlotApi.getMyTimeSlots();
      if (response.success) {
        setTimeSlots(response.data.timeSlots || []);
        console.log("📅 Time slots loaded:", response.data.timeSlots);
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
      toast.error("Failed to load time slots");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await timeSlotApi.getTimeSlotStats();
      if (response.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleEditDay = (day) => {
    setSelectedDay(day);
    if (day._id) {
      // Editing existing day
      setFormData({
        dayOfWeek: day.dayOfWeek,
        workingHours: day.workingHours || { isOpen: false },
        availableSlots: day.availableSlots || [],
      });
    } else {
      // Adding new day
      setFormData({
        dayOfWeek: day.dayOfWeek,
        workingHours: { isOpen: true, startTime: "09:00", endTime: "17:00" },
        availableSlots: [...DEFAULT_TIME_SLOTS],
      });
    }
    setDialogOpen(true);
  };

  const handleSaveSlots = async () => {
    try {
      const response = await timeSlotApi.createOrUpdateDaySlots(formData);
      if (response.success) {
        setDialogOpen(false);
        fetchTimeSlots();
        fetchStats();
        toast.success("Time slots saved successfully!");
      }
    } catch (error) {
      console.error("Error saving slots:", error);
      toast.error("Failed to save time slots");
    }
  };

  const handleDeleteDay = async (dayOfWeek) => {
    if (
      window.confirm(
        `Are you sure you want to delete time slots for ${dayOfWeek}?`
      )
    ) {
      try {
        await timeSlotApi.deleteDaySlots(dayOfWeek);
        fetchTimeSlots();
        fetchStats();
        toast.success("Time slots deleted successfully!");
      } catch (error) {
        console.error("Error deleting day slots:", error);
        toast.error("Failed to delete time slots");
      }
    }
  };

  const handleAddTimeSlot = () => {
    setFormData((prev) => ({
      ...prev,
      availableSlots: [
        ...prev.availableSlots,
        { startTime: "09:00", endTime: "11:00", duration: 120 },
      ],
    }));
  };

  const handleRemoveTimeSlot = (index) => {
    setFormData((prev) => ({
      ...prev,
      availableSlots: prev.availableSlots.filter((_, i) => i !== index),
    }));
  };

  const handleSlotChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      availableSlots: prev.availableSlots.map((slot, i) => {
        if (i === index) {
          const updatedSlot = { ...slot, [field]: value };
          // Auto-calculate duration when times change
          if (field === "startTime" || field === "endTime") {
            if (updatedSlot.startTime && updatedSlot.endTime) {
              const start = new Date(`2000-01-01T${updatedSlot.startTime}`);
              const end = new Date(`2000-01-01T${updatedSlot.endTime}`);
              const duration = (end - start) / (1000 * 60); // minutes
              updatedSlot.duration = Math.max(0, duration);
            }
          }
          return updatedSlot;
        }
        return slot;
      }),
    }));
  };

  const handleBlockDate = async () => {
    try {
      await timeSlotApi.blockDateOrSlots(blockData);
      setBlockDialogOpen(false);
      fetchTimeSlots();
      fetchStats();
      setBlockData({
        dayOfWeek: "",
        blockedDate: "",
        reason: "",
        blockedSlots: [],
      });
      toast.success("Date blocked successfully!");
    } catch (error) {
      console.error("Error blocking date:", error);
      toast.error("Failed to block date");
    }
  };

  const handleUnblockDate = async (dayOfWeek, blockedDate) => {
    if (window.confirm(`Are you sure you want to unblock ${blockedDate}?`)) {
      try {
        await timeSlotApi.unblockDate(dayOfWeek, blockedDate);
        fetchTimeSlots();
        fetchStats();
        toast.success("Date unblocked successfully!");
      } catch (error) {
        console.error("Error unblocking date:", error);
        toast.error("Failed to unblock date");
      }
    }
  };

  if (userContext?.role !== "service_center") {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Access denied. Only service centers can manage time slots.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1400, margin: "0 auto" }}>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#2c3e50" }}>
            <ScheduleIcon sx={{ mr: 2, verticalAlign: "middle" }} />
            Manage Time Slots
          </Typography>
          <Typography variant="body1" sx={{ color: "#7f8c8d", mt: 1 }}>
            Configure your working hours and available appointment slots
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => {
              fetchTimeSlots();
              fetchStats();
            }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<EventBusyIcon />}
            onClick={() => setBlockDialogOpen(true)}
            sx={{
              backgroundColor: "#e74c3c",
              "&:hover": { backgroundColor: "#c0392b" },
            }}
          >
            Block Date
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{ background: "linear-gradient(45deg, #3498db, #2980b9)" }}
            >
              <CardContent sx={{ color: "white", textAlign: "center" }}>
                <AnalyticsIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {stats.totalDaysConfigured}
                </Typography>
                <Typography variant="body2">Days Configured</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{ background: "linear-gradient(45deg, #27ae60, #229954)" }}
            >
              <CardContent sx={{ color: "white", textAlign: "center" }}>
                <CheckCircleIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {stats.openDays}
                </Typography>
                <Typography variant="body2">Open Days</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{ background: "linear-gradient(45deg, #f39c12, #e67e22)" }}
            >
              <CardContent sx={{ color: "white", textAlign: "center" }}>
                <AccessTime sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {stats.totalSlots}
                </Typography>
                <Typography variant="body2">Total Slots</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{ background: "linear-gradient(45deg, #e74c3c, #c0392b)" }}
            >
              <CardContent sx={{ color: "white", textAlign: "center" }}>
                <BlockIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {stats.totalBlockedDates}
                </Typography>
                <Typography variant="body2">Blocked Dates</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Time Slots Management */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Weekly Schedule Configuration
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {DAYS_OF_WEEK.map((dayInfo) => {
              const daySlot = timeSlots.find(
                (slot) => slot.dayOfWeek === dayInfo.key
              );
              const isConfigured = daySlot && daySlot._id;
              const isOpen = daySlot?.workingHours?.isOpen;
              const hasBlockedDates = daySlot?.blockedDates?.length > 0;

              return (
                <Grid item xs={12} key={dayInfo.key}>
                  <Accordion
                    expanded={expandedDay === dayInfo.key}
                    onChange={() =>
                      setExpandedDay(
                        expandedDay === dayInfo.key ? null : dayInfo.key
                      )
                    }
                    sx={{
                      border: isConfigured
                        ? isOpen
                          ? "2px solid #27ae60"
                          : "2px solid #95a5a6"
                        : "2px dashed #bdc3c7",
                      backgroundColor: isOpen ? "#f8f9fa" : "#ffffff",
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {dayInfo.label}
                          </Typography>
                          {isConfigured && (
                            <Chip
                              label={isOpen ? "Open" : "Closed"}
                              color={isOpen ? "success" : "default"}
                              size="small"
                            />
                          )}
                          {daySlot?.availableSlots?.length > 0 && (
                            <Badge
                              badgeContent={daySlot.availableSlots.length}
                              color="primary"
                            >
                              <AccessTime />
                            </Badge>
                          )}
                          {hasBlockedDates && (
                            <Badge
                              badgeContent={daySlot.blockedDates.length}
                              color="error"
                            >
                              <BlockIcon fontSize="small" />
                            </Badge>
                          )}
                        </Box>
                        <Box
                          sx={{ display: "flex", gap: 1 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            startIcon={
                              isConfigured ? <EditIcon /> : <AddIcon />
                            }
                            onClick={() =>
                              handleEditDay(
                                daySlot || { dayOfWeek: dayInfo.key }
                              )
                            }
                            variant={isConfigured ? "outlined" : "contained"}
                            size="small"
                          >
                            {isConfigured ? "Edit" : "Configure"}
                          </Button>
                          {isConfigured && (
                            <IconButton
                              onClick={() => handleDeleteDay(dayInfo.key)}
                              color="error"
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      {isConfigured && (
                        <Box>
                          {isOpen && (
                            <>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 2 }}
                              >
                                Working Hours: {daySlot.workingHours.startTime}{" "}
                                - {daySlot.workingHours.endTime}
                              </Typography>

                              {/* Available Slots */}
                              <Typography
                                variant="subtitle2"
                                sx={{ mb: 1, fontWeight: 600 }}
                              >
                                Available Time Slots (
                                {daySlot.availableSlots?.length || 0})
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 1,
                                  mb: 2,
                                }}
                              >
                                {daySlot.availableSlots?.map((slot, index) => (
                                  <Chip
                                    key={index}
                                    label={`${slot.startTime}-${slot.endTime} (${slot.duration}min)`}
                                    variant="outlined"
                                    size="small"
                                    color="primary"
                                  />
                                ))}
                              </Box>
                            </>
                          )}

                          {/* Blocked Dates */}
                          {hasBlockedDates && (
                            <>
                              <Divider sx={{ my: 2 }} />
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  mb: 1,
                                  fontWeight: 600,
                                  color: "#e74c3c",
                                }}
                              >
                                Blocked Dates ({daySlot.blockedDates.length})
                              </Typography>
                              <List dense>
                                {daySlot.blockedDates.map((blocked, index) => (
                                  <ListItem key={index} sx={{ py: 0.5 }}>
                                    <ListItemText
                                      primary={blocked.date}
                                      secondary={
                                        blocked.reason || "No reason provided"
                                      }
                                    />
                                    <ListItemSecondaryAction>
                                      <Button
                                        size="small"
                                        color="primary"
                                        onClick={() =>
                                          handleUnblockDate(
                                            dayInfo.key,
                                            blocked.date
                                          )
                                        }
                                      >
                                        Unblock
                                      </Button>
                                    </ListItemSecondaryAction>
                                  </ListItem>
                                ))}
                              </List>
                            </>
                          )}

                          {!isOpen && (
                            <Alert severity="info" sx={{ mt: 2 }}>
                              This day is marked as closed. Click "Edit" to
                              configure working hours.
                            </Alert>
                          )}
                        </Box>
                      )}

                      {!isConfigured && (
                        <Alert severity="info">
                          No schedule configured for {dayInfo.label}. Click
                          "Configure" to set up working hours and time slots.
                        </Alert>
                      )}
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Paper>

      {/* Edit Day Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedDay?._id ? "Edit" : "Configure"} {formData.dayOfWeek}{" "}
          Schedule
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {/* Working Hours */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              Working Hours
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.workingHours.isOpen}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      workingHours: {
                        ...prev.workingHours,
                        isOpen: e.target.checked,
                      },
                    }))
                  }
                />
              }
              label={formData.workingHours.isOpen ? "Open" : "Closed"}
              sx={{ mb: 2 }}
            />

            {formData.workingHours.isOpen && (
              <Box>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Start Time"
                      type="time"
                      value={formData.workingHours.startTime}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          workingHours: {
                            ...prev.workingHours,
                            startTime: e.target.value,
                          },
                        }))
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="End Time"
                      type="time"
                      value={formData.workingHours.endTime}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          workingHours: {
                            ...prev.workingHours,
                            endTime: e.target.value,
                          },
                        }))
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>

                {/* Available Slots */}
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Available Time Slots
                </Typography>
                {formData.availableSlots.map((slot, index) => (
                  <Card key={index} sx={{ mb: 2, p: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={3}>
                        <TextField
                          fullWidth
                          label="Start Time"
                          type="time"
                          value={slot.startTime}
                          onChange={(e) =>
                            handleSlotChange(index, "startTime", e.target.value)
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          fullWidth
                          label="End Time"
                          type="time"
                          value={slot.endTime}
                          onChange={(e) =>
                            handleSlotChange(index, "endTime", e.target.value)
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          fullWidth
                          label="Duration (minutes)"
                          type="number"
                          value={slot.duration}
                          onChange={(e) =>
                            handleSlotChange(
                              index,
                              "duration",
                              parseInt(e.target.value)
                            )
                          }
                          InputProps={{ inputProps: { min: 15, max: 480 } }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <IconButton
                          onClick={() => handleRemoveTimeSlot(index)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Card>
                ))}

                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddTimeSlot}
                  variant="outlined"
                  sx={{ mt: 1 }}
                >
                  Add Time Slot
                </Button>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSaveSlots}
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Save Schedule
          </Button>
        </DialogActions>
      </Dialog>

      {/* Block Date Dialog */}
      <Dialog
        open={blockDialogOpen}
        onClose={() => setBlockDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Block Date</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Day of Week</FormLabel>
              <RadioGroup
                value={blockData.dayOfWeek}
                onChange={(e) =>
                  setBlockData((prev) => ({
                    ...prev,
                    dayOfWeek: e.target.value,
                  }))
                }
              >
                {DAYS_OF_WEEK.map((day) => (
                  <FormControlLabel
                    key={day.key}
                    value={day.key}
                    control={<Radio />}
                    label={day.label}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <TextField
              fullWidth
              label="Date"
              type="date"
              value={blockData.blockedDate}
              onChange={(e) =>
                setBlockData((prev) => ({
                  ...prev,
                  blockedDate: e.target.value,
                }))
              }
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Reason (Optional)"
              multiline
              rows={3}
              value={blockData.reason}
              onChange={(e) =>
                setBlockData((prev) => ({ ...prev, reason: e.target.value }))
              }
              placeholder="Enter reason for blocking this date..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBlockDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleBlockDate}
            variant="contained"
            color="error"
            startIcon={<BlockIcon />}
            disabled={!blockData.dayOfWeek || !blockData.blockedDate}
          >
            Block Date
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageSlotsPage;
