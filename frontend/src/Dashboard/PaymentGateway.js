import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Elements, 
  CardNumberElement, 
  CardExpiryElement, 
  CardCvcElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2'; // 1. Import SweetAlert2
import './PaymentGateway.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = (props) => {
  const { amount, onBack, onSuccess, groupName, userId, userEmail } = props;
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [cardholderName, setCardholderName] = useState('');
  const [zipCode, setZipCode] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    if (zipCode.length !== 5) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid ZIP Code',
        text: 'Please enter a valid 5-digit ZIP code.',
        confirmButtonColor: '#4c1d95'
      });
      return;
    }

    setProcessing(true);

    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${API_BASE_URL}/payments/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();

      if (!response.ok || !data.clientSecret) {
        setProcessing(false);
        Swal.fire({
          icon: 'error',
          title: 'Payment Error',
          text: data.message || 'The payment server is currently unavailable.',
          confirmButtonColor: '#4c1d95'
        });
        return; 
      }
      
      const clientSecret = data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: { 
            name: cardholderName,
            address: { postal_code: zipCode },
            email: userEmail 
          },
        },
      });

      if (result.error) {
        // This catches "Card is expired", "Incorrect CVC", etc.
        Swal.fire({
          icon: 'error',
          title: 'Card Declined',
          text: result.error.message,
          confirmButtonColor: '#4c1d95'
        });
      } else if (result.paymentIntent.status === 'succeeded') {
        
        try {
          await fetch(`${API_BASE_URL}/payments/save-success`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              transactionId: result.paymentIntent.id,
              amount: amount,
              payerName: cardholderName,
              userEmail: userEmail,
              userId: userId,
              groupName: groupName, 
              zipCode: zipCode
            }),
          });
        } catch (dbError) {
          console.error("Database recording failed:", dbError);
        }

        // Show a success message before moving to the next screen
        Swal.fire({
          icon: 'success',
          title: 'Payment Successful!',
          text: `R${amount} has been paid to ${groupName}`,
          timer: 2000,
          showConfirmButton: false
        });

        onSuccess(result.paymentIntent.id);
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'System Error',
        text: 'An unexpected error occurred. Please try again.',
        confirmButtonColor: '#4c1d95'
      });
      console.error("Payment Handler Error:", err);
    } finally {
      setProcessing(false);
    }
  };

  const elementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#111827',
        fontFamily: '"Public Sans", sans-serif',
        '::placeholder': { color: '#9ca3af' },
      },
    },
  };

  return (
    <article className="add-card-container">
      <header className="form-header">
        <h1>Secure Payment</h1>
        <p>Paying R {amount} to {groupName}</p>
      </header>

      <form onSubmit={handleSubmit} className="card-details-form">
        <label htmlFor="cardName">Cardholder's Name</label>
        <input 
          id="cardName"
          type="text" 
          placeholder="Enter full name"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          required
        />

        <label htmlFor="cardNumber">Card Number</label>
        <section className="stripe-input-wrapper">
          <CardNumberElement id="cardNumber" options={elementOptions} />
        </section>

        <section className="split-inputs">
          <article>
            <label htmlFor="expiry">Expiry Date</label>
            <section className="stripe-input-wrapper">
              <CardExpiryElement id="expiry" options={elementOptions} />
            </section>
          </article>

          <article>
            <label htmlFor="cvc">CVC</label>
            <section className="stripe-input-wrapper">
              <CardCvcElement id="cvc" options={elementOptions} />
            </section>
          </article>
        </section>

        <label htmlFor="zip">ZIP / Postal Code</label>
        <input 
          id="zip"
          type="text"
          placeholder="10001"
          maxLength="5"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))} 
          required
        />
        
        <button type="submit" disabled={!stripe || processing} className="btn-pay-now">
          {processing ? "Processing..." : `Pay R${amount}`}
        </button>
      </form>
      
      <footer className="form-footer">
        <button onClick={onBack} className="btn-back-link">
          <ArrowLeft size={14} /> Back
        </button>
      </footer>
    </article>
  );
};

const PaymentGateway = (props) => {
  return (
    <main className="payment-view-bg">
      <Elements stripe={stripePromise}>
        <CheckoutForm {...props} />
      </Elements>
    </main>
  );
};

export default PaymentGateway;