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
    return InsurancePolicy.find({ insuranceCompanyId: companyId }).populate('customerRef').populate('vehicleRef');
}

function getAllInsurancePoliciesByCustomer(id) {
    return InsurancePolicy.find({ customerRef: id }).populate('vehicleRef').populate('customerRef');
}

export default {
    createPolicy,
    getAllInsurancePolicies,
    getAllInsurancePoliciesByCompany,
    getAllInsurancePoliciesByCustomer,
};