import apiClient from "../utils/axios";

export const activateVehicleBump = (adId, payload) =>
  apiClient.post(`/ads/${adId}/bump`, payload);