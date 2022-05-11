/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe(
  'pk_test_51Kx4izAv33riEHeTosKRobz49zTCE2wl317Sa617D3BVUPH89HFrA1Hnaz39kKEp1V4if6kbJddJA0UCDcAXLmGY00kIacpfF3'
);

export const booktour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2) Create checkout form and charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    consol.log(err);
    showAlert('error', err);
  }
};
