// src/pages/ServiceProvider/ManageSlotsPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Save,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";
import { UserContext } from "@contexts/UserContext";
import { toast } from "react-toastify";
import SlotManager from "@components/ServiceProvider/SlotManager";

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
    defaultDuration: 60, // minutes
    bufferTime: 15, // minutes between slots
    maxAdvanceBooking: 30, // days
    minAdvanceBooking: 1, // hours
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

  const fetchWorkingHours = async () => {
    try {
      const response = await fetch("/api/v1/services/working-hours", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.workingHours) {
          setWorkingHours(data.workingHours);
        }
      }
    } catch (error) {
      console.error("Error fetching working hours:", error);
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

      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setSlotSettings(data.settings);
        }
      }
    } catch (error) {
      console.error("Error fetching slot settings:", error);
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

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error("Error fetching slot stats:", error);
    }
  };

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

  const saveWorkingHours = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/services/working-hours", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workingHours }),
      });

      if (response.ok) {
        toast.success("Working hours saved successfully!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to save working hours");
      }
    } catch (error) {
      console.error("Error saving working hours:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveSlotSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/services/slot-settings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings: slotSettings }),
      });

      if (response.ok) {
        toast.success("Slot settings saved successfully!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to save slot settings");
      }
    } catch (error) {
      console.error("Error saving slot settings:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateSlotsForWeek = async () => {
    const confirmGenerate = window.confirm(
      "This will generate time slots for the entire week based on your working hours. Existing slots will be updated. Continue?"
    );

    if (!confirmGenerate) return;

    setLoading(true);
    try {
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

      if (response.ok) {
        toast.success("Weekly slots generated successfully!");
        fetchSlotStats();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to generate slots");
      }
    } catch (error) {
      console.error("Error generating slots:", error);
      toast.error("Network error. Please try again.");
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
      <div className="tw:min-h-screen tw:w-full tw:bg-gradient-to-br tw:from-slate-100 tw:to-blue-50 tw:flex tw:items-center tw:justify-center">
        <div className="tw:bg-white tw:rounded-lg tw:shadow-lg tw:p-8 tw:text-center tw:max-w-md">
          <div className="tw:text-red-500 tw:text-6xl tw:mb-4">🚫</div>
          <h1 className="tw:text-2xl tw:font-bold tw:text-gray-800 tw:mb-2">
            Access Denied
          </h1>
          <p className="tw:text-gray-600 tw:mb-4">
            You don't have permission to manage time slots. This feature is only
            available for service centers and repair centers.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="tw:bg-blue-600 tw:text-white tw:px-6 tw:py-2 tw:rounded-lg hover:tw:bg-blue-700 tw:transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tw:min-h-screen tw:w-full tw:bg-gradient-to-br tw:from-slate-100 tw:to-blue-50">
      <div className="tw:container tw:mx-auto tw:px-4 tw:py-8">
        {/* Header */}
        <div className="tw:flex tw:items-center tw:justify-between tw:mb-8">
          <div className="tw:flex tw:items-center tw:space-x-4">
            <button
              onClick={() => navigate("/dashboard/service-provider/services")}
              className="tw:flex tw:items-center tw:space-x-2 tw:text-gray-600 hover:tw:text-gray-800 tw:transition-colors tw:group"
            >
              <ArrowLeft className="tw:h-5 tw:w-5 group-hover:tw:-translate-x-1 tw:transition-transform" />
              <span>Back to Services</span>
            </button>
          </div>

          <div className="tw:flex tw:items-center tw:space-x-4">
            <button
              onClick={generateSlotsForWeek}
              disabled={loading}
              className="tw:bg-green-600 tw:text-white tw:px-4 tw:py-2 tw:rounded-lg hover:tw:bg-green-700 tw:transition-colors tw:text-sm disabled:tw:opacity-50 disabled:tw:cursor-not-allowed"
            >
              Generate Weekly Slots
            </button>
          </div>
        </div>

        {/* Page Title */}
        <div className="tw:bg-white tw:rounded-lg tw:shadow-md tw:p-6 tw:mb-8">
          <div className="tw:flex tw:items-center tw:space-x-3 tw:mb-4">
            <div className="tw:bg-blue-600 tw:p-3 tw:rounded-lg">
              <Calendar className="tw:h-6 tw:w-6 tw:text-white" />
            </div>
            <div>
              <h1 className="tw:text-3xl tw:font-bold tw:text-gray-800">
                Time Slot Management
              </h1>
              <p className="tw:text-gray-600">
                Configure your working hours and manage appointment availability
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="tw:grid tw:grid-cols-2 md:tw:grid-cols-4 tw:gap-4">
            <div className="tw:bg-blue-50 tw:p-4 tw:rounded-lg tw:text-center">
              <div className="tw:text-2xl tw:font-bold tw:text-blue-600">
                {stats.totalSlots}
              </div>
              <div className="tw:text-sm tw:text-blue-700">Total Slots</div>
            </div>
            <div className="tw:bg-green-50 tw:p-4 tw:rounded-lg tw:text-center">
              <div className="tw:text-2xl tw:font-bold tw:text-green-600">
                {stats.availableSlots}
              </div>
              <div className="tw:text-sm tw:text-green-700">Available</div>
            </div>
            <div className="tw:bg-orange-50 tw:p-4 tw:rounded-lg tw:text-center">
              <div className="tw:text-2xl tw:font-bold tw:text-orange-600">
                {stats.bookedSlots}
              </div>
              <div className="tw:text-sm tw:text-orange-700">Booked</div>
            </div>
            <div className="tw:bg-red-50 tw:p-4 tw:rounded-lg tw:text-center">
              <div className="tw:text-2xl tw:font-bold tw:text-red-600">
                {stats.blockedSlots}
              </div>
              <div className="tw:text-sm tw:text-red-700">Blocked</div>
            </div>
          </div>
        </div>

        <div className="tw:grid tw:grid-cols-1 xl:tw:grid-cols-3 tw:gap-8">
          {/* Working Hours Configuration */}
          <div className="xl:tw:col-span-1">
            <div className="tw:bg-white tw:rounded-lg tw:shadow-lg tw:overflow-hidden tw:mb-8">
              <div className="tw:px-6 tw:py-4 tw:bg-blue-600 tw:text-white">
                <h2 className="tw:text-xl tw:font-bold tw:flex tw:items-center tw:space-x-2">
                  <Clock className="tw:h-5 tw:w-5" />
                  <span>Working Hours</span>
                </h2>
              </div>

              <div className="tw:p-6 tw:space-y-6">
                {daysOfWeek.map(({ key, label }) => (
                  <div
                    key={key}
                    className="tw:border tw:border-gray-200 tw:rounded-lg tw:p-4"
                  >
                    <div className="tw:flex tw:items-center tw:justify-between tw:mb-3">
                      <h3 className="tw:font-semibold tw:text-gray-800">
                        {label}
                      </h3>
                      <label className="tw:flex tw:items-center tw:space-x-2">
                        <input
                          type="checkbox"
                          checked={workingHours[key].isOpen}
                          onChange={(e) =>
                            handleWorkingHoursChange(
                              key,
                              "isOpen",
                              e.target.checked
                            )
                          }
                          className="tw:h-4 tw:w-4 tw:text-blue-600 tw:focus:ring-blue-500 tw:border-gray-300 tw:rounded"
                        />
                        <span className="tw:text-sm tw:text-gray-600">
                          Open
                        </span>
                      </label>
                    </div>

                    {workingHours[key].isOpen && (
                      <div className="tw:grid tw:grid-cols-2 tw:gap-3">
                        <div>
                          <label className="tw:block tw:text-xs tw:font-medium tw:text-gray-700 tw:mb-1">
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
                            className="tw:w-full tw:px-3 tw:py-2 tw:border tw:border-gray-300 tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-500 tw:text-sm"
                          />
                        </div>
                        <div>
                          <label className="tw:block tw:text-xs tw:font-medium tw:text-gray-700 tw:mb-1">
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
                            className="tw:w-full tw:px-3 tw:py-2 tw:border tw:border-gray-300 tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-500 tw:text-sm"
                          />
                        </div>

                        {key !== "sunday" && (
                          <>
                            <div>
                              <label className="tw:block tw:text-xs tw:font-medium tw:text-gray-700 tw:mb-1">
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
                                className="tw:w-full tw:px-3 tw:py-2 tw:border tw:border-gray-300 tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-500 tw:text-sm"
                              />
                            </div>
                            <div>
                              <label className="tw:block tw:text-xs tw:font-medium tw:text-gray-700 tw:mb-1">
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
                                className="tw:w-full tw:px-3 tw:py-2 tw:border tw:border-gray-300 tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-500 tw:text-sm"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                <button
                  onClick={saveWorkingHours}
                  disabled={loading}
                  className="tw:w-full tw:bg-blue-600 tw:text-white tw:py-3 tw:px-4 tw:rounded-lg hover:tw:bg-blue-700 tw:transition-colors tw:flex tw:items-center tw:justify-center tw:space-x-2 disabled:tw:opacity-50"
                >
                  <Save className="tw:h-4 tw:w-4" />
                  <span>{loading ? "Saving..." : "Save Working Hours"}</span>
                </button>
              </div>
            </div>

            {/* Slot Settings */}
            <div className="tw:bg-white tw:rounded-lg tw:shadow-lg tw:overflow-hidden">
              <div className="tw:px-6 tw:py-4 tw:bg-green-600 tw:text-white">
                <h2 className="tw:text-xl tw:font-bold">Slot Settings</h2>
              </div>

              <div className="tw:p-6 tw:space-y-4">
                <div>
                  <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">
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
                    className="tw:w-full tw:px-3 tw:py-2 tw:border tw:border-gray-300 tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-500"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>

                <div>
                  <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">
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
                    className="tw:w-full tw:px-3 tw:py-2 tw:border tw:border-gray-300 tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-500"
                  >
                    <option value={0}>No buffer</option>
                    <option value={10}>10 minutes</option>
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                  </select>
                </div>

                <div>
                  <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">
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
                    className="tw:w-full tw:px-3 tw:py-2 tw:border tw:border-gray-300 tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">
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
                    className="tw:w-full tw:px-3 tw:py-2 tw:border tw:border-gray-300 tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-500"
                  >
                    <option value={1}>1 hour</option>
                    <option value={2}>2 hours</option>
                    <option value={4}>4 hours</option>
                    <option value={24}>24 hours</option>
                  </select>
                </div>

                <button
                  onClick={saveSlotSettings}
                  disabled={loading}
                  className="tw:w-full tw:bg-green-600 tw:text-white tw:py-3 tw:px-4 tw:rounded-lg hover:tw:bg-green-700 tw:transition-colors tw:flex tw:items-center tw:justify-center tw:space-x-2 disabled:tw:opacity-50"
                >
                  <Save className="tw:h-4 tw:w-4" />
                  <span>{loading ? "Saving..." : "Save Settings"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Daily Time Slots Management */}
          <div className="xl:tw:col-span-2">
            <div className="tw:bg-white tw:rounded-lg tw:shadow-lg tw:overflow-hidden">
              <div className="tw:px-6 tw:py-4 tw:bg-purple-600 tw:text-white">
                <h2 className="tw:text-xl tw:font-bold tw:flex tw:items-center tw:space-x-2">
                  <Calendar className="tw:h-5 tw:w-5" />
                  <span>Daily Time Slots</span>
                </h2>
              </div>

              <div className="tw:p-6">
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

        {/* Information Panel */}
        <div className="tw:mt-8 tw:bg-blue-50 tw:border tw:border-blue-200 tw:rounded-lg tw:p-6">
          <div className="tw:flex tw:items-start tw:space-x-3">
            <Info className="tw:h-6 tw:w-6 tw:text-blue-600 tw:mt-0.5 tw:flex-shrink-0" />
            <div>
              <h3 className="tw:text-lg tw:font-semibold tw:text-blue-800 tw:mb-2">
                Time Slot Management Guidelines
              </h3>
              <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-4 tw:text-sm tw:text-blue-700">
                <div>
                  <h4 className="tw:font-semibold tw:mb-2">Working Hours:</h4>
                  <ul className="tw:space-y-1 tw:list-disc tw:list-inside">
                    <li>Set realistic working hours for each day</li>
                    <li>Include break times to avoid overbooking</li>
                    <li>Consider travel time between appointments</li>
                    <li>Update hours for holidays and special occasions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="tw:font-semibold tw:mb-2">Slot Management:</h4>
                  <ul className="tw:space-y-1 tw:list-disc tw:list-inside">
                    <li>Block slots for maintenance or personal time</li>
                    <li>Generate weekly slots to maintain consistency</li>
                    <li>Monitor booking patterns to optimize availability</li>
                    <li>Set appropriate buffer times between services</li>
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
