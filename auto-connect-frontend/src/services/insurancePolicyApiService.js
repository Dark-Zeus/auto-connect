import axios from "@utils/axios";

const BASE_URL = "insurance/policies";

export const getAllInsurancePolicies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching insurance policies:", error);
    throw error;
  }
};

export const getInsurancePolicyById = async (policyId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${policyId}`);
    return response.data;
    } catch (error) {
    console.error(`Error fetching insurance policy with ID ${policyId}:`, error);
    throw error;
  }
};

export const createInsurancePolicy = async (policyData) => {
  try {
    const response = await axios.post(`${BASE_URL}/`, policyData);
    return response.data;
  } catch (error) {
    console.error("Error creating insurance policy:", error);
    throw error;
  }
};

export const getInsurancePolicyByCustomer = async (customerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/customer/${customerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching insurance policies for customer ID ${customerId}:`, error);
    throw error;
  }
};


export const createInsurancePolicyType = async (policyTypeData) => {
  try {
    const response = await axios.post(`${BASE_URL}/types`, policyTypeData);
    return response.data;
  } catch (error) {
    console.error("Error creating insurance policy type:", error);
    throw error;
  }
};

export const getAllInsurancePolicyTypes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/types`);
    return response.data;
  } catch (error) {
    console.error("Error fetching insurance policy types:", error);
    throw error;
  }
};

export const updateInsurancePolicyType = async (policyTypeId, updatedData) => {
  try {
    const response = await axios.put(`${BASE_URL}/types/${policyTypeId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating insurance policy type with ID ${policyTypeId}:`, error);
    throw error;
  }
};

export const deleteInsurancePolicyType = async (policyTypeId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/types/${policyTypeId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting insurance policy type with ID ${policyTypeId}:`, error);
    throw error;
  }
};