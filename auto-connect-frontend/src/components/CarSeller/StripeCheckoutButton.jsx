import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const StripeCheckoutButton = ({ amount, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      '{CLIENT_SECRET}', // Replace with your client secret from the backend
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    if (error) {
      console.error(error);
      alert(error.message);
    } else {
      if (paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay ${amount}
      </button>
    </form>
  );
};

export default StripeCheckoutButton;