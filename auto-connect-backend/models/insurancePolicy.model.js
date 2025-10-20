import mongoose from 'mongoose';

const insurancePolicySchema = new mongoose.Schema({
    //insuaranceCompanyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    insuranceCompanyId: {type: String, required: true },
    policyNumber: { type: String, required: true, unique: true },
    customerRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vehicleRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    policyType: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }, // 1 year validity
    premium: { type: Number, required: true }, // calculated based on vehicle value and policy type
    status: { type: String, enum: ['Active', 'Expired', 'Cancelled'], default: 'Active' },
    estimatedValue: { type: Number  },
    digitalSignature: { type: String  },
}, { timestamps: true });

// pre-save hook to ensure policy end date is one year from start date
insurancePolicySchema.pre('save', function(next) {
    if (!this.endDate) {
        const base = this.startDate ? new Date(this.startDate) : new Date();
        base.setFullYear(base.getFullYear() + 1);
        this.endDate = base;
    }
    next();
});

const InsurancePolicy = mongoose.model('InsurancePolicy', insurancePolicySchema);

export default InsurancePolicy;