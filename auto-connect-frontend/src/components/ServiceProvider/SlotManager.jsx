// src/components/ServiceProvider/SlotManager.jsx - Simplified Version
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
  Eye,
  EyeOff,
  Target,
} from "lucide-react";
import { toast } from "react-toastify";
import "./SlotManager.css";

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
  const [viewMode, setViewMode] = useState("grid");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateTimeSlots();
  }, [selectedDate, workingHours, slotSettings]);

  const generateTimeSlots = useCallback(() => {
    const date = new Date(selectedDate);
    const dayName = date
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    const daySchedule = workingHours[dayName];

    console.log("🔄 Generating slots for:", dayName, daySchedule);

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

      // Determine slot status based on current time
      const now = new Date();
      const isToday = selectedDate === now.toISOString().split("T")[0];
      const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

      let status = "available";
      if (isToday && currentMinutes < currentTimeMinutes) {
        status = "blocked"; // Past slots are blocked
      }

      slots.push({
        id: `${selectedDate}-${slotStart}`,
        date: selectedDate,
        startTime: slotStart,
        endTime: slotEnd,
        duration: defaultDuration,
        status: status,
        isAvailable: status === "available",
        customerInfo: null,
        serviceType: null,
        notes: "",
        index: slotIndex++,
      });

      currentMinutes += defaultDuration + bufferTime;
    }

    console.log("✅ Generated slots:", slots.length);
    setTimeSlots(slots);
    updateStats(slots);
  }, [selectedDate, workingHours, slotSettings]);

  const updateStats = (slots) => {
    const stats = {
      totalSlots: slots.length,
      availableSlots: slots.filter((s) => s.status === "available").length,
      bookedSlots: slots.filter((s) => s.status === "booked").length,
      blockedSlots: slots.filter((s) => s.status === "blocked").length,
    };

    console.log("📊 Updated stats:", stats);
    if (onStatsUpdate) {
      onStatsUpdate(stats);
    }
  };

  const toggleSlotStatus = (slotId) => {
    const slot = timeSlots.find((s) => s.id === slotId);
    if (!slot || slot.status === "booked") return;

    const newStatus = slot.status === "available" ? "blocked" : "available";

    const updatedSlots = timeSlots.map((s) =>
      s.id === slotId ? { ...s, status: newStatus } : s
    );

    setTimeSlots(updatedSlots);
    updateStats(updatedSlots);

    toast.success(
      `Slot ${newStatus === "blocked" ? "blocked" : "unblocked"} successfully`,
      {
        position: "top-right",
        autoClose: 2000,
      }
    );
  };

  const bulkToggleSlots = (action) => {
    if (selectedSlots.length === 0) {
      toast.warning("Please select slots first");
      return;
    }

    const newStatus = action === "block" ? "blocked" : "available";

    const updatedSlots = timeSlots.map((slot) =>
      selectedSlots.includes(slot.id) && slot.status !== "booked"
        ? { ...slot, status: newStatus }
        : slot
    );

    setTimeSlots(updatedSlots);
    updateStats(updatedSlots);
    setSelectedSlots([]);

    toast.success(`${selectedSlots.length} slots ${action}ed successfully`, {
      position: "top-right",
      autoClose: 3000,
    });
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

  const regenerateSlots = () => {
    const confirm = window.confirm(
      "This will regenerate all time slots for this date based on current working hours. Continue?"
    );

    if (!confirm) return;

    setIsGenerating(true);

    // Simulate generation delay
    setTimeout(() => {
      generateTimeSlots();
      setSelectedSlots([]);
      setIsGenerating(false);

      toast.success("Time slots regenerated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    }, 1000);
  };

  const getSlotStatusIcon = (status) => {
    switch (status) {
      case "available":
        return <CheckCircle className="slot-manager-slot-icon available" />;
      case "booked":
        return <User className="slot-manager-slot-icon booked" />;
      case "blocked":
        return <XCircle className="slot-manager-slot-icon blocked" />;
      default:
        return <Clock className="slot-manager-slot-icon" />;
    }
  };

  const isPastDate = new Date(selectedDate) < new Date().setHours(0, 0, 0, 0);
  const isToday = selectedDate === new Date().toISOString().split("T")[0];

  const getDateBannerClass = () => {
    if (isPastDate) return "past";
    if (isToday) return "today";
    return "future";
  };

  const getDateBannerContent = () => {
    const dateObj = new Date(selectedDate);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let title, description;
    if (isPastDate) {
      title = "Past Date";
      description = "Time slots for past dates are read-only";
    } else if (isToday) {
      title = "Today";
      description = "Current day - past slots are automatically blocked";
    } else {
      title = "Future Date";
      description = "All slot management options available";
    }

    return { title: `${title} - ${formattedDate}`, description };
  };

  return (
    <div className="slot-manager slot-manager-fade-in">
      {/* Controls Section */}
      <div className="slot-manager-controls">
        <div className="slot-manager-controls-left">
          <div className="slot-manager-date-field">
            <label className="slot-manager-date-label">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="slot-manager-date-input"
            />
          </div>

          <div className="slot-manager-view-toggle">
            <span className="slot-manager-view-label">View:</span>
            <button
              onClick={() => setViewMode("grid")}
              className={`slot-manager-view-button ${
                viewMode === "grid" ? "active" : ""
              }`}
              title="Grid View"
            >
              <Grid />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`slot-manager-view-button ${
                viewMode === "list" ? "active" : ""
              }`}
              title="List View"
            >
              <List />
            </button>
          </div>

          <button
            onClick={regenerateSlots}
            disabled={isGenerating || isPastDate}
            className="slot-manager-regenerate-button"
            title="Regenerate slots based on current working hours"
          >
            <RotateCcw className={isGenerating ? "spinning" : ""} />
            <span>{isGenerating ? "Generating..." : "Regenerate"}</span>
          </button>
        </div>

        {/* Bulk Actions */}
        <div className="slot-manager-controls-right">
          {selectedSlots.length > 0 && (
            <div className="slot-manager-selection-info">
              <span className="slot-manager-selection-count">
                {selectedSlots.length} selected
              </span>
              <button
                onClick={() => bulkToggleSlots("block")}
                disabled={loading}
                className="slot-manager-bulk-button block"
              >
                <EyeOff /> Block
              </button>
              <button
                onClick={() => bulkToggleSlots("unblock")}
                disabled={loading}
                className="slot-manager-bulk-button unblock"
              >
                <Eye /> Unblock
              </button>
              <button
                onClick={clearSelection}
                className="slot-manager-bulk-button clear"
              >
                Clear
              </button>
            </div>
          )}

          <div className="slot-manager-selection-actions">
            <button
              onClick={selectAllAvailableSlots}
              className="slot-manager-selection-button"
            >
              <Target /> Select Available
            </button>
            <button
              onClick={selectAllBlockedSlots}
              className="slot-manager-selection-button orange"
            >
              <Target /> Select Blocked
            </button>
          </div>
        </div>
      </div>

      {/* Date Info Banner */}
      <div className={`slot-manager-date-banner ${getDateBannerClass()}`}>
        <div className="slot-manager-date-banner-content">
          <div className="slot-manager-date-banner-info">
            <h3>{getDateBannerContent().title}</h3>
            <p>{getDateBannerContent().description}</p>
          </div>
          {timeSlots.length > 0 && (
            <div className="slot-manager-date-banner-stats">
              <div className="slot-manager-date-banner-stats-total">
                Total Slots: {timeSlots.length}
              </div>
              <div className="slot-manager-date-banner-stats-time">
                {timeSlots[0]?.startTime} -{" "}
                {timeSlots[timeSlots.length - 1]?.endTime}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="slot-manager-loading">
          <div className="slot-manager-loading-content">
            <Loader className="slot-manager-loading-spinner" />
            <div className="slot-manager-loading-text">
              Loading time slots...
            </div>
          </div>
        </div>
      )}

      {/* No Slots Available */}
      {!loading && timeSlots.length === 0 && (
        <div className="slot-manager-empty">
          <AlertCircle className="slot-manager-empty-icon" />
          <h3>No time slots available</h3>
          <p>
            {isPastDate
              ? "Cannot manage slots for past dates"
              : "The business appears to be closed on this day, or working hours need to be configured"}
          </p>
          {!isPastDate && (
            <div className="slot-manager-empty-actions">
              <button
                onClick={() =>
                  onDateChange(new Date().toISOString().split("T")[0])
                }
                className="slot-manager-empty-button"
              >
                Go to Today
              </button>
              <button
                onClick={regenerateSlots}
                className="slot-manager-empty-button primary"
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
            <div className="slot-manager-slots-grid">
              {timeSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`slot-manager-slot-card ${slot.status} ${
                    selectedSlots.includes(slot.id) ? "selected" : ""
                  } ${
                    slot.status === "booked" || isPastDate ? "disabled" : ""
                  } animate-in`}
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
                      className="slot-manager-slot-checkbox"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}

                  <div className="slot-manager-slot-header">
                    {getSlotStatusIcon(slot.status)}
                    <div className="slot-manager-slot-time">
                      {slot.startTime}
                    </div>
                  </div>

                  <div className="slot-manager-slot-end-time">
                    {slot.endTime}
                  </div>
                  <div className="slot-manager-slot-status">{slot.status}</div>

                  {/* Action Button */}
                  {slot.status !== "booked" && !isPastDate && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSlotStatus(slot.id);
                      }}
                      className="slot-manager-slot-action"
                    >
                      {slot.status === "available" ? "Block" : "Unblock"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="slot-manager-slots-list">
              {timeSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`slot-manager-slot-row ${slot.status} ${
                    selectedSlots.includes(slot.id) ? "selected" : ""
                  } ${
                    slot.status === "booked" || isPastDate ? "disabled" : ""
                  }`}
                >
                  <div className="slot-manager-slot-row-left">
                    {slot.status !== "booked" && !isPastDate && (
                      <input
                        type="checkbox"
                        checked={selectedSlots.includes(slot.id)}
                        onChange={() => handleSlotSelection(slot.id)}
                        className="slot-manager-slot-row-checkbox"
                      />
                    )}

                    {getSlotStatusIcon(slot.status)}

                    <div className="slot-manager-slot-row-info">
                      <div className="slot-manager-slot-row-time">
                        {slot.startTime} - {slot.endTime}
                      </div>
                      <div className="slot-manager-slot-row-duration">
                        Duration: {slot.duration} minutes
                      </div>
                    </div>
                  </div>

                  <div className="slot-manager-slot-row-right">
                    <div className="slot-manager-slot-row-details">
                      <div
                        className={`slot-manager-slot-row-status ${slot.status}`}
                      >
                        {slot.status}
                      </div>
                    </div>

                    {slot.status !== "booked" && !isPastDate && (
                      <button
                        onClick={() => toggleSlotStatus(slot.id)}
                        className={`slot-manager-slot-row-button ${
                          slot.status === "available" ? "block" : "unblock"
                        }`}
                      >
                        {slot.status === "available" ? (
                          <>
                            <EyeOff /> Block
                          </>
                        ) : (
                          <>
                            <Eye /> Unblock
                          </>
                        )}
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
        <div className="slot-manager-legend">
          <h4>📊 Slot Status Legend</h4>
          <div className="slot-manager-legend-items">
            <div className="slot-manager-legend-item">
              <CheckCircle className="slot-manager-legend-icon available" />
              <span className="slot-manager-legend-text">
                Available
                <span className="slot-manager-legend-count">
                  ({timeSlots.filter((s) => s.status === "available").length})
                </span>
              </span>
            </div>
            <div className="slot-manager-legend-item">
              <User className="slot-manager-legend-icon booked" />
              <span className="slot-manager-legend-text">
                Booked
                <span className="slot-manager-legend-count">
                  ({timeSlots.filter((s) => s.status === "booked").length})
                </span>
              </span>
            </div>
            <div className="slot-manager-legend-item">
              <XCircle className="slot-manager-legend-icon blocked" />
              <span className="slot-manager-legend-text">
                Blocked
                <span className="slot-manager-legend-count">
                  ({timeSlots.filter((s) => s.status === "blocked").length})
                </span>
              </span>
            </div>
            <div className="slot-manager-legend-total">
              Total: {timeSlots.length} slots
            </div>
          </div>
        </div>
      )}

      {/* Help Panel */}
      {timeSlots.length > 0 && !isPastDate && (
        <div className="slot-manager-help">
          <div className="slot-manager-help-content">
            <AlertCircle className="slot-manager-help-icon" />
            <div className="slot-manager-help-text">
              <h4>💡 Quick Tips for Slot Management</h4>
              <ul className="slot-manager-help-list">
                <li>Click on slots to select them for bulk operations</li>
                <li>Block slots during breaks or when unavailable</li>
                <li>Use "Regenerate" after changing working hours</li>
                <li>Past time slots are automatically blocked</li>
                <li>Changes are applied immediately (in-memory for now)</li>
                {isToday && (
                  <li className="today">
                    Past slots for today are automatically blocked
                  </li>
                )}
                <li>Grid view for quick overview, List view for details</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotManager;
