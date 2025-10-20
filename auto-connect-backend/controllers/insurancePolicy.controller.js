import InsurancePolicyService from '../services/insurancePolicy.service.js';
import InsurancePolicyTypeService from '../services/insurancePolicyType.service.js';

const createInsurancePolicy = async (req, res) => {
    try {
        const policyData = req.body;
        const policy = {
            policyNumber: policyData.policyNumber,
            insuranceCompanyId: policyData.insuranceCompanyId || "IC123456", // Placeholder company ID
            customer: {
                fullName: policyData.vehicleOwnerName,
                nic: policyData.nic,
                email: policyData.email,
                phone: policyData.contactNo,
                address: policyData.address,
            },
            vehicle: {
                vehicleType: policyData.vehicleType,
                vehicleNumber: policyData.vehicleNumber,
                vrn: policyData.vehicleRegistrationNumber,
                chassisNumber: policyData.chassisNumber,
                make: policyData.vehicleMake,
                model: policyData.vehicleModel,
                engineCapacity: policyData.engineCapacity,
                yearOfManufacture: policyData.manufactureYear,
                fuelType: policyData.fuelType,
                estimatedValue: policyData.estimatedValue,
            },
            policyType: policyData.policyType,
            startDate: policyData.policyStartDate,
            endDate: policyData.policyEndDate,
            premium: policyData.premiumAmount,
            digitalSignature: policyData.digitalSignature, 
        }
        const newPolicy = await InsurancePolicyService.createPolicy(policy);
        res.status(201).json({
            success: true,
            message: "Insurance policy created successfully",
            data: newPolicy,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating insurance policy",
            error: error.message,
        });
    }
};

const getAllInsurancePoliciesByCompany = async (req, res) => {
    try {
        const companyId = req.body.userId || "IC123456"; // Will be retrieved from authenticated user in real scenario
        const policies = await InsurancePolicyService.getAllInsurancePoliciesByCompany(companyId);
        res.status(200).json({
            success: true,
            message: "Insurance policies retrieved successfully",
            data: policies,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving insurance policies",
            error: error.message,
        });
    }
};

const createInsurancePolicyType = async (req, res) => {
    const companyId = req.body.userId || "IC123456"; // Will be retrieved from authenticated user in real scenario
    try {
        const policyTypeData = req.body;
        policyTypeData.insuranceCompanyId = companyId;
        const newPolicyType = await InsurancePolicyTypeService.createPolicyType(policyTypeData);
        res.status(201).json({
            success: true,
            message: "Insurance policy type created successfully",
            data: newPolicyType,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Policy type with this policyTypeNumber already exists",
                error: error.message,
            });
        }
        res.status(500).json({
            success: false,
            message: "Error creating insurance policy type",
            error: error.message,
        });
    }
};

const getAllInsurancePolicyTypesByCompany = async (req, res) => {
    try {
        const companyId = req.body.userId || "IC123456"; // Will be retrieved from authenticated user in real scenario
        const policyTypes = await InsurancePolicyTypeService.getAllInsurancePolicyTypesByCompany(companyId);
        res.status(200).json({
            success: true,
            message: "Insurance policy types retrieved successfully",
            data: policyTypes,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving insurance policy types",
            error: error.message,
        });
    }   
};

const updateInsurancePolicyType = async (req, res) => {
    try {
        const policyTypeId = req.params.id;
        const updateData = req.body;
        const updatedPolicyType = await InsurancePolicyTypeService.updatePolicyType(policyTypeId, updateData);
        res.status(200).json({
            success: true,
            message: "Insurance policy type updated successfully",
            data: updatedPolicyType,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Policy type with this policyTypeNumber already exists",
                error: error.message,
            });
        }
        res.status(500).json({
            success: false,
            message: "Error updating insurance policy type",
            error: error.message,
        });
    }
};

const deleteInsurancePolicyType = async (req, res) => {
    try {
        const policyTypeId = req.params.id;
        await InsurancePolicyTypeService.deletePolicyType(policyTypeId);
        res.status(200).json({
            success: true,
            message: "Insurance policy type deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting insurance policy type",
            error: error.message,
        });
    }
};

export default {
    createInsurancePolicy,
    getAllInsurancePoliciesByCompany,

    createInsurancePolicyType,
    getAllInsurancePolicyTypesByCompany,
    updateInsurancePolicyType,
    deleteInsurancePolicyType,
};