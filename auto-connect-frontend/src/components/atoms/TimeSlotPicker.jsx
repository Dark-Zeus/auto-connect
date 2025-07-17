// src/components/atoms/TimeSlotPicker.jsx
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const TimeSlotPicker = ({
  selectedSlot,
  onSlotSelect,
  availableSlots = [],
  selectedDate,
  onDateChange,
  className = "",
  disabled = false,
  showDatePicker = true,
  maxAdvanceDays = 30,
  minAdvanceHours = 1,
  title = "Select Time Slot",
  emptyMessage = "No time slots available for this date",
}) => {
  const [currentDate, setCurrentDate] = useState(
    selectedDate || new Date().toISOString().split("T")[0]
  );
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedDate && selectedDate !== currentDate) {
      setCurrentDate(selectedDate);
    }
  }, [selectedDate]);

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  const handleSlotClick = (slot) => {
    if (disabled || !slot.isAvailable || slot.status === "booked") return;

    if (onSlotSelect) {
      onSlotSelect(slot);
    }
  };

  const getSlotStatusColor = (slot) => {
    if (!slot.isAvailable || slot.status === "blocked") {
      return "tw:bg-red-50 tw:border-red-200 tw:text-red-700 tw:cursor-not-allowed";
    }
    if (slot.status === "booked") {
      return "tw:bg-gray-50 tw:border-gray-200 tw:text-gray-500 tw:cursor-not-allowed";
    }
    if (selectedSlot?.id === slot.id) {
      return "tw:bg-blue-600 tw:border-blue-600 tw:text-white tw:shadow-md";
    }
    return "tw:bg-white tw:border-gray-200 tw:text-gray-700 hover:tw:bg-blue-50 hover:tw:border-blue-300 tw:cursor-pointer";
  };

  const getSlotIcon = (slot) => {
    if (!slot.isAvailable || slot.status === "blocked") {
      return <XCircle className="tw:h-4 tw:w-4" />;
    }
    if (slot.status === "booked") {
      return <User className="tw:h-4 tw:w-4" />;
    }
    if (selectedSlot?.id === slot.id) {
      return <CheckCircle className="tw:h-4 tw:w-4" />;
    }
    return <Clock className="tw:h-4 tw:w-4" />;
  };

  const isSlotInPast = (slot) => {
    const now = new Date();
    const slotDateTime = new Date(`${currentDate}T${slot.startTime}`);
    const minAdvanceTime = new Date(
      now.getTime() + minAdvanceHours * 60 * 60 * 1000
    );
    return slotDateTime < minAdvanceTime;
  };

  const getDateNavigation = () => {
    const today = new Date();
    const current = new Date(currentDate);
    const maxDate = new Date(
      today.getTime() + maxAdvanceDays * 24 * 60 * 60 * 1000
    );

    const prevDate = new Date(current);
    prevDate.setDate(current.getDate() - 1);

    const nextDate = new Date(current);
    nextDate.setDate(current.getDate() + 1);

    const canGoPrev = prevDate >= today;
    const canGoNext = nextDate <= maxDate;

    return { canGoPrev, canGoNext, prevDate, nextDate };
  };

  const { canGoPrev, canGoNext, prevDate, nextDate } = getDateNavigation();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (dateString === today.toISOString().split("T")[0]) {
      return "Today";
    } else if (dateString === tomorrow.toISOString().split("T")[0]) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }
  };

  const availableCount = availableSlots.filter(
    (slot) =>
      slot.isAvailable && slot.status !== "booked" && !isSlotInPast(slot)
  ).length;

  const bookedCount = availableSlots.filter(
    (slot) => slot.status === "booked"
  ).length;

  return (
    <div className={`tw:space-y-4 ${className}`}>
      {/* Header */}
      <div className="tw:flex tw:items-center tw:justify-between">
        <h3 className="tw:text-lg tw:font-semibold tw:text-gray-800 tw:flex tw:items-center tw:space-x-2">
          <Calendar className="tw:h-5 tw:w-5 tw:text-blue-600" />
          <span>{title}</span>
        </h3>

        {/* View Mode Toggle */}
        <div className="tw:flex tw:items-center tw:space-x-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`tw:p-2 tw:rounded-md tw:transition-colors ${
              viewMode === "grid"
                ? "tw:bg-blue-600 tw:text-white"
                : "tw:bg-gray-200 tw:text-gray-700 hover:tw:bg-gray-300"
            }`}
            title="Grid View"
          >
            <div className="tw:grid tw:grid-cols-2 tw:gap-0.5 tw:w-3 tw:h-3">
              <div className="tw:bg-current tw:rounded-sm"></div>
              <div className="tw:bg-current tw:rounded-sm"></div>
              <div className="tw:bg-current tw:rounded-sm"></div>
              <div className="tw:bg-current tw:rounded-sm"></div>
            </div>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`tw:p-2 tw:rounded-md tw:transition-colors ${
              viewMode === "list"
                ? "tw:bg-blue-600 tw:text-white"
                : "tw:bg-gray-200 tw:text-gray-700 hover:tw:bg-gray-300"
            }`}
            title="List View"
          >
            <div className="tw:space-y-1">
              <div className="tw:w-4 tw:h-0.5 tw:bg-current tw:rounded"></div>
              <div className="tw:w-4 tw:h-0.5 tw:bg-current tw:rounded"></div>
              <div className="tw:w-4 tw:h-0.5 tw:bg-current tw:rounded"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Date Navigation */}
      {showDatePicker && (
        <div className="tw:bg-gray-50 tw:border tw:border-gray-200 tw:rounded-lg tw:p-4">
          <div className="tw:flex tw:items-center tw:justify-between tw:mb-3">
            <button
              onClick={() =>
                canGoPrev &&
                handleDateChange(prevDate.toISOString().split("T")[0])
              }
              disabled={!canGoPrev}
              className="tw:p-2 tw:rounded-md tw:border tw:border-gray-300 tw:bg-white tw:text-gray-600 hover:tw:bg-gray-50 tw:transition-colors disabled:tw:opacity-50 disabled:tw:cursor-not-allowed"
            >
              <ChevronLeft className="tw:h-4 tw:w-4" />
            </button>

            <div className="tw:text-center">
              <div className="tw:text-lg tw:font-semibold tw:text-gray-800">
                {formatDate(currentDate)}
              </div>
              <div className="tw:text-sm tw:text-gray-600">
                {new Date(currentDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>

            <button
              onClick={() =>
                canGoNext &&
                handleDateChange(nextDate.toISOString().split("T")[0])
              }
              disabled={!canGoNext}
              className="tw:p-2 tw:rounded-md tw:border tw:border-gray-300 tw:bg-white tw:text-gray-600 hover:tw:bg-gray-50 tw:transition-colors disabled:tw:opacity-50 disabled:tw:cursor-not-allowed"
            >
              <ChevronRight className="tw:h-4 tw:w-4" />
            </button>
          </div>

          {/* Direct Date Input */}
          <input
            type="date"
            value={currentDate}
            onChange={(e) => handleDateChange(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            max={
              new Date(Date.now() + maxAdvanceDays * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0]
            }
            disabled={disabled}
            className="tw:w-full tw:px-3 tw:py-2 tw:border tw:border-gray-300 tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-500 tw:bg-white"
          />
        </div>
      )}

      {/* Slot Statistics */}
      {availableSlots.length > 0 && (
        <div className="tw:grid tw:grid-cols-3 tw:gap-4 tw:text-center">
          <div className="tw:bg-green-50 tw:border tw:border-green-200 tw:rounded-lg tw:p-3">
            <div className="tw:text-2xl tw:font-bold tw:text-green-600">
              {availableCount}
            </div>
            <div className="tw:text-sm tw:text-green-700">Available</div>
          </div>
          <div className="tw:bg-blue-50 tw:border tw:border-blue-200 tw:rounded-lg tw:p-3">
            <div className="tw:text-2xl tw:font-bold tw:text-blue-600">
              {bookedCount}
            </div>
            <div className="tw:text-sm tw:text-blue-700">Booked</div>
          </div>
          <div className="tw:bg-gray-50 tw:border tw:border-gray-200 tw:rounded-lg tw:p-3">
            <div className="tw:text-2xl tw:font-bold tw:text-gray-600">
              {availableSlots.length}
            </div>
            <div className="tw:text-sm tw:text-gray-700">Total</div>
          </div>
        </div>
      )}

      {/* Time Slots */}
      {loading ? (
        <div className="tw:flex tw:justify-center tw:items-center tw:py-8">
          <div className="tw:animate-spin tw:rounded-full tw:h-8 tw:w-8 tw:border-b-2 tw:border-blue-600"></div>
        </div>
      ) : availableSlots.length === 0 ? (
        <div className="tw:text-center tw:py-12 tw:bg-gray-50 tw:rounded-lg tw:border tw:border-gray-200">
          <AlertCircle className="tw:h-12 tw:w-12 tw:text-gray-400 tw:mx-auto tw:mb-4" />
          <h3 className="tw:text-lg tw:font-medium tw:text-gray-800 tw:mb-2">
            No Time Slots Available
          </h3>
          <p className="tw:text-gray-600">{emptyMessage}</p>
        </div>
      ) : (
        <div className="tw:space-y-4">
          {viewMode === "grid" ? (
            <div className="tw:grid tw:grid-cols-2 sm:tw:grid-cols-3 md:tw:grid-cols-4 lg:tw:grid-cols-5 tw:gap-3">
              {availableSlots.map((slot) => {
                const isPast = isSlotInPast(slot);
                const isClickable =
                  !disabled &&
                  slot.isAvailable &&
                  slot.status !== "booked" &&
                  !isPast;

                return (
                  <div
                    key={slot.id}
                    className={`tw:p-3 tw:border-2 tw:rounded-lg tw:transition-all tw:duration-200 tw:text-center ${
                      isPast
                        ? "tw:bg-gray-100 tw:border-gray-200 tw:text-gray-400 tw:cursor-not-allowed"
                        : getSlotStatusColor(slot)
                    } ${isClickable ? "hover:tw:scale-105" : ""}`}
                    onClick={() => isClickable && handleSlotClick(slot)}
                  >
                    <div className="tw:flex tw:items-center tw:justify-center tw:space-x-1 tw:mb-2">
                      {getSlotIcon(slot)}
                      <span className="tw:text-sm tw:font-medium">
                        {slot.startTime}
                      </span>
                    </div>

                    <div className="tw:text-xs tw:text-gray-600 tw:mb-1">
                      {slot.endTime}
                    </div>

                    {slot.duration && (
                      <div className="tw:text-xs tw:text-gray-500">
                        {slot.duration}min
                      </div>
                    )}

                    {isPast && (
                      <div className="tw:text-xs tw:text-red-500 tw:mt-1">
                        Past
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="tw:space-y-2">
              {availableSlots.map((slot) => {
                const isPast = isSlotInPast(slot);
                const isClickable =
                  !disabled &&
                  slot.isAvailable &&
                  slot.status !== "booked" &&
                  !isPast;

                return (
                  <div
                    key={slot.id}
                    className={`tw:flex tw:items-center tw:justify-between tw:p-4 tw:border tw:rounded-lg tw:transition-colors ${
                      isPast
                        ? "tw:bg-gray-100 tw:border-gray-200 tw:cursor-not-allowed"
                        : getSlotStatusColor(slot)
                    }`}
                    onClick={() => isClickable && handleSlotClick(slot)}
                  >
                    <div className="tw:flex tw:items-center tw:space-x-3">
                      {getSlotIcon(slot)}
                      <div>
                        <div className="tw:font-medium">
                          {slot.startTime} - {slot.endTime}
                        </div>
                        {slot.duration && (
                          <div className="tw:text-sm tw:text-gray-600">
                            Duration: {slot.duration} minutes
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="tw:text-right">
                      <div
                        className={`tw:text-sm tw:font-medium tw:capitalize ${
                          isPast
                            ? "tw:text-gray-500"
                            : !slot.isAvailable || slot.status === "blocked"
                            ? "tw:text-red-600"
                            : slot.status === "booked"
                            ? "tw:text-gray-600"
                            : selectedSlot?.id === slot.id
                            ? "tw:text-white"
                            : "tw:text-green-600"
                        }`}
                      >
                        {isPast
                          ? "Past"
                          : !slot.isAvailable || slot.status === "blocked"
                          ? "Unavailable"
                          : slot.status === "booked"
                          ? "Booked"
                          : selectedSlot?.id === slot.id
                          ? "Selected"
                          : "Available"}
                      </div>

                      {slot.price && (
                        <div className="tw:text-xs tw:text-gray-500">
                          Rs. {slot.price.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Selected Slot Summary */}
      {selectedSlot && (
        <div className="tw:bg-blue-50 tw:border tw:border-blue-200 tw:rounded-lg tw:p-4">
          <h4 className="tw:text-sm tw:font-semibold tw:text-blue-800 tw:mb-2">
            Selected Time Slot
          </h4>
          <div className="tw:grid tw:grid-cols-2 tw:gap-4 tw:text-sm">
            <div>
              <span className="tw:text-blue-600">Date:</span>{" "}
              {formatDate(currentDate)}
            </div>
            <div>
              <span className="tw:text-blue-600">Time:</span>{" "}
              {selectedSlot.startTime} - {selectedSlot.endTime}
            </div>
            {selectedSlot.duration && (
              <div>
                <span className="tw:text-blue-600">Duration:</span>{" "}
                {selectedSlot.duration} minutes
              </div>
            )}
            {selectedSlot.price && (
              <div>
                <span className="tw:text-blue-600">Price:</span> Rs.{" "}
                {selectedSlot.price.toLocaleString()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      {availableSlots.length > 0 && (
        <div className="tw:bg-gray-50 tw:border tw:border-gray-200 tw:rounded-lg tw:p-3">
          <h5 className="tw:text-xs tw:font-semibold tw:text-gray-700 tw:mb-2">
            Legend:
          </h5>
          <div className="tw:flex tw:flex-wrap tw:items-center tw:space-x-4 tw:text-xs tw:text-gray-600">
            <div className="tw:flex tw:items-center tw:space-x-1">
              <CheckCircle className="tw:h-3 tw:w-3 tw:text-green-600" />
              <span>Available</span>
            </div>
            <div className="tw:flex tw:items-center tw:space-x-1">
              <User className="tw:h-3 tw:w-3 tw:text-gray-600" />
              <span>Booked</span>
            </div>
            <div className="tw:flex tw:items-center tw:space-x-1">
              <XCircle className="tw:h-3 tw:w-3 tw:text-red-600" />
              <span>Unavailable</span>
            </div>
            <div className="tw:flex tw:items-center tw:space-x-1">
              <div className="tw:w-3 tw:h-3 tw:bg-blue-600 tw:rounded"></div>
              <span>Selected</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;
