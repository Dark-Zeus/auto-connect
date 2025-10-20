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