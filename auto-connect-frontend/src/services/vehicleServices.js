// src/services/vehicleService.js
import axios from "../utils/axios";

class VehicleService {
  async registerVehicle(vehicleData) {
    const response = await axios.post("/vehicles/register", vehicleData);
    return response.data;
  }

  async getUserVehicles(params = {}) {
    const response = await axios.get("/vehicles", { params });
    return response.data;
  }

  async getVehicleById(vehicleId) {
    const response = await axios.get(`/vehicles/${vehicleId}`);
    return response.data;
  }

  async updateVehicle(vehicleId, updateData) {
    const response = await axios.put(`/vehicles/${vehicleId}`, updateData);
    return response.data;
  }

  async getVehicleHistory(vehicleId, params = {}) {
    const response = await axios.get(`/vehicles/${vehicleId}/history`, {
      params,
    });
    return response.data;
  }

  async updateInsurance(vehicleId, insuranceData) {
    const response = await axios.put(
      `/vehicles/${vehicleId}/insurance`,
      insuranceData
    );
    return response.data;
  }

  async updateRevenueLicense(vehicleId, licenseData) {
    const response = await axios.put(
      `/vehicles/${vehicleId}/revenue-license`,
      licenseData
    );
    return response.data;
  }

  async addEmissionTest(vehicleId, testData) {
    const response = await axios.post(
      `/vehicles/${vehicleId}/emission-test`,
      testData
    );
    return response.data;
  }

  async getVehicleAnalytics() {
    const response = await axios.get("/vehicles/analytics");
    return response.data;
  }
}

export default new VehicleService();
