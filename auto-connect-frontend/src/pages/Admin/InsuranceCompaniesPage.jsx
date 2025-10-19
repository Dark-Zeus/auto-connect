import React, { useState, useMemo, useRef, useEffect } from "react";
import InsuranceCompanyCard from "@components/AdminComponents/InsurenceCompany/InsuranceCompanyCard";
import InsuranceCompanyFilterBox from "@components/AdminComponents/InsurenceCompany/InsuranceCompanyFilterBox";
import insurence1 from "@assets/images/insurense.jpg";
import InsuranceCompanyRequestPopup from "@components/AdminComponents/InsurenceCompaniesRequestsBox";
import insurance1 from "@assets/images/insurancelogos/insurencelogo1.jpg";
import insurance2 from "@assets/images/insurancelogos/insurencelogo2.jpg";
import insurance3 from "@assets/images/insurancelogos/insurencelogo3.jpg";

const sampleCompanies = [
  {
    name: "SafeLife Insurance",
    owner: "Ruwan Fernando",
    description: "Providing life, vehicle and property insurance with reliable service.",
    licenseNumber: "LIC123456789",
    email: "contact@safelife.lk",
    phone: "011-2345678",
    address: "No. 45, Park Street, Colombo 02",
    website: "www.safelife.lk",
    establishedDate: "2008-04-10",
    image: insurance1,
    rating: 4.5,
    certifications: [
      {
        name: "ISO 9001: Quality Management",
        issuedBy: "Sri Lanka Standards Institution",
        issueDate: "2015-05-10",
        expiryDate: "2025-05-10",
        certificateNumber: "ISO9001-SL-2025-001",
      },
      {
        name: "IRCS Compliance Certificate",
        issuedBy: "Insurance Regulatory Commission of Sri Lanka",
        issueDate: "2022-01-01",
        expiryDate: "2026-01-01",
        certificateNumber: "IRCS-2022-456",
      },
    ],
  },
  {
    name: "TrustShield Insurance",
    owner: "Nirosha Perera",
    description: "Health and travel insurance experts with 24/7 support.",
    licenseNumber: "LIC987654321",
    email: "info@trustshield.lk",
    phone: "011-7894561",
    address: "No. 101, Marine Drive, Colombo 06",
    website: "www.trustshield.lk",
    establishedDate: "2015-09-20",
    image: insurance2,
    rating: 4.5,
    certifications: [
      {
        name: "ISO 27001: Information Security",
        issuedBy: "Bureau Veritas",
        issueDate: "2020-08-15",
        expiryDate: "2026-08-15",
        certificateNumber: "BV-ISO27001-2020",
      },
    ],
  },
  {
    name: "LifeGuard Assurance",
    owner: "Suresh De Silva",
    description: "Complete insurance for families and businesses.",
    licenseNumber: "LIC456123789",
    email: "support@lifeguard.lk",
    phone: "011-3214567",
    address: "No. 88, Lake Road, Kandy",
    website: "www.lifeguard.lk",
    establishedDate: "2005-03-15",
    image: insurance3,
    rating: 4.5,
    certifications: [
      {
        name: "Insurance Best Practices Award",
        issuedBy: "Asia Insurance Forum",
        issueDate: "2019-11-01",
        expiryDate: "2024-11-01",
        certificateNumber: "AIF-BEST-2019",
      },
      {
        name: "Compliance Excellence",
        issuedBy: "Central Bank of Sri Lanka",
        issueDate: "2021-06-30",
        expiryDate: "2026-06-30",
        certificateNumber: "CBSL-COMP-789",
      },
    ],
  },
];

const pendingInsuranceRequests = [
  {
    name: "SafeLife Insurance",
    owner: "Ruwan Fernando",
    description: "Providing life, vehicle and property insurance with reliable service.",
    licenseNumber: "LIC123456789",
    email: "contact@safelife.lk",
    phone: "011-2345678",
    address: "No. 45, Park Street, Colombo 02",
    website: "www.safelife.lk",
    establishedDate: "2008-04-10",
    image: insurence1,
    certifications: [
      {
        name: "ISO 9001: Quality Management",
        issuedBy: "Sri Lanka Standards Institution",
        issueDate: "2015-05-10",
        expiryDate: "2025-05-10",
        certificateNumber: "ISO9001-SL-2025-001",
      },
      {
        name: "IRCS Compliance Certificate",
        issuedBy: "Insurance Regulatory Commission of Sri Lanka",
        issueDate: "2022-01-01",
        expiryDate: "2026-01-01",
        certificateNumber: "IRCS-2022-456",
      },
    ],
  },
  // You can add more sample requests here
];

function InsuaranceCompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);

useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  const filteredCompanies = useMemo(() => {
    let companies = [...sampleCompanies];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      companies = companies.filter((c) =>
        c.name.toLowerCase().includes(q)
      );
    }

    if (filterValue === "after2010") {
      companies = companies.filter(
        (c) => new Date(c.establishedDate) > new Date("2010-01-01")
      );
    } else if (filterValue === "before2010") {
      companies = companies.filter(
        (c) => new Date(c.establishedDate) < new Date("2010-01-01")
      );
    }

    if (sortValue === "name_asc") {
      companies.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortValue === "name_desc") {
      companies.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortValue === "date_asc") {
      companies.sort((a, b) => new Date(a.establishedDate) - new Date(b.establishedDate));
    } else if (sortValue === "date_desc") {
      companies.sort((a, b) => new Date(b.establishedDate) - new Date(a.establishedDate));
    }

    return companies;
  }, [searchQuery, filterValue, sortValue]);

  const handleReset = () => {
    setSearchQuery("");
    setFilterValue("");
    setSortValue("");
  };

  return (
  <div className="tw:p-8 tw:bg-gradient-to-br tw:from-blue-50 tw:to-indigo-100 tw:min-h-screen">
      {/* Header with Button */}
      <div className="tw:flex tw:justify-between tw:items-center tw:mb-6">
        <h1 className="tw:text-3xl tw:font-bold tw:text-gray-800">
          Registered Insurance Providers
        </h1>
        <button 
          onClick={() => setShowPopup(true)}  
          disabled={true}
          className="tw:bg-blue-600 tw:text-white tw:px-6 tw:py-3 tw:rounded-lg tw:shadow hover:tw:bg-blue-700 tw:transition"
          >
          {showPopup ? "Hide Requests" : "View Requests"}
        </button>
      </div>

      {showPopup && (
        <div className="tw:fixed tw:inset-0 tw:bg-black/40 tw:flex tw:items-center tw:justify-center tw:z-50">
          <div ref={popupRef}>
            <InsuranceCompanyRequestPopup 
                requests={pendingInsuranceRequests}
                onClose={() => setShowPopup(false)}
                onAccept={(req) => console.log("Accepted", req.name)}
                onReject={(req) => console.log("Rejected", req.name)}/>
          </div>
        </div>
      )}


    {/* Filter Box */}
    <InsuranceCompanyFilterBox
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      filterValue={filterValue}
      onFilterChange={setFilterValue}
      sortValue={sortValue}
      onSortChange={setSortValue}
      onReset={handleReset}
    />

    {/* Centered Cards */}
    <div className="tw:flex tw:justify-center">
      <div className="tw:grid tw:grid-cols-3 sm:tw:grid-cols-2 lg:tw:grid-cols-3 tw:gap-6 tw:mb-10 tw:max-w-8xl">
        {filteredCompanies.map((company) => (
          <InsuranceCompanyCard key={company.licenseNumber} company={company} />
        ))}
      </div>
    </div>
  </div>
);

}

export default InsuaranceCompaniesPage;
