import mongoose from "mongoose";

const insurancePolicyTypeSchema = new mongoose.Schema({
    insuranceCompanyId: { type: String, required: true },
    policyTypeNumber: { type: String, required: true, unique: true },
    policyTypeName: { type: String, required: true },
    description: { type: String, required: true },
    premiumPerLakh: { type: Number, required: true },
    effectiveDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    documents: { type: [String], required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

const InsurancePolicyType = mongoose.model("InsurancePolicyType", insurancePolicyTypeSchema);
export default InsurancePolicyType;