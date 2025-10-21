import InsuranceClaim from "../models/insuranceClaim.model.js";

function createInsuranceClaim(data) {
    const claim = new InsuranceClaim(data);
    return claim.save();
}

function getAllInsuranceClaims() {  
    return InsuranceClaim.find();
}

function getInsuranceClaimsByCustomer(customerId) {
    return InsuranceClaim.find({ customerRef: customerId }).populate('vehicleRef').populate('insurancePolicyRef').populate('customerRef');
}

function getAllInsuranceClaimsByCompany(companyId) {
    return InsuranceClaim.find().populate('vehicleRef').populate('insurancePolicyRef').populate('customerRef');
}

function updateInsuranceClaimStatus(claimId, status) {
    return InsuranceClaim.findByIdAndUpdate(claimId, { status: status }, { new: true });
}

function updateInsuranceClaimWithFinalReport(claimId, finalReportData) {
    return InsuranceClaim.findByIdAndUpdate(claimId, { finalReport: finalReportData, status: "Completed" }, { new: true });
}

export default {
    createInsuranceClaim,
    getAllInsuranceClaims,
    getInsuranceClaimsByCustomer,
    getAllInsuranceClaimsByCompany,
    updateInsuranceClaimStatus,
    updateInsuranceClaimWithFinalReport,
};