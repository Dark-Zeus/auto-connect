import axios from "@utils/axios";

export const getVehicleOwnerDetailsByNic = async (nic) => {
  try {
    const response = await axios.get(`users/vehicleowners/nic/${nic}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching vehicle owner details for NIC ${nic}:`, error);
    throw error;
  }
};