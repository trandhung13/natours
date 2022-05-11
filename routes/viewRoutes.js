const express = require('express');
const viewControllers = require('../controllers/viewControllers');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewControllers.getOverview
);
router.get(
  '/tour/:tourSlug',
  authController.isLoggedIn,
  viewControllers.getTour
);
router.get('/login', authController.isLoggedIn, viewControllers.login);
router.get('/me', authController.protect, viewControllers.getAccount);
router.get('/my-tours', authController.protect, viewControllers.getMyTours);

module.exports = router;
