import InsurancePolicyType from "../models/insurancePolicyType.model.js";

function createPolicyType(data) {
    console.log("Creating policy type with data:", data);
    const policyType = new InsurancePolicyType(data);
    return policyType.save();
}

function getAllInsurancePolicyTypes() {
    return InsurancePolicyType.find();
}

function getAllInsurancePolicyTypesByCompany(companyId) {
    return InsurancePolicyType.find({ insuranceCompanyId: companyId });
}

function updatePolicyType(policyTypeId, updateData) {
    return InsurancePolicyType.findByIdAndUpdate(policyTypeId, updateData, { new: true });
}

function deletePolicyType(policyTypeId) {
    return InsurancePolicyType.findByIdAndDelete(policyTypeId);
}

export default {
    createPolicyType,
    getAllInsurancePolicyTypes,
    getAllInsurancePolicyTypesByCompany,
    updatePolicyType,
    deletePolicyType,
};