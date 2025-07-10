import React from "react";
import CompanyRegistrationForm from "@components/InsuranceCompany/CompanyRegistrationForm";

function CompanyRegistration() {
  return (
    <div className="tw:min-h-screen tw:w-full tw:bg-gradient-to-br tw:from-slate-100 tw:to-blue-50">
      <div className="tw:w-full sm:tw:w-11/12 md:tw:w-4/5 lg:tw:w-[70%] tw:mx-auto">
        <CompanyRegistrationForm />
      </div>
    </div>
  );
}

export default CompanyRegistration;
