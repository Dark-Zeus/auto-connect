// src/components/ServiceProvider/SlotManager.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Grid,
  List,
  Loader,
} from "lucide-react";
import { toast } from "react-toastify";

const SlotManager = ({
  selectedDate,
  onDateChange,
  workingHours,
  slotSettings,
  onStatsUpdate,
}) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateTimeSlots();
    fetchExistingSlots();
  }, [selectedDate, workingHours, slotSettings]);

  const generateTimeSlots = useCallback(() => {
    const date = new Date(selectedDate);
    const dayName = date
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    const daySchedule = workingHours[dayName];

    if (!daySchedule?.isOpen) {
      setTimeSlots([]);
      updateStats([]);
      return;
    }

    const slots = [];
    const { defaultDuration, bufferTime } = slotSettings;
    const startTime = daySchedule.startTime;
    const endTime = daySchedule.endTime;
    const breakStart = daySchedule.breakStart;
    const breakEnd = daySchedule.breakEnd;

    // Convert time strings to minutes from midnight
    const timeToMinutes = (timeStr) => {
      if (!timeStr) return null;
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const minutesToTime = (minutes) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}`;
    };

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    const breakStartMinutes = breakStart ? timeToMinutes(breakStart) : null;
    const breakEndMinutes = breakEnd ? timeToMinutes(breakEnd) : null;

    let currentMinutes = startMinutes;
    let slotIndex = 0;

    while (currentMinutes + defaultDuration <= endMinutes) {
      // Skip break time
      if (
        breakStartMinutes &&
        breakEndMinutes &&
        currentMinutes < breakEndMinutes &&
        currentMinutes + defaultDuration > breakStartMinutes
      ) {
        currentMinutes = breakEndMinutes;
        continue;
      }

      const slotStart = minutesToTime(currentMinutes);
      const slotEnd = minutesToTime(currentMinutes + defaultDuration);

      slots.push({
        id: `${selectedDate}-${slotStart}`,
        date: selectedDate,
        startTime: slotStart,
        endTime: slotEnd,
        duration: defaultDuration,
        status: "available", // available, booked, blocked
        isAvailable: true,
        customerInfo: null,
        serviceType: null,
        notes: "",
        index: slotIndex++,
      });

      currentMinutes += defaultDuration + bufferTime;
    }

    setTimeSlots(slots);
    updateStats(slots);
  }, [selectedDate, workingHours, slotSettings]);

  const fetchExistingSlots = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/v1/services/time-slots?date=${selectedDate}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.slots && data.slots.length > 0) {
          // Merge generated slots with existing data
          setTimeSlots((prevSlots) => {
            return prevSlots.map((slot) => {
              const existingSlot = data.slots.find(
                (s) => s.startTime === slot.startTime
              );
              return existingSlot ? { ...slot, ...existingSlot } : slot;
            });
          });
        }
      }
    } catch (error) {
      console.error("Error fetching existing slots:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (slots) => {
    const stats = {
      totalSlots: slots.length,
      availableSlots: slots.filter((s) => s.status === "available").length,
      bookedSlots: slots.filter((s) => s.status === "booked").length,
      blockedSlots: slots.filter((s) => s.status === "blocked").length,
    };

    if (onStatsUpdate) {
      onStatsUpdate(stats);
    }
  };

  const toggleSlotStatus = async (slotId) => {
    const slot = timeSlots.find((s) => s.id === slotId);
    if (!slot || slot.status === "booked") return;

    const newStatus = slot.status === "available" ? "blocked" : "available";

    try {
      const response = await fetch(
        `/api/v1/services/time-slots/${slotId}/toggle`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        const updatedSlots = timeSlots.map((s) =>
          s.id === slotId ? { ...s, status: newStatus } : s
        );
        setTimeSlots(updatedSlots);
        updateStats(updatedSlots);
        toast.success(
          `Slot ${
            newStatus === "blocked" ? "blocked" : "unblocked"
          } successfully`
        );
      } else {
        toast.error("Failed to update slot status");
      }
    } catch (error) {
      console.error("Error toggling slot status:", error);
      toast.error("Network error. Please try again.");
    }
  };

  const bulkToggleSlots = async (action) => {
    if (selectedSlots.length === 0) {
      toast.warning("Please select slots first");
      return;
    }

    const newStatus = action === "block" ? "blocked" : "available";

    try {
      setLoading(true);
      const response = await fetch("/api/v1/services/time-slots/bulk-update", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slotIds: selectedSlots,
          status: newStatus,
        }),
      });

      if (response.ok) {
        const updatedSlots = timeSlots.map((slot) =>
          selectedSlots.includes(slot.id) && slot.status !== "booked"
            ? { ...slot, status: newStatus }
            : slot
        );
        setTimeSlots(updatedSlots);
        updateStats(updatedSlots);
        setSelectedSlots([]);
        toast.success(`${selectedSlots.length} slots ${action}ed successfully`);
      } else {
        toast.error(`Failed to ${action} slots`);
      }
    } catch (error) {
      console.error(`Error ${action}ing slots:`, error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSlotSelection = (slotId) => {
    setSelectedSlots((prev) =>
      prev.includes(slotId)
        ? prev.filter((id) => id !== slotId)
        : [...prev, slotId]
    );
  };

  const selectAllAvailableSlots = () => {
    const availableSlots = timeSlots
      .filter((slot) => slot.status === "available")
      .map((slot) => slot.id);
    setSelectedSlots(availableSlots);
  };

  const selectAllBlockedSlots = () => {
    const blockedSlots = timeSlots
      .filter((slot) => slot.status === "blocked")
      .map((slot) => slot.id);
    setSelectedSlots(blockedSlots);
  };

  const clearSelection = () => {
    setSelectedSlots([]);
  };

  const regenerateSlots = async () => {
    const confirm = window.confirm(
      "This will regenerate all time slots for this date based on current working hours. Existing bookings will be preserved but custom slot modifications will be lost. Continue?"
    );

    if (!confirm) return;

    try {
      setIsGenerating(true);
      const response = await fetch("/api/v1/services/regenerate-slots", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: selectedDate,
          workingHours,
          slotSettings,
        }),
      });

      if (response.ok) {
        toast.success("Time slots regenerated successfully!");
        await fetchExistingSlots();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to regenerate slots");
      }
    } catch (error) {
      console.error("Error regenerating slots:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const getSlotStatusColor = (status) => {
    switch (status) {
      case "available":
        return "tw:bg-green-50 tw:border-green-200 tw:text-green-800";
      case "booked":
        return "tw:bg-blue-50 tw:border-blue-200 tw:text-blue-800";
      case "blocked":
        return "tw:bg-red-50 tw:border-red-200 tw:text-red-800";
      default:
        return "tw:bg-gray-50 tw:border-gray-200 tw:text-gray-800";
    }
  };

  const getSlotIcon = (status) => {
    switch (status) {
      case "available":
        return <CheckCircle className="tw:h-4 tw:w-4 tw:text-green-600" />;
      case "booked":
        return <User className="tw:h-4 tw:w-4 tw:text-blue-600" />;
      case "blocked":
        return <XCircle className="tw:h-4 tw:w-4 tw:text-red-600" />;
      default:
        return <Clock className="tw:h-4 tw:w-4 tw:text-gray-600" />;
    }
  };

  const isPastDate = new Date(selectedDate) < new Date().setHours(0, 0, 0, 0);
  const isToday = selectedDate === new Date().toISOString().split("T")[0];

  return (
    <div className="tw:space-y-6">
      {/* Date Selection and Controls */}
      <div className="tw:flex tw:flex-col lg:tw:flex-row tw:justify-between tw:items-start lg:tw:items-center tw:space-y-4 lg:tw:space-y-0 tw:bg-gray-50 tw:p-4 tw:rounded-lg">
        <div className="tw:flex tw:flex-col sm:tw:flex-row tw:items-start sm:tw:items-center tw:space-y-3 sm:tw:space-y-0 sm:tw:space-x-4">
          <div>
            <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-1">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="tw:px-3 tw:py-2 tw:border tw:border-gray-300 tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-500 tw:bg-white"
            />
          </div>

          <div className="tw:flex tw:items-center tw:space-x-2">
            <span className="tw:text-sm tw:text-gray-600">View:</span>
            <button
              onClick={() => setViewMode("grid")}
              className={`tw:p-2 tw:rounded-md tw:transition-colors ${
                viewMode === "grid"
                  ? "tw:bg-blue-600 tw:text-white"
                  : "tw:bg-white tw:text-gray-700 tw:border tw:border-gray-300 hover:tw:bg-gray-50"
              }`}
              title="Grid View"
            >
              <Grid className="tw:h-4 tw:w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`tw:p-2 tw:rounded-md tw:transition-colors ${
                viewMode === "list"
                  ? "tw:bg-blue-600 tw:text-white"
                  : "tw:bg-white tw:text-gray-700 tw:border tw:border-gray-300 hover:tw:bg-gray-50"
              }`}
              title="List View"
            >
              <List className="tw:h-4 tw:w-4" />
            </button>
          </div>

          <button
            onClick={regenerateSlots}
            disabled={isGenerating || isPastDate}
            className="tw:bg-purple-600 tw:text-white tw:px-3 tw:py-2 tw:rounded-md tw:text-sm tw:font-medium tw:hover:tw:bg-purple-700 tw:transition-colors tw:flex tw:items-center tw:space-x-1 disabled:tw:opacity-50 disabled:tw:cursor-not-allowed"
            title="Regenerate slots based on current working hours"
          >
            <RotateCcw
              className={`tw:h-4 tw:w-4 ${
                isGenerating ? "tw:animate-spin" : ""
              }`}
            />
            <span>{isGenerating ? "Generating..." : "Regenerate"}</span>
          </button>
        </div>

        {/* Bulk Actions */}
        <div className="tw:flex tw:flex-wrap tw:items-center tw:space-x-2 tw:space-y-2 sm:tw:space-y-0">
          {selectedSlots.length > 0 && (
            <div className="tw:flex tw:items-center tw:space-x-2 tw:bg-white tw:px-3 tw:py-2 tw:rounded-lg tw:border">
              <span className="tw:text-sm tw:text-gray-600 tw:font-medium">
                {selectedSlots.length} selected
              </span>
              <button
                onClick={() => bulkToggleSlots("block")}
                disabled={loading}
                className="tw:bg-red-600 tw:text-white tw:px-3 tw:py-1 tw:rounded tw:text-sm hover:tw:bg-red-700 tw:transition-colors disabled:tw:opacity-50"
              >
                Block
              </button>
              <button
                onClick={() => bulkToggleSlots("unblock")}
                disabled={loading}
                className="tw:bg-green-600 tw:text-white tw:px-3 tw:py-1 tw:rounded tw:text-sm hover:tw:bg-green-700 tw:transition-colors disabled:tw:opacity-50"
              >
                Unblock
              </button>
              <button
                onClick={clearSelection}
                className="tw:bg-gray-600 tw:text-white tw:px-3 tw:py-1 tw:rounded tw:text-sm hover:tw:bg-gray-700 tw:transition-colors"
              >
                Clear
              </button>
            </div>
          )}

          <div className="tw:flex tw:space-x-2">
            <button
              onClick={selectAllAvailableSlots}
              className="tw:bg-blue-600 tw:text-white tw:px-3 tw:py-2 tw:rounded tw:text-sm hover:tw:bg-blue-700 tw:transition-colors"
            >
              Select Available
            </button>
            <button
              onClick={selectAllBlockedSlots}
              className="tw:bg-orange-600 tw:text-white tw:px-3 tw:py-2 tw:rounded tw:text-sm hover:tw:bg-orange-700 tw:transition-colors"
            >
              Select Blocked
            </button>
          </div>
        </div>
      </div>

      {/* Date Info Banner */}
      <div
        className={`tw:p-4 tw:rounded-lg tw:border-l-4 ${
          isPastDate
            ? "tw:bg-red-50 tw:border-red-400"
            : isToday
            ? "tw:bg-blue-50 tw:border-blue-400"
            : "tw:bg-green-50 tw:border-green-400"
        }`}
      >
        <div className="tw:flex tw:items-center tw:justify-between">
          <div>
            <h3
              className={`tw:font-medium ${
                isPastDate
                  ? "tw:text-red-800"
                  : isToday
                  ? "tw:text-blue-800"
                  : "tw:text-green-800"
              }`}
            >
              {isPastDate ? "Past Date" : isToday ? "Today" : "Future Date"} -{" "}
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h3>
            <p
              className={`tw:text-sm ${
                isPastDate
                  ? "tw:text-red-600"
                  : isToday
                  ? "tw:text-blue-600"
                  : "tw:text-green-600"
              }`}
            >
              {isPastDate
                ? "Time slots for past dates are read-only"
                : isToday
                ? "Current day - slots can be managed in real-time"
                : "Future date - all slot management options available"}
            </p>
          </div>
          {timeSlots.length > 0 && (
            <div className="tw:text-right">
              <div className="tw:text-sm tw:text-gray-600">
                Total Slots: {timeSlots.length}
              </div>
              <div className="tw:text-xs tw:text-gray-500">
                {timeSlots[0]?.startTime} -{" "}
                {timeSlots[timeSlots.length - 1]?.endTime}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="tw:flex tw:justify-center tw:items-center tw:py-8">
          <div className="tw:flex tw:flex-col tw:items-center tw:space-y-3">
            <Loader className="tw:h-8 tw:w-8 tw:text-blue-600 tw:animate-spin" />
            <div className="tw:text-gray-600">Loading time slots...</div>
          </div>
        </div>
      )}

      {/* No Slots Available */}
      {!loading && timeSlots.length === 0 && (
        <div className="tw:text-center tw:py-12 tw:bg-gray-50 tw:rounded-lg">
          <AlertCircle className="tw:h-16 tw:w-16 tw:text-gray-400 tw:mx-auto tw:mb-4" />
          <h3 className="tw:text-lg tw:font-semibold tw:text-gray-800 tw:mb-2">
            No time slots available
          </h3>
          <p className="tw:text-gray-600 tw:mb-4">
            {isPastDate
              ? "Cannot manage slots for past dates"
              : "The business appears to be closed on this day, or working hours need to be configured"}
          </p>
          {!isPastDate && (
            <div className="tw:space-x-4">
              <button
                onClick={() =>
                  onDateChange(new Date().toISOString().split("T")[0])
                }
                className="tw:text-blue-600 hover:tw:text-blue-800 tw:font-medium"
              >
                Go to Today
              </button>
              <button
                onClick={regenerateSlots}
                className="tw:bg-blue-600 tw:text-white tw:px-4 tw:py-2 tw:rounded-lg hover:tw:bg-blue-700 tw:transition-colors"
              >
                Generate Slots
              </button>
            </div>
          )}
        </div>
      )}

      {/* Time Slots Display */}
      {!loading && timeSlots.length > 0 && (
        <>
          {viewMode === "grid" ? (
            <div className="tw:grid tw:grid-cols-2 sm:tw:grid-cols-3 md:tw:grid-cols-4 lg:tw:grid-cols-5 xl:tw:grid-cols-6 tw:gap-3">
              {timeSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`tw:relative tw:p-3 tw:border-2 tw:rounded-lg tw:cursor-pointer tw:transition-all tw:duration-200 ${getSlotStatusColor(
                    slot.status
                  )} ${
                    selectedSlots.includes(slot.id)
                      ? "tw:ring-2 tw:ring-blue-500 tw:ring-offset-1"
                      : ""
                  } ${
                    slot.status === "booked" || isPastDate
                      ? "tw:cursor-not-allowed tw:opacity-75"
                      : "hover:tw:shadow-md hover:tw:scale-105"
                  }`}
                  onClick={() => {
                    if (slot.status !== "booked" && !isPastDate) {
                      handleSlotSelection(slot.id);
                    }
                  }}
                >
                  {/* Selection Checkbox */}
                  {slot.status !== "booked" && !isPastDate && (
                    <input
                      type="checkbox"
                      checked={selectedSlots.includes(slot.id)}
                      onChange={() => handleSlotSelection(slot.id)}
                      className="tw:absolute tw:top-1 tw:right-1 tw:h-3 tw:w-3"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}

                  <div className="tw:flex tw:items-center tw:space-x-2 tw:mb-2">
                    {getSlotIcon(slot.status)}
                    <div className="tw:text-sm tw:font-medium">
                      {slot.startTime}
                    </div>
                  </div>

                  <div className="tw:text-xs tw:text-gray-600 tw:mb-1">
                    {slot.endTime}
                  </div>

                  <div className="tw:text-xs tw:font-semibold tw:capitalize tw:mb-1">
                    {slot.status}
                  </div>

                  {slot.customerInfo && (
                    <div className="tw:text-xs tw:text-gray-600 tw:truncate tw:mb-1">
                      👤 {slot.customerInfo.name}
                    </div>
                  )}

                  {slot.serviceType && (
                    <div className="tw:text-xs tw:text-gray-600 tw:truncate tw:mb-1">
                      🔧 {slot.serviceType}
                    </div>
                  )}

                  {slot.notes && (
                    <div className="tw:text-xs tw:text-gray-500 tw:truncate">
                      📝 {slot.notes}
                    </div>
                  )}

                  {/* Action Button */}
                  {slot.status !== "booked" && !isPastDate && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSlotStatus(slot.id);
                      }}
                      className="tw:absolute tw:bottom-1 tw:left-1 tw:text-xs tw:bg-white tw:bg-opacity-80 tw:px-2 tw:py-1 tw:rounded tw:hover:tw:bg-opacity-100 tw:transition-opacity tw:shadow-sm"
                    >
                      {slot.status === "available" ? "Block" : "Unblock"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="tw:space-y-2">
              {timeSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`tw:flex tw:items-center tw:justify-between tw:p-4 tw:border tw:rounded-lg tw:transition-colors ${getSlotStatusColor(
                    slot.status
                  )} ${
                    selectedSlots.includes(slot.id)
                      ? "tw:ring-2 tw:ring-blue-500"
                      : ""
                  } ${
                    slot.status === "booked" || isPastDate
                      ? "tw:opacity-75"
                      : "hover:tw:shadow-sm"
                  }`}
                >
                  <div className="tw:flex tw:items-center tw:space-x-4">
                    {slot.status !== "booked" && !isPastDate && (
                      <input
                        type="checkbox"
                        checked={selectedSlots.includes(slot.id)}
                        onChange={() => handleSlotSelection(slot.id)}
                        className="tw:h-4 tw:w-4"
                      />
                    )}

                    {getSlotIcon(slot.status)}

                    <div>
                      <div className="tw:font-medium tw:text-gray-900">
                        {slot.startTime} - {slot.endTime}
                      </div>
                      <div className="tw:text-sm tw:text-gray-600">
                        Duration: {slot.duration} minutes
                      </div>
                    </div>
                  </div>

                  <div className="tw:flex tw:items-center tw:space-x-4">
                    <div className="tw:text-right tw:flex-1">
                      <div className="tw:text-sm tw:font-semibold tw:capitalize tw:mb-1">
                        {slot.status}
                      </div>
                      {slot.customerInfo && (
                        <div className="tw:text-xs tw:text-gray-600 tw:mb-1">
                          Customer: {slot.customerInfo.name}
                        </div>
                      )}
                      {slot.serviceType && (
                        <div className="tw:text-xs tw:text-gray-600 tw:mb-1">
                          Service: {slot.serviceType}
                        </div>
                      )}
                      {slot.notes && (
                        <div className="tw:text-xs tw:text-gray-500">
                          Notes: {slot.notes}
                        </div>
                      )}
                    </div>

                    {slot.status !== "booked" && !isPastDate && (
                      <button
                        onClick={() => toggleSlotStatus(slot.id)}
                        className={`tw:px-3 tw:py-1 tw:rounded tw:text-sm tw:font-medium tw:transition-colors ${
                          slot.status === "available"
                            ? "tw:bg-red-600 tw:text-white hover:tw:bg-red-700"
                            : "tw:bg-green-600 tw:text-white hover:tw:bg-green-700"
                        }`}
                      >
                        {slot.status === "available" ? "Block" : "Unblock"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Legend */}
      {timeSlots.length > 0 && (
        <div className="tw:bg-white tw:border tw:border-gray-200 tw:rounded-lg tw:p-4">
          <h4 className="tw:text-sm tw:font-semibold tw:text-gray-800 tw:mb-3">
            Legend
          </h4>
          <div className="tw:flex tw:flex-wrap tw:items-center tw:justify-center tw:space-x-6 tw:text-sm">
            <div className="tw:flex tw:items-center tw:space-x-2">
              <CheckCircle className="tw:h-4 tw:w-4 tw:text-green-600" />
              <span className="tw:text-gray-700">
                Available (
                {timeSlots.filter((s) => s.status === "available").length})
              </span>
            </div>
            <div className="tw:flex tw:items-center tw:space-x-2">
              <User className="tw:h-4 tw:w-4 tw:text-blue-600" />
              <span className="tw:text-gray-700">
                Booked ({timeSlots.filter((s) => s.status === "booked").length})
              </span>
            </div>
            <div className="tw:flex tw:items-center tw:space-x-2">
              <XCircle className="tw:h-4 tw:w-4 tw:text-red-600" />
              <span className="tw:text-gray-700">
                Blocked (
                {timeSlots.filter((s) => s.status === "blocked").length})
              </span>
            </div>
            <div className="tw:text-gray-500 tw:text-xs">
              Total: {timeSlots.length} slots
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      {timeSlots.length > 0 && !isPastDate && (
        <div className="tw:bg-blue-50 tw:border tw:border-blue-200 tw:rounded-lg tw:p-4">
          <div className="tw:flex tw:items-start tw:space-x-3">
            <AlertCircle className="tw:h-5 tw:w-5 tw:text-blue-600 tw:mt-0.5 tw:flex-shrink-0" />
            <div>
              <h4 className="tw:text-sm tw:font-semibold tw:text-blue-800 tw:mb-2">
                Quick Tips
              </h4>
              <ul className="tw:text-sm tw:text-blue-700 tw:space-y-1">
                <li>• Click on slots to select them for bulk operations</li>
                <li>• Block slots during lunch breaks or when unavailable</li>
                <li>• Use "Regenerate" if you've changed working hours</li>
                <li>• Booked slots cannot be modified (shown in blue)</li>
                {isToday && (
                  <li>• Past time slots for today are automatically blocked</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotManager;
