import InsurancePolicy from "../models/insurancePolicy.model.js";

function createPolicy(data) {
    console.log("Creating policy with data:", data);
    const policy = new InsurancePolicy(data);
    return policy.save();
}

function getAllInsurancePolicies() {
    return InsurancePolicy.find();
}

function getAllInsurancePoliciesByCompany(companyId) {
    return InsurancePolicy.find({ insuranceCompanyId: companyId });
}

export default {
    createPolicy,
    getAllInsurancePolicies,
    getAllInsurancePoliciesByCompany,
};