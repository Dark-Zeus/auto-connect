import React, { useState, useMemo } from "react";
import InsuranceCompanyCard from "@components/AdminComponents/InsurenceCompany/InsuranceCompanyCard";
import InsuranceCompanyFilterBox from "@components/AdminComponents/InsurenceCompany/InsuranceCompanyFilterBox";
import insurence1 from "@assets/images/insurense.jpg";

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
    image: insurence1,
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
    image: "https://via.placeholder.com/100x100.png?text=Trust",
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
    image: "https://via.placeholder.com/100x100.png?text=Guard",
  },
];

function InsurancePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [sortValue, setSortValue] = useState("");

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
    <h1 className="tw:text-3xl tw:font-bold tw:text-gray-800 tw:mb-6">
      Insurance Companies
    </h1>

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
      <div className="tw:grid tw:grid-cols-3 sm:tw:grid-cols-2 lg:tw:grid-cols-3 tw:gap-6 tw:mb-10 tw:max-w-7xl">
        {filteredCompanies.map((company) => (
          <InsuranceCompanyCard key={company.licenseNumber} company={company} />
        ))}
      </div>
    </div>
  </div>
);

}

export default InsurancePage;
