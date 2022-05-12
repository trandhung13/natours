const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking')
    res.locals.alert =
      "Your booking was successfully! Please check email for a confirmation.If your booking does't show up here immediately, please try again later.";
  next();
};

exports.getOverview = catchAsync(async (req, res) => {
  // 1) Get data from model(collection)
  const tours = await Tour.find();
  // 2) Build template

  // 3) Render that template using data from 1)
  res.status(200).render('overview', {
    title: '',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.tourSlug })
    .populate({
      path: 'reviews',
      fields: 'review rating user'
    })
    .populate({
      path: 'guides'
    });
  if (!tour) return next(new AppError('There is no tour with that name', 404));

  // 2) Build template
  // 3) Render that template using data from 1)
  res.status(200).render('tour', {
    title: tour.name,
    tour
  });
});

exports.getMyTours = catchAsync(async (req, res) => {
  // 1) Find all bookings from req.user
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with returned Ids
  const tourIds = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });
  res.status(200).render('overview', {
    title: 'My tours',
    tours
  });
});

exports.login = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: res.locals.user.name
  });
};
