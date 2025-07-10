// src/components/atoms/PriceRangeInput.jsx
import React, { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Calculator, AlertCircle } from "lucide-react";

const PriceRangeInput = ({
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange,
  errors = {},
  className = "",
  disabled = false,
  currency = "Rs.",
  step = 50,
  showSuggestions = true,
  category = "",
  placeholder = { min: "Minimum price", max: "Maximum price" },
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showCalculator, setShowCalculator] = useState(false);

  // Price suggestions based on category
  const categoryPricing = {
    "Engine Services": {
      min: 2000,
      max: 15000,
      suggestions: [3000, 5000, 8000, 12000],
    },
    "Brake Services": {
      min: 1500,
      max: 12000,
      suggestions: [2500, 4000, 6000, 10000],
    },
    "Transmission Services": {
      min: 3000,
      max: 25000,
      suggestions: [5000, 10000, 15000, 20000],
    },
    "Electrical Services": {
      min: 1000,
      max: 8000,
      suggestions: [1500, 3000, 5000, 7000],
    },
    "Body Work": {
      min: 2000,
      max: 50000,
      suggestions: [5000, 15000, 25000, 40000],
    },
    "Tire Services": {
      min: 500,
      max: 8000,
      suggestions: [1000, 2500, 4000, 6000],
    },
    "AC Services": {
      min: 1000,
      max: 10000,
      suggestions: [2000, 4000, 6000, 8000],
    },
    "Inspection Services": {
      min: 500,
      max: 3000,
      suggestions: [800, 1200, 2000, 2500],
    },
    "Cleaning Services": {
      min: 300,
      max: 5000,
      suggestions: [800, 1500, 2500, 4000],
    },
    "Emergency Services": {
      min: 1000,
      max: 15000,
      suggestions: [2000, 5000, 8000, 12000],
    },
  };

  const avgPrice =
    minPrice && maxPrice
      ? Math.round((parseFloat(minPrice) + parseFloat(maxPrice)) / 2)
      : null;
  const priceRange =
    minPrice && maxPrice ? parseFloat(maxPrice) - parseFloat(minPrice) : null;

  useEffect(() => {
    if (category && categoryPricing[category] && showSuggestions) {
      setSuggestions(categoryPricing[category].suggestions);
    }
  }, [category, showSuggestions]);

  const handleSuggestionClick = (suggestion) => {
    const categoryData = categoryPricing[category];
    if (categoryData) {
      // Set as minimum with reasonable range
      onMinChange({ target: { value: suggestion.toString() } });
      onMaxChange({ target: { value: (suggestion * 1.5).toString() } });
    }
  };

  const handleQuickRange = (multiplier) => {
    if (minPrice) {
      const newMax = Math.round(parseFloat(minPrice) * multiplier);
      onMaxChange({ target: { value: newMax.toString() } });
    }
  };

  const formatNumber = (value) => {
    return parseFloat(value).toLocaleString();
  };

  const validateRange = () => {
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);

    if (min && max && min >= max) {
      return "Maximum price must be greater than minimum price";
    }
    if (min && max && max - min < 100) {
      return "Price range should be at least Rs. 100";
    }
    return null;
  };

  const rangeError = validateRange();

  return (
    <div className={`tw:space-y-4 ${className}`}>
      {/* Price Range Inputs */}
      <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-4">
        {/* Minimum Price */}
        <div className="tw:space-y-2">
          <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700">
            Minimum Price ({currency}) *
          </label>
          <div className="tw:relative">
            <div className="tw:absolute tw:inset-y-0 tw:left-0 tw:pl-3 tw:flex tw:items-center tw:pointer-events-none">
              <span className="tw:text-gray-500 tw:text-sm">{currency}</span>
            </div>
            <input
              type="number"
              value={minPrice}
              onChange={onMinChange}
              placeholder={placeholder.min}
              min="0"
              step={step}
              disabled={disabled}
              className={`tw:w-full tw:pl-10 tw:pr-3 tw:py-2 tw:border tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-500 tw:transition-colors ${
                disabled
                  ? "tw:bg-gray-100 tw:cursor-not-allowed"
                  : errors.minPrice
                  ? "tw:border-red-500 tw:ring-1 tw:ring-red-500"
                  : "tw:border-gray-300 hover:tw:border-gray-400"
              }`}
            />
          </div>
          {errors.minPrice && (
            <p className="tw:text-red-500 tw:text-sm tw:flex tw:items-center tw:space-x-1">
              <AlertCircle className="tw:h-3 tw:w-3" />
              <span>{errors.minPrice}</span>
            </p>
          )}
        </div>

        {/* Maximum Price */}
        <div className="tw:space-y-2">
          <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700">
            Maximum Price ({currency}) *
          </label>
          <div className="tw:relative">
            <div className="tw:absolute tw:inset-y-0 tw:left-0 tw:pl-3 tw:flex tw:items-center tw:pointer-events-none">
              <span className="tw:text-gray-500 tw:text-sm">{currency}</span>
            </div>
            <input
              type="number"
              value={maxPrice}
              onChange={onMaxChange}
              placeholder={placeholder.max}
              min="0"
              step={step}
              disabled={disabled}
              className={`tw:w-full tw:pl-10 tw:pr-3 tw:py-2 tw:border tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-500 tw:transition-colors ${
                disabled
                  ? "tw:bg-gray-100 tw:cursor-not-allowed"
                  : errors.maxPrice || rangeError
                  ? "tw:border-red-500 tw:ring-1 tw:ring-red-500"
                  : "tw:border-gray-300 hover:tw:border-gray-400"
              }`}
            />

            {/* Quick Range Buttons */}
            {minPrice && !disabled && (
              <div className="tw:absolute tw:inset-y-0 tw:right-0 tw:flex tw:items-center tw:pr-2">
                <div className="tw:flex tw:space-x-1">
                  <button
                    type="button"
                    onClick={() => handleQuickRange(1.5)}
                    className="tw:text-xs tw:bg-blue-100 tw:text-blue-700 tw:px-2 tw:py-1 tw:rounded hover:tw:bg-blue-200 tw:transition-colors"
                    title="Set max as 1.5x minimum"
                  >
                    1.5x
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickRange(2)}
                    className="tw:text-xs tw:bg-green-100 tw:text-green-700 tw:px-2 tw:py-1 tw:rounded hover:tw:bg-green-200 tw:transition-colors"
                    title="Set max as 2x minimum"
                  >
                    2x
                  </button>
                </div>
              </div>
            )}
          </div>
          {errors.maxPrice && (
            <p className="tw:text-red-500 tw:text-sm tw:flex tw:items-center tw:space-x-1">
              <AlertCircle className="tw:h-3 tw:w-3" />
              <span>{errors.maxPrice}</span>
            </p>
          )}
        </div>
      </div>

      {/* Range Error */}
      {rangeError && (
        <div className="tw:bg-red-50 tw:border tw:border-red-200 tw:rounded-md tw:p-3">
          <p className="tw:text-red-700 tw:text-sm tw:flex tw:items-center tw:space-x-2">
            <AlertCircle className="tw:h-4 tw:w-4" />
            <span>{rangeError}</span>
          </p>
        </div>
      )}

      {/* Price Analytics */}
      {minPrice && maxPrice && !rangeError && (
        <div className="tw:bg-blue-50 tw:border tw:border-blue-200 tw:rounded-lg tw:p-4">
          <div className="tw:flex tw:items-center tw:space-x-2 tw:mb-3">
            <TrendingUp className="tw:h-4 tw:w-4 tw:text-blue-600" />
            <h4 className="tw:text-sm tw:font-medium tw:text-blue-800">
              Price Analysis
            </h4>
          </div>

          <div className="tw:grid tw:grid-cols-2 md:tw:grid-cols-3 tw:gap-4 tw:text-sm">
            <div className="tw:text-center">
              <div className="tw:text-lg tw:font-bold tw:text-blue-700">
                {currency} {formatNumber(avgPrice)}
              </div>
              <div className="tw:text-blue-600">Average Price</div>
            </div>

            <div className="tw:text-center">
              <div className="tw:text-lg tw:font-bold tw:text-green-700">
                {currency} {formatNumber(priceRange)}
              </div>
              <div className="tw:text-green-600">Price Range</div>
            </div>

            <div className="tw:text-center tw:col-span-2 md:tw:col-span-1">
              <div className="tw:text-lg tw:font-bold tw:text-purple-700">
                {Math.round((priceRange / avgPrice) * 100)}%
              </div>
              <div className="tw:text-purple-600">Flexibility</div>
            </div>
          </div>
        </div>
      )}

      {/* Category-based Suggestions */}
      {showSuggestions && suggestions.length > 0 && !disabled && (
        <div className="tw:space-y-3">
          <div className="tw:flex tw:items-center tw:space-x-2">
            <Calculator className="tw:h-4 tw:w-4 tw:text-gray-500" />
            <h4 className="tw:text-sm tw:font-medium tw:text-gray-700">
              Suggested Starting Prices for {category}
            </h4>
          </div>

          <div className="tw:flex tw:flex-wrap tw:gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="tw:bg-gray-100 tw:text-gray-700 tw:px-3 tw:py-2 tw:rounded-lg tw:text-sm tw:font-medium hover:tw:bg-gray-200 tw:transition-colors tw:flex tw:items-center tw:space-x-1"
              >
                <DollarSign className="tw:h-3 tw:w-3" />
                <span>
                  {currency} {formatNumber(suggestion)}
                </span>
              </button>
            ))}
          </div>

          <p className="tw:text-xs tw:text-gray-500">
            Click on a suggestion to set it as minimum price with automatic
            range calculation
          </p>
        </div>
      )}

      {/* Market Comparison */}
      {category && categoryPricing[category] && (minPrice || maxPrice) && (
        <div className="tw:bg-yellow-50 tw:border tw:border-yellow-200 tw:rounded-lg tw:p-4">
          <h4 className="tw:text-sm tw:font-medium tw:text-yellow-800 tw:mb-2">
            Market Comparison for {category}
          </h4>

          <div className="tw:grid tw:grid-cols-2 tw:gap-4 tw:text-sm">
            <div>
              <div className="tw:text-yellow-700">Market Range:</div>
              <div className="tw:font-medium tw:text-yellow-800">
                {currency} {formatNumber(categoryPricing[category].min)} -{" "}
                {currency} {formatNumber(categoryPricing[category].max)}
              </div>
            </div>

            {minPrice && maxPrice && (
              <div>
                <div className="tw:text-yellow-700">Your Position:</div>
                <div className="tw:font-medium tw:text-yellow-800">
                  {avgPrice <
                  (categoryPricing[category].min +
                    categoryPricing[category].max) /
                    2
                    ? "Below Average"
                    : "Above Average"}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="tw:bg-gray-50 tw:border tw:border-gray-200 tw:rounded-lg tw:p-3">
        <h5 className="tw:text-xs tw:font-medium tw:text-gray-700 tw:mb-2">
          💡 Pricing Tips:
        </h5>
        <ul className="tw:text-xs tw:text-gray-600 tw:space-y-1">
          <li>• Consider material costs, labor time, and overhead</li>
          <li>• Research competitor pricing in your area</li>
          <li>• Factor in vehicle type differences (economy vs luxury)</li>
          <li>• Leave room for discounts and promotions</li>
        </ul>
      </div>
    </div>
  );
};

export default PriceRangeInput;
