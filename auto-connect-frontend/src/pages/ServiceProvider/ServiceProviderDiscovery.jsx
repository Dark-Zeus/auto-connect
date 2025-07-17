import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Filter,
  Star,
  Clock,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  Award,
  Users,
  Calendar,
  DollarSign,
  Navigation,
  Sliders,
  X,
  Heart,
  Share2,
  ExternalLink,
  ChevronDown,
  Map,
  List,
  Grid3X3,
  SortAsc,
  SortDesc,
} from "lucide-react";
import "./ServiceProviderDiscovery.css";

const ServiceProviderDiscovery = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid, list, map
  const [sortBy, setSortBy] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: "",
    availability: "",
    rating: "",
    distance: "",
    verified: false,
    openNow: false,
  });

  // Mock data for service providers
  const [providers, setProviders] = useState([
    {
      id: 1,
      name: "AutoCare Pro Service Center",
      specialty: "General Auto Repair",
      location: "Colombo 03, Western Province",
      address: "123 Galle Road, Colombo 03",
      phone: "+94 11 234 5678",
      email: "info@autocarepro.lk",
      website: "www.autocarepro.lk",
      rating: 4.8,
      reviewCount: 247,
      distance: 2.5,
      priceRange: "$$",
      isVerified: true,
      isOpen: true,
      openHours: "8:00 AM - 6:00 PM",
      services: ["Engine Repair", "Brake Service", "Oil Change", "Diagnostics"],
      images: [
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
      ],
      availability: "Same Day",
      certifications: ["ISO 9001", "Toyota Certified"],
      yearsInBusiness: 15,
      responseTime: "Within 2 hours",
    },
    {
      id: 2,
      name: "Elite Motor Works",
      specialty: "Luxury Car Service",
      location: "Kandy, Central Province",
      address: "456 Peradeniya Road, Kandy",
      phone: "+94 81 123 4567",
      email: "service@elitemotorworks.lk",
      website: "www.elitemotorworks.lk",
      rating: 4.9,
      reviewCount: 189,
      distance: 15.3,
      priceRange: "$$$",
      isVerified: true,
      isOpen: false,
      openHours: "9:00 AM - 5:00 PM",
      services: [
        "BMW Service",
        "Mercedes Service",
        "Audi Service",
        "Detailing",
      ],
      images: [
        "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=300&fit=crop",
      ],
      availability: "Next Day",
      certifications: ["BMW Certified", "Mercedes Certified"],
      yearsInBusiness: 12,
      responseTime: "Within 4 hours",
    },
    {
      id: 3,
      name: "Quick Fix Auto Repair",
      specialty: "Express Service",
      location: "Galle, Southern Province",
      address: "789 Main Street, Galle",
      phone: "+94 91 234 5678",
      email: "info@quickfixauto.lk",
      website: "www.quickfixauto.lk",
      rating: 4.6,
      reviewCount: 156,
      distance: 45.2,
      priceRange: "$",
      isVerified: false,
      isOpen: true,
      openHours: "7:00 AM - 8:00 PM",
      services: ["Oil Change", "Tire Service", "Battery", "Quick Repairs"],
      images: [
        "https://images.unsplash.com/photo-1632823471565-1ecdf5c0d31b?w=400&h=300&fit=crop",
      ],
      availability: "Walk-in",
      certifications: ["Basic Automotive"],
      yearsInBusiness: 8,
      responseTime: "Within 1 hour",
    },
    {
      id: 4,
      name: "Premium Auto Solutions",
      specialty: "Electrical & Diagnostics",
      location: "Negombo, Western Province",
      address: "321 Colombo Road, Negombo",
      phone: "+94 31 234 5678",
      email: "contact@premiumauto.lk",
      website: "www.premiumauto.lk",
      rating: 4.7,
      reviewCount: 203,
      distance: 8.7,
      priceRange: "$$",
      isVerified: true,
      isOpen: true,
      openHours: "8:30 AM - 5:30 PM",
      services: [
        "Electrical Repair",
        "Computer Diagnostics",
        "AC Service",
        "Wiring",
      ],
      images: [
        "https://images.unsplash.com/photo-1559389454-8ed4c69bef89?w=400&h=300&fit=crop",
      ],
      availability: "Appointment",
      certifications: ["Electrical Specialist", "Diagnostic Expert"],
      yearsInBusiness: 10,
      responseTime: "Within 3 hours",
    },
  ]);

  const locations = [
    "All Locations",
    "Colombo, Western Province",
    "Kandy, Central Province",
    "Galle, Southern Province",
    "Negombo, Western Province",
    "Matara, Southern Province",
    "Jaffna, Northern Province",
    "Kurunegala, North Western Province",
  ];

  const specialties = [
    "All Specialties",
    "General Auto Repair",
    "Luxury Car Service",
    "Express Service",
    "Electrical & Diagnostics",
    "Engine Repair",
    "Brake & Suspension",
    "Transmission Service",
    "Body Work & Paint",
    "Tire & Wheel Service",
    "Air Conditioning",
  ];

  const priceRanges = [
    { value: "", label: "Any Price" },
    { value: "$", label: "$ - Budget Friendly" },
    { value: "$$", label: "$$ - Moderate" },
    { value: "$$$", label: "$$$ - Premium" },
    { value: "$$$$", label: "$$$$ - Luxury" },
  ];

  const availabilityOptions = [
    { value: "", label: "Any Availability" },
    { value: "Same Day", label: "Same Day" },
    { value: "Next Day", label: "Next Day" },
    { value: "Walk-in", label: "Walk-in Available" },
    { value: "Appointment", label: "Appointment Only" },
  ];

  const sortOptions = [
    { value: "rating", label: "Rating" },
    { value: "distance", label: "Distance" },
    { value: "reviewCount", label: "Reviews" },
    { value: "name", label: "Name" },
    { value: "priceRange", label: "Price" },
  ];

  // Filter and sort providers
  const filteredProviders = providers
    .filter((provider) => {
      const matchesSearch =
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.services.some((service) =>
          service.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesLocation =
        !selectedLocation ||
        selectedLocation === "All Locations" ||
        provider.location.includes(selectedLocation.split(",")[0]);

      const matchesSpecialty =
        !selectedSpecialty ||
        selectedSpecialty === "All Specialties" ||
        provider.specialty === selectedSpecialty;

      const matchesPriceRange =
        !filters.priceRange || provider.priceRange === filters.priceRange;
      const matchesAvailability =
        !filters.availability || provider.availability === filters.availability;
      const matchesRating =
        !filters.rating || provider.rating >= parseFloat(filters.rating);
      const matchesDistance =
        !filters.distance || provider.distance <= parseFloat(filters.distance);
      const matchesVerified = !filters.verified || provider.isVerified;
      const matchesOpenNow = !filters.openNow || provider.isOpen;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesSpecialty &&
        matchesPriceRange &&
        matchesAvailability &&
        matchesRating &&
        matchesDistance &&
        matchesVerified &&
        matchesOpenNow
      );
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "priceRange") {
        const priceOrder = { $: 1, $$: 2, $$$: 3, $$$$: 4 };
        aValue = priceOrder[a.priceRange];
        bValue = priceOrder[b.priceRange];
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const toggleFavorite = (providerId) => {
    setFavorites((prev) =>
      prev.includes(providerId)
        ? prev.filter((id) => id !== providerId)
        : [...prev, providerId]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLocation("");
    setSelectedSpecialty("");
    setFilters({
      priceRange: "",
      availability: "",
      rating: "",
      distance: "",
      verified: false,
      openNow: false,
    });
  };

  const getPriceRangeDisplay = (range) => {
    const displays = {
      $: "₹5,000 - ₹15,000",
      $$: "₹15,000 - ₹35,000",
      $$$: "₹35,000 - ₹75,000",
      $$$$: "₹75,000+",
    };
    return displays[range] || range;
  };

  const renderProviderCard = (provider) => (
    <div key={provider.id} className="provider-card">
      <div className="provider-image">
        <img src={provider.images[0]} alt={provider.name} />
        <div className="provider-badges">
          {provider.isVerified && (
            <span className="badge verified">
              <CheckCircle className="w-3 h-3" />
              Verified
            </span>
          )}
          {provider.isOpen && (
            <span className="badge open">
              <Clock className="w-3 h-3" />
              Open Now
            </span>
          )}
        </div>
        <button
          className={`favorite-btn ${
            favorites.includes(provider.id) ? "active" : ""
          }`}
          onClick={() => toggleFavorite(provider.id)}
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>

      <div className="provider-info">
        <div className="provider-header">
          <h3 className="provider-name">{provider.name}</h3>
          <div className="provider-rating">
            <Star className="w-4 h-4 filled" />
            <span className="rating-value">{provider.rating}</span>
            <span className="review-count">({provider.reviewCount})</span>
          </div>
        </div>

        <div className="provider-specialty">{provider.specialty}</div>

        <div className="provider-location">
          <MapPin className="w-4 h-4" />
          <span>{provider.location}</span>
          <span className="distance">{provider.distance} km away</span>
        </div>

        <div className="provider-details">
          <div className="detail-item">
            <DollarSign className="w-4 h-4" />
            <span>
              Price Range: {getPriceRangeDisplay(provider.priceRange)}
            </span>
          </div>
          <div className="detail-item">
            <Calendar className="w-4 h-4" />
            <span>Availability: {provider.availability}</span>
          </div>
          <div className="detail-item">
            <Clock className="w-4 h-4" />
            <span>Response: {provider.responseTime}</span>
          </div>
        </div>

        <div className="provider-services">
          {provider.services.slice(0, 3).map((service, index) => (
            <span key={index} className="service-tag">
              {service}
            </span>
          ))}
          {provider.services.length > 3 && (
            <span className="service-tag more">
              +{provider.services.length - 3} more
            </span>
          )}
        </div>

        <div className="provider-actions">
          <button className="btn btn-secondary">
            <Phone className="w-4 h-4" />
            Call
          </button>
          <button className="btn btn-secondary">
            <Mail className="w-4 h-4" />
            Email
          </button>
          <button className="btn btn-primary">
            <Calendar className="w-4 h-4" />
            Book Service
          </button>
        </div>
      </div>
    </div>
  );

  const renderProviderList = (provider) => (
    <div key={provider.id} className="provider-list-item">
      <div className="provider-list-image">
        <img src={provider.images[0]} alt={provider.name} />
        <div className="provider-badges">
          {provider.isVerified && (
            <span className="badge verified">
              <CheckCircle className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>

      <div className="provider-list-content">
        <div className="provider-list-header">
          <div className="provider-list-main">
            <h3 className="provider-name">{provider.name}</h3>
            <div className="provider-specialty">{provider.specialty}</div>
            <div className="provider-location">
              <MapPin className="w-4 h-4" />
              <span>
                {provider.location} • {provider.distance} km away
              </span>
            </div>
          </div>

          <div className="provider-list-meta">
            <div className="provider-rating">
              <Star className="w-4 h-4 filled" />
              <span className="rating-value">{provider.rating}</span>
              <span className="review-count">({provider.reviewCount})</span>
            </div>
            <div className="provider-price">
              {getPriceRangeDisplay(provider.priceRange)}
            </div>
            <div className="provider-availability">{provider.availability}</div>
          </div>
        </div>

        <div className="provider-list-services">
          {provider.services.map((service, index) => (
            <span key={index} className="service-tag">
              {service}
            </span>
          ))}
        </div>

        <div className="provider-list-actions">
          <button
            className={`favorite-btn ${
              favorites.includes(provider.id) ? "active" : ""
            }`}
            onClick={() => toggleFavorite(provider.id)}
          >
            <Heart className="w-4 h-4" />
          </button>
          <button className="btn btn-secondary">
            <Phone className="w-4 h-4" />
            Call
          </button>
          <button className="btn btn-secondary">
            <ExternalLink className="w-4 h-4" />
            View Details
          </button>
          <button className="btn btn-primary">
            <Calendar className="w-4 h-4" />
            Book Service
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="service-provider-discovery">
      {/* Header Section */}
      <div className="discovery-header">
        <div className="header-content">
          <h1 className="page-title">
            <Search className="w-6 h-6" />
            Discover Service Providers
          </h1>
          <p className="page-subtitle">
            Find trusted automotive service providers near you by location and
            specialty
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-section">
        <div className="search-controls">
          <div className="main-search">
            <div className="search-input-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search providers, services, or specialties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="filter-controls">
            <div className="location-filter">
              <MapPin className="filter-icon" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="filter-select"
              >
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div className="specialty-filter">
              <Filter className="filter-icon" />
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="filter-select"
              >
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="advanced-filters-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Sliders className="w-4 h-4" />
              More Filters
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="advanced-filters">
            <div className="filters-grid">
              <div className="filter-group">
                <label>Price Range</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      priceRange: e.target.value,
                    }))
                  }
                  className="filter-select"
                >
                  {priceRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Availability</label>
                <select
                  value={filters.availability}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      availability: e.target.value,
                    }))
                  }
                  className="filter-select"
                >
                  {availabilityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Minimum Rating</label>
                <select
                  value={filters.rating}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, rating: e.target.value }))
                  }
                  className="filter-select"
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                  <option value="3.0">3.0+ Stars</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Distance (km)</label>
                <select
                  value={filters.distance}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      distance: e.target.value,
                    }))
                  }
                  className="filter-select"
                >
                  <option value="">Any Distance</option>
                  <option value="5">Within 5 km</option>
                  <option value="10">Within 10 km</option>
                  <option value="25">Within 25 km</option>
                  <option value="50">Within 50 km</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.verified}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        verified: e.target.checked,
                      }))
                    }
                  />
                  <span>Verified Providers Only</span>
                </label>
              </div>

              <div className="filter-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.openNow}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        openNow: e.target.checked,
                      }))
                    }
                  />
                  <span>Open Now</span>
                </label>
              </div>
            </div>

            <div className="filters-actions">
              <button className="btn btn-secondary" onClick={clearFilters}>
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="results-summary">
          <div className="results-info">
            <span className="results-count">
              {filteredProviders.length} providers found
              {selectedLocation &&
                selectedLocation !== "All Locations" &&
                ` in ${selectedLocation.split(",")[0]}`}
              {selectedSpecialty &&
                selectedSpecialty !== "All Specialties" &&
                ` for ${selectedSpecialty}`}
            </span>
          </div>

          <div className="view-controls">
            <div className="sort-controls">
              <label>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                className="sort-order-btn"
                onClick={() =>
                  setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                }
              >
                {sortOrder === "asc" ? (
                  <SortAsc className="w-4 h-4" />
                ) : (
                  <SortDesc className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="view-mode-controls">
              <button
                className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                className={`view-btn ${viewMode === "map" ? "active" : ""}`}
                onClick={() => setViewMode("map")}
              >
                <Map className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="results-section">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Finding service providers...</p>
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="empty-state">
            <Search className="w-16 h-16" />
            <h3>No providers found</h3>
            <p>
              Try adjusting your search criteria or location to find more
              providers.
            </p>
            <button className="btn btn-primary" onClick={clearFilters}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className={`providers-container ${viewMode}`}>
            {viewMode === "grid" && (
              <div className="providers-grid">
                {filteredProviders.map(renderProviderCard)}
              </div>
            )}

            {viewMode === "list" && (
              <div className="providers-list">
                {filteredProviders.map(renderProviderList)}
              </div>
            )}

            {viewMode === "map" && (
              <div className="providers-map">
                <div className="map-placeholder">
                  <Map className="w-16 h-16" />
                  <h3>Map View</h3>
                  <p>
                    Interactive map with provider locations would be displayed
                    here.
                  </p>
                  <p>
                    Integration with Google Maps or similar mapping service
                    required.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceProviderDiscovery;
