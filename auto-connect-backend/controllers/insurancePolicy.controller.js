import mongoose from 'mongoose';

import InsurancePolicyService from '../services/insurancePolicy.service.js';
import InsurancePolicyTypeService from '../services/insurancePolicyType.service.js';

const createInsurancePolicy = async (req, res) => {
    try {
        const policyData = req.body;
        const policy = {
            policyNumber: policyData.policyNumber,
            insuranceCompanyId: policyData.insuranceCompanyId || req.user?.id || "IC123456", // Placeholder company ID
            customerRef: policyData.customerRef,
            vehicleRef: policyData.vehicleRef,
            policyType: policyData.policyType,
            startDate: policyData.policyStartDate,
            endDate: policyData.policyEndDate,
            premium: policyData.premiumAmount,
            digitalSignature: policyData.digitalSignature,
            estimatedValue: policyData.estimatedValue,
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
        const companyId = req.user?.id || "IC123456"; // Will be retrieved from authenticated user in real scenario
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

const getAllInsurancePoliciesByCustomer = async (req, res) => {
    try {
        const id = req.params.id;
        const policies = await InsurancePolicyService.getAllInsurancePoliciesByCustomer(id);
        res.status(200).json({
            success: true,
            message: "Insurance policies for customer retrieved successfully",
            data: policies,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving insurance policies for customer",
            error: error.message,
        });
    }
};

const createInsurancePolicyType = async (req, res) => {
    const companyId = req.user?.id || "IC123456"; // Will be retrieved from authenticated user in real scenario
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
        const companyId = req.user?.id || "IC123456"; // Will be retrieved from authenticated user in real scenario
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
    getAllInsurancePoliciesByCustomer,

    createInsurancePolicyType,
    getAllInsurancePolicyTypesByCompany,
    updateInsurancePolicyType,
    deleteInsurancePolicyType,
};