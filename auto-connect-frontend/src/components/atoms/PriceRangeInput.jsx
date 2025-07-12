// src/components/atoms/PriceRangeInput.jsx
import React, { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Calculator, AlertCircle } from "lucide-react";
import "./PriceRangeInput.css";

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
    <div className={`price-range-input ${className}`}>
      {/* Price Range Inputs */}
      <div className="price-range-grid">
        {/* Minimum Price */}
        <div className="price-input-group">
          <label className="price-input-label required">
            Minimum Price ({currency})
          </label>
          <div className="price-input-container">
            <span className="price-input-currency">{currency}</span>
            <input
              type="number"
              value={minPrice}
              onChange={onMinChange}
              placeholder={placeholder.min}
              min="0"
              step={step}
              disabled={disabled}
              className={`price-input-field ${errors.minPrice ? "error" : ""}`}
            />
          </div>
          {errors.minPrice && (
            <div className="price-input-error">
              <AlertCircle />
              <span>{errors.minPrice}</span>
            </div>
          )}
        </div>

        {/* Maximum Price */}
        <div className="price-input-group">
          <label className="price-input-label required">
            Maximum Price ({currency})
          </label>
          <div className="price-input-container">
            <span className="price-input-currency">{currency}</span>
            <input
              type="number"
              value={maxPrice}
              onChange={onMaxChange}
              placeholder={placeholder.max}
              min="0"
              step={step}
              disabled={disabled}
              className={`price-input-field ${
                errors.maxPrice || rangeError ? "error" : ""
              }`}
            />

            {/* Quick Range Buttons */}
            {minPrice && !disabled && (
              <div className="price-quick-range">
                <button
                  type="button"
                  onClick={() => handleQuickRange(1.5)}
                  className="price-quick-btn btn-1-5x"
                  title="Set max as 1.5x minimum"
                >
                  1.5x
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickRange(2)}
                  className="price-quick-btn btn-2x"
                  title="Set max as 2x minimum"
                >
                  2x
                </button>
              </div>
            )}
          </div>
          {errors.maxPrice && (
            <div className="price-input-error">
              <AlertCircle />
              <span>{errors.maxPrice}</span>
            </div>
          )}
        </div>
      </div>

      {/* Range Error */}
      {rangeError && (
        <div className="price-range-error">
          <div className="price-range-error-content">
            <AlertCircle />
            <span>{rangeError}</span>
          </div>
        </div>
      )}

      {/* Price Analytics */}
      {minPrice && maxPrice && !rangeError && (
        <div className="price-analytics price-range-fade-in">
          <div className="price-analytics-header">
            <TrendingUp />
            <h4 className="price-analytics-title">Price Analysis</h4>
          </div>

          <div className="price-analytics-grid">
            <div className="price-analytics-item">
              <div className="price-analytics-value blue">
                {currency} {formatNumber(avgPrice)}
              </div>
              <div className="price-analytics-label blue">Average Price</div>
            </div>

            <div className="price-analytics-item">
              <div className="price-analytics-value green">
                {currency} {formatNumber(priceRange)}
              </div>
              <div className="price-analytics-label green">Price Range</div>
            </div>

            <div className="price-analytics-item">
              <div className="price-analytics-value purple">
                {Math.round((priceRange / avgPrice) * 100)}%
              </div>
              <div className="price-analytics-label purple">Flexibility</div>
            </div>
          </div>
        </div>
      )}

      {/* Category-based Suggestions */}
      {showSuggestions && suggestions.length > 0 && !disabled && (
        <div className="price-suggestions">
          <div className="price-suggestions-header">
            <Calculator />
            <h4 className="price-suggestions-title">
              Suggested Starting Prices for {category}
            </h4>
          </div>

          <div className="price-suggestions-grid">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="price-suggestion-btn"
              >
                <DollarSign />
                <span>
                  {currency} {formatNumber(suggestion)}
                </span>
              </button>
            ))}
          </div>

          <p className="price-suggestions-note">
            Click on a suggestion to set it as minimum price with automatic
            range calculation
          </p>
        </div>
      )}

      {/* Market Comparison */}
      {category && categoryPricing[category] && (minPrice || maxPrice) && (
        <div className="price-market-comparison">
          <h4 className="price-market-title">
            Market Comparison for {category}
          </h4>

          <div className="price-market-grid">
            <div className="price-market-item">
              <div className="price-market-label">Market Range:</div>
              <div className="price-market-value">
                {currency} {formatNumber(categoryPricing[category].min)} -{" "}
                {currency} {formatNumber(categoryPricing[category].max)}
              </div>
            </div>

            {minPrice && maxPrice && (
              <div className="price-market-item">
                <div className="price-market-label">Your Position:</div>
                <div className="price-market-value">
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
      <div className="price-tips">
        <h5 className="price-tips-title">💡 Pricing Tips:</h5>
        <ul className="price-tips-list">
          <li className="price-tips-item">
            Consider material costs, labor time, and overhead
          </li>
          <li className="price-tips-item">
            Research competitor pricing in your area
          </li>
          <li className="price-tips-item">
            Factor in vehicle type differences (economy vs luxury)
          </li>
          <li className="price-tips-item">
            Leave room for discounts and promotions
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PriceRangeInput;
