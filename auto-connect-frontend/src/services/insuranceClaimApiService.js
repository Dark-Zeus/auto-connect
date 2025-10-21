import axios from "@utils/axios";

const BASE_URL = "insurance/claims";

export const createInsuranceClaim = async (claimData) => {
    try {
        const response = await axios.post(BASE_URL, claimData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating insurance claim:", error);
        throw (
            error.response?.data ||
            { message: "Failed to create insurance claim" }
        );
    }
};

export const getInsuranceClaimsByCustomer = async (customerId) => {
    try {
        const response = await axios.get(`${BASE_URL}/customer/${customerId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching insurance claims for customer ID ${customerId}:`, error);
        throw error;
    }
};

export const getInsuranceClaimsByCompany = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/company`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching insurance claims for company ID:`, error);
        throw error;
    }
};

export const updateInsuranceClaimStatus = async (claimId, statusData) => {
    try {
        const response = await axios.put(`${BASE_URL}/${claimId}/status`, statusData);
        return response.data;
    } catch (error) {
        console.error(`Error updating status for insurance claim ID ${claimId}:`, error);
        throw error;
    }
};

export const submitFinalReport = async (claimId, reportData) => {
    try {
        const response = await axios.put(`${BASE_URL}/${claimId}/final-report`, reportData);
        return response.data;
    } catch (error) {
        console.error(`Error submitting final report for insurance claim ID ${claimId}:`, error);
        throw error;
    }
};