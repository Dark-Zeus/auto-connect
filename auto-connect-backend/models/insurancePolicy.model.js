import mongoose from 'mongoose';

const insurancePolicySchema = new mongoose.Schema({
    //insuaranceCompanyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    insuranceCompanyId: {type: String, required: true },
    policyNumber: { type: String, required: true, unique: true },
    customer: {
        fullName: { type: String, required: true },
        nic: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
    },
    vehicle: {
        vehicleType: { type: String, required: true },
        vehicleNumber: { type: String, required: true },
        vrn: { type: String, required: true },
        engineCapacity: { type: Number, required: true },
        chassisNumber: { type: String, required: true },
        make: { type: String, required: true },
        model: { type: String, required: true },
        yearOfManufacture: { type: Number, required: true },
        fuelType: { type: String, required: true },
        estimatedValue: { type: Number, required: true },
    },
    policyType: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }, // 1 year validity
    premium: { type: Number, required: true }, // calculated based on vehicle value and policy type
    status: { type: String, enum: ['Active', 'Expired', 'Cancelled'], default: 'Active' },
    coverageDetails: {
        thirdPartyLiability: { type: Boolean, default: false },
        ownDamage: { type: Boolean, default: false },
        personalAccidentCover: { type: Boolean, default: false },
        roadsideAssistance: { type: Boolean, default: false },
        towingService: { type: Boolean, default: false },
        rentalCarCoverage: { type: Boolean, default: false },
    },
    digitalSignature: { type: String  },
}, { timestamps: true });

// pre-save hook to ensure policy end date is one year from start date
insurancePolicySchema.pre('save', function(next) {
    if (!this.endDate) {
        const startDate = this.startDate || new Date();
        this.endDate = new Date(startDate.setFullYear(startDate.getFullYear() + 1));
    }
    next();
});

// pre-save hook to save coverage details based on policy type
insurancePolicySchema.pre('save', function(next) {
    if (this.policyType === 'Comprehensive') {
        this.coverageDetails = {
            thirdPartyLiability: true,
            ownDamage: true,
            personalAccidentCover: true,
            roadsideAssistance: true,
            towingService: true,
            rentalCarCoverage: true,
        };
    } else if (this.policyType === 'Third Party') {
        this.coverageDetails = {
            thirdPartyLiability: true,
            ownDamage: false,
            personalAccidentCover: false,
            roadsideAssistance: false,
            towingService: false,
            rentalCarCoverage: false,
        };
    }
    next();
});

const InsurancePolicy = mongoose.model('InsurancePolicy', insurancePolicySchema);

export default InsurancePolicy;