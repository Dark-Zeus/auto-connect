import apiClient from "../utils/axios";

export const activateVehicleBump = (adId, payload) =>
  apiClient.post(`/ads/${adId}/bump`, payload);

export const createPromotionCheckoutSession = (amount, productName = "Ad Bump Promotion", metadata = {}) =>
  apiClient.post(`/promotion-payments/create-session`, { amount, productName, metadata });