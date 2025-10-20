import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";

const PUBLISHABLE_KEY =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_STRIPE_PK ||
  "";

const stripePromise = PUBLISHABLE_KEY
  ? loadStripe(PUBLISHABLE_KEY)
  : Promise.resolve(null);

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:3000/api/v1"
).replace(/\/$/, "");

export async function processPayment(vehicleData) {
  try {
    if (!PUBLISHABLE_KEY) {
      toast.error("Stripe key missing.");
      throw new Error("Publishable key missing");
    }

    const stripe = await stripePromise;
    if (!stripe) throw new Error("Stripe initialization failed");

    const fixedAmount = 3000;

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("authToken");

    const res = await fetch(`${API_BASE_URL}/payments/create-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ amount: fixedAmount, vehicleData }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Create-session failed:", data);
      toast.error(data.error || "Payment init failed");
      throw new Error(data.error || "Failed to create session");
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId: data.sessionId,
    });

    if (error) {
      console.error("redirectToCheckout error:", error);
      toast.error(error.message || "Redirect failed");
      throw error;
    }
  } catch (err) {
    console.error("processPayment error:", err);
    if (!err.silent) toast.error(err.message || "Payment processing failed");
    throw err;
  }
}