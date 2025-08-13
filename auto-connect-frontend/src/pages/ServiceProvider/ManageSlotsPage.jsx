// src/pages/ServiceProvider/ManageSlotsPage.jsx - Fixed & Simplified Version
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Save,
  Info,
  Settings,
  Zap,
} from "lucide-react";
import { UserContext } from "@contexts/UserContext";
import { toast } from "react-toastify";
import SlotManager from "@components/ServiceProvider/SlotManager";
import "./ManageSlotsPage.css";

const ManageSlotsPage = () => {
  const navigate = useNavigate();
  const { userContext } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [workingHours, setWorkingHours] = useState({
    monday: {
      isOpen: true,
      startTime: "08:00",
      endTime: "17:00",
      breakStart: "12:00",
      breakEnd: "13:00",
    },
    tuesday: {
      isOpen: true,
      startTime: "08:00",
      endTime: "17:00",
      breakStart: "12:00",
      breakEnd: "13:00",
    },
    wednesday: {
      isOpen: true,
      startTime: "08:00",
      endTime: "17:00",
      breakStart: "12:00",
      breakEnd: "13:00",
    },
    thursday: {
      isOpen: true,
      startTime: "08:00",
      endTime: "17:00",
      breakStart: "12:00",
      breakEnd: "13:00",
    },
    friday: {
      isOpen: true,
      startTime: "08:00",
      endTime: "17:00",
      breakStart: "12:00",
      breakEnd: "13:00",
    },
    saturday: {
      isOpen: true,
      startTime: "08:00",
      endTime: "15:00",
      breakStart: "",
      breakEnd: "",
    },
    sunday: {
      isOpen: false,
      startTime: "",
      endTime: "",
      breakStart: "",
      breakEnd: "",
    },
  });
  const [slotSettings, setSlotSettings] = useState({
    defaultDuration: 60,
    bufferTime: 15,
    maxAdvanceBooking: 30,
    minAdvanceBooking: 1,
  });
  const [stats, setStats] = useState({
    totalSlots: 0,
    bookedSlots: 0,
    availableSlots: 0,
    blockedSlots: 0,
  });

  useEffect(() => {
    fetchWorkingHours();
    fetchSlotSettings();
    fetchSlotStats();
  }, []);

  useEffect(() => {
    fetchSlotStats();
  }, [selectedDate]);

  // FIXED: API call with proper error handling
  const fetchWorkingHours = async () => {
    console.log("🔍 Debug - User context:", userContext);
    console.log("🔍 Debug - User role:", userContext?.role);
    console.log("🔍 Debug - Token exists:", !!localStorage.getItem("token"));

    try {
      const response = await fetch("/api/v1/services/working-hours", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      console.log("🔍 Debug - Response status:", response.status);
      console.log(
        "🔍 Debug - Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      // Check if response is actually JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error(
          "❌ API endpoint not found - received HTML instead of JSON"
        );
        console.error("🔍 Debug - Response text:", await response.text());
        toast.error("API endpoint not configured. Please check backend setup.");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Working hours fetched:", data);
        if (data.success && data.data?.workingHours) {
          setWorkingHours(data.data.workingHours);
        }
      } else {
        console.error("❌ Failed to fetch working hours:", response.status);
        toast.error("Failed to fetch working hours");
      }
    } catch (error) {
      console.error("❌ Error fetching working hours:", error);
      toast.error("Network error. Using default working hours.");
    }
  };

  const fetchSlotSettings = async () => {
    try {
      const response = await fetch("/api/v1/services/slot-settings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("❌ Slot settings API endpoint not found");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Slot settings fetched:", data);
        if (data.success && data.data?.settings) {
          setSlotSettings(data.data.settings);
        }
      } else {
        console.error("❌ Failed to fetch slot settings:", response.status);
      }
    } catch (error) {
      console.error("❌ Error fetching slot settings:", error);
    }
  };

  const fetchSlotStats = async () => {
    try {
      const response = await fetch(
        `/api/v1/services/slot-stats?date=${selectedDate}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("❌ Slot stats API endpoint not found");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Slot stats fetched:", data);
        if (data.success && data.data?.stats) {
          setStats(data.data.stats);
        }
      } else {
        console.error("❌ Failed to fetch slot stats:", response.status);
      }
    } catch (error) {
      console.error("❌ Error fetching slot stats:", error);
    }
  };

  // FIXED: Added missing handler functions
  const handleWorkingHoursChange = (day, field, value) => {
    setWorkingHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleSlotSettingsChange = (field, value) => {
    setSlotSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // FIXED: Improved error handling for save operations
  const saveWorkingHours = async () => {
    setLoading(true);
    try {
      console.log("💾 Saving working hours:", workingHours);

      const response = await fetch("/api/v1/services/working-hours", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workingHours }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("API endpoint not found");
      }

      const data = await response.json();
      console.log("📤 Save working hours response:", data);

      if (response.ok && data.success) {
        toast.success("Working hours saved successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(data.message || "Failed to save working hours");
      }
    } catch (error) {
      console.error("❌ Error saving working hours:", error);
      toast.error("API endpoint not configured. Please check backend setup.");
    } finally {
      setLoading(false);
    }
  };

  const saveSlotSettings = async () => {
    setLoading(true);
    try {
      console.log("💾 Saving slot settings:", slotSettings);

      const response = await fetch("/api/v1/services/slot-settings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings: slotSettings }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("API endpoint not found");
      }

      const data = await response.json();
      console.log("📤 Save slot settings response:", data);

      if (response.ok && data.success) {
        toast.success("Slot settings saved successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(data.message || "Failed to save slot settings");
      }
    } catch (error) {
      console.error("❌ Error saving slot settings:", error);
      toast.error("API endpoint not configured. Please check backend setup.");
    } finally {
      setLoading(false);
    }
  };

  const generateSlotsForWeek = async () => {
    const confirmGenerate = window.confirm(
      "This will generate time slots for the entire week based on your working hours. Continue?"
    );

    if (!confirmGenerate) return;

    setLoading(true);
    try {
      console.log("🔄 Generating weekly slots...");

      const response = await fetch("/api/v1/services/generate-weekly-slots", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: selectedDate,
          workingHours,
          slotSettings,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("API endpoint not found");
      }

      const data = await response.json();
      console.log("📤 Generate slots response:", data);

      if (response.ok && data.success) {
        toast.success("Weekly slots generated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        fetchSlotStats(); // Refresh stats
      } else {
        toast.error(data.message || "Failed to generate slots");
      }
    } catch (error) {
      console.error("❌ Error generating slots:", error);
      toast.error("API endpoint not configured. Please check backend setup.");
    } finally {
      setLoading(false);
    }
  };

  const daysOfWeek = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];

  // Check user permissions
  if (
    !userContext ||
    !["service_center", "repair_center"].includes(userContext.role)
  ) {
    return (
      <div className="manage-slots-page">
        <div className="manage-slots-access-denied">
          <div className="manage-slots-access-denied-card">
            <div className="manage-slots-access-denied-icon">🚫</div>
            <h1>Access Denied</h1>
            <p>
              You don't have permission to manage time slots. This feature is
              only available for service centers and repair centers.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="manage-slots-access-denied-button"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-slots-page manage-slots-fade-in">
      <div className="manage-slots-container">
        {/* Header */}
        <div className="manage-slots-header">
          <div className="manage-slots-header-left">
            <button
              onClick={() => navigate("/dashboard/service-provider/services")}
              className="manage-slots-back-button"
            >
              <ArrowLeft />
              <span>Back to Services</span>
            </button>
          </div>

          <div className="manage-slots-header-actions">
            <button
              onClick={generateSlotsForWeek}
              disabled={loading}
              className="manage-slots-generate-button"
            >
              <Zap />
              <span>{loading ? "Generating..." : "Generate Weekly Slots"}</span>
            </button>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="manage-slots-main-card">
          {/* Title Header */}
          <div className="manage-slots-title-header">
            <div className="manage-slots-title-content">
              <div className="manage-slots-title-icon">
                <Calendar />
              </div>
              <div className="manage-slots-title-text">
                <h1>Time Slot Management</h1>
                <p>
                  Configure your working hours and manage appointment
                  availability
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="manage-slots-stats-section">
            <div className="manage-slots-stats-grid">
              <div className="manage-slots-stat-card blue">
                <div className="manage-slots-stat-number">
                  {stats.totalSlots}
                </div>
                <div className="manage-slots-stat-label">Total Slots</div>
              </div>
              <div className="manage-slots-stat-card green">
                <div className="manage-slots-stat-number">
                  {stats.availableSlots}
                </div>
                <div className="manage-slots-stat-label">Available</div>
              </div>
              <div className="manage-slots-stat-card orange">
                <div className="manage-slots-stat-number">
                  {stats.bookedSlots}
                </div>
                <div className="manage-slots-stat-label">Booked</div>
              </div>
              <div className="manage-slots-stat-card red">
                <div className="manage-slots-stat-number">
                  {stats.blockedSlots}
                </div>
                <div className="manage-slots-stat-label">Blocked</div>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="manage-slots-main-grid">
            {/* Sidebar - Working Hours & Settings */}
            <div className="manage-slots-sidebar">
              {/* Working Hours Configuration */}
              <div className="manage-slots-section-card">
                <div className="manage-slots-section-header blue">
                  <h2>
                    <Clock />
                    <span>Working Hours</span>
                  </h2>
                </div>

                <div className="manage-slots-section-content">
                  <div className="manage-slots-day-config">
                    {daysOfWeek.map(({ key, label }) => (
                      <div key={key} className="manage-slots-day-item">
                        <div className="manage-slots-day-header">
                          <h3 className="manage-slots-day-title">{label}</h3>
                          <div className="manage-slots-day-toggle">
                            <input
                              type="checkbox"
                              id={`${key}-toggle`}
                              checked={workingHours[key].isOpen}
                              onChange={(e) =>
                                handleWorkingHoursChange(
                                  key,
                                  "isOpen",
                                  e.target.checked
                                )
                              }
                            />
                            <label htmlFor={`${key}-toggle`}>Open</label>
                          </div>
                        </div>

                        {workingHours[key].isOpen && (
                          <div className="manage-slots-time-grid">
                            <div className="manage-slots-time-field">
                              <label className="manage-slots-time-label">
                                Start Time
                              </label>
                              <input
                                type="time"
                                value={workingHours[key].startTime}
                                onChange={(e) =>
                                  handleWorkingHoursChange(
                                    key,
                                    "startTime",
                                    e.target.value
                                  )
                                }
                                className="manage-slots-time-input"
                              />
                            </div>
                            <div className="manage-slots-time-field">
                              <label className="manage-slots-time-label">
                                End Time
                              </label>
                              <input
                                type="time"
                                value={workingHours[key].endTime}
                                onChange={(e) =>
                                  handleWorkingHoursChange(
                                    key,
                                    "endTime",
                                    e.target.value
                                  )
                                }
                                className="manage-slots-time-input"
                              />
                            </div>

                            {key !== "sunday" && (
                              <>
                                <div className="manage-slots-time-field">
                                  <label className="manage-slots-time-label">
                                    Break Start
                                  </label>
                                  <input
                                    type="time"
                                    value={workingHours[key].breakStart}
                                    onChange={(e) =>
                                      handleWorkingHoursChange(
                                        key,
                                        "breakStart",
                                        e.target.value
                                      )
                                    }
                                    className="manage-slots-time-input"
                                  />
                                </div>
                                <div className="manage-slots-time-field">
                                  <label className="manage-slots-time-label">
                                    Break End
                                  </label>
                                  <input
                                    type="time"
                                    value={workingHours[key].breakEnd}
                                    onChange={(e) =>
                                      handleWorkingHoursChange(
                                        key,
                                        "breakEnd",
                                        e.target.value
                                      )
                                    }
                                    className="manage-slots-time-input"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={saveWorkingHours}
                    disabled={loading}
                    className="manage-slots-save-button"
                  >
                    <Save />
                    <span>{loading ? "Saving..." : "Save Working Hours"}</span>
                  </button>
                </div>
              </div>

              {/* Slot Settings */}
              <div className="manage-slots-section-card">
                <div className="manage-slots-section-header green">
                  <h2>
                    <Settings />
                    <span>Slot Settings</span>
                  </h2>
                </div>

                <div className="manage-slots-section-content">
                  <div className="manage-slots-settings-form">
                    <div className="manage-slots-setting-field">
                      <label className="manage-slots-setting-label">
                        Default Slot Duration (minutes)
                      </label>
                      <select
                        value={slotSettings.defaultDuration}
                        onChange={(e) =>
                          handleSlotSettingsChange(
                            "defaultDuration",
                            parseInt(e.target.value)
                          )
                        }
                        className="manage-slots-setting-select"
                      >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={45}>45 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={90}>1.5 hours</option>
                        <option value={120}>2 hours</option>
                      </select>
                    </div>

                    <div className="manage-slots-setting-field">
                      <label className="manage-slots-setting-label">
                        Buffer Time Between Slots (minutes)
                      </label>
                      <select
                        value={slotSettings.bufferTime}
                        onChange={(e) =>
                          handleSlotSettingsChange(
                            "bufferTime",
                            parseInt(e.target.value)
                          )
                        }
                        className="manage-slots-setting-select"
                      >
                        <option value={0}>No buffer</option>
                        <option value={10}>10 minutes</option>
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                      </select>
                    </div>

                    <div className="manage-slots-setting-field">
                      <label className="manage-slots-setting-label">
                        Maximum Advance Booking (days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="90"
                        value={slotSettings.maxAdvanceBooking}
                        onChange={(e) =>
                          handleSlotSettingsChange(
                            "maxAdvanceBooking",
                            parseInt(e.target.value)
                          )
                        }
                        className="manage-slots-setting-input"
                      />
                    </div>

                    <div className="manage-slots-setting-field">
                      <label className="manage-slots-setting-label">
                        Minimum Advance Booking (hours)
                      </label>
                      <select
                        value={slotSettings.minAdvanceBooking}
                        onChange={(e) =>
                          handleSlotSettingsChange(
                            "minAdvanceBooking",
                            parseInt(e.target.value)
                          )
                        }
                        className="manage-slots-setting-select"
                      >
                        <option value={1}>1 hour</option>
                        <option value={2}>2 hours</option>
                        <option value={4}>4 hours</option>
                        <option value={24}>24 hours</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={saveSlotSettings}
                    disabled={loading}
                    className="manage-slots-save-button"
                  >
                    <Save />
                    <span>{loading ? "Saving..." : "Save Settings"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content - Daily Time Slots Management */}
            <div className="manage-slots-main-content">
              <div className="manage-slots-section-card">
                <div className="manage-slots-section-header purple">
                  <h2>
                    <Calendar />
                    <span>Daily Time Slots</span>
                  </h2>
                </div>

                <div className="manage-slots-section-content">
                  <SlotManager
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                    workingHours={workingHours}
                    slotSettings={slotSettings}
                    onStatsUpdate={setStats}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Panel */}
        <div className="manage-slots-info-panel">
          <div className="manage-slots-info-header">
            <Info className="manage-slots-info-icon" />
            <div className="manage-slots-info-content">
              <h3>⏰ Time Slot Management Guidelines</h3>
              <div className="manage-slots-info-grid">
                <div className="manage-slots-info-section">
                  <h4>Working Hours Best Practices:</h4>
                  <ul className="manage-slots-info-list">
                    <li>Set realistic working hours for each day</li>
                    <li>Include break times to avoid overbooking</li>
                    <li>Consider travel time between appointments</li>
                    <li>Update hours for holidays and special occasions</li>
                    <li>Maintain consistency for customer expectations</li>
                  </ul>
                </div>
                <div className="manage-slots-info-section">
                  <h4>Slot Management Tips:</h4>
                  <ul className="manage-slots-info-list">
                    <li>Block slots for maintenance or personal time</li>
                    <li>Generate weekly slots to maintain consistency</li>
                    <li>Monitor booking patterns to optimize availability</li>
                    <li>Set appropriate buffer times between services</li>
                    <li>Review and adjust settings based on demand</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSlotsPage;
