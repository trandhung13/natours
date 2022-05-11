const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc)
      return next(
        new AppError(
          `This ${Model.modelName.toLowerCase()} no longer exists.`,
          404
        )
      );

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const modelName = Model.modelName.toLowerCase();
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      runValidator: true,
      new: true
    });
    if (!doc)
      return next(new AppError(`This ${modelName} can't be found.`, 404));

    res.status(200).json({
      status: 'success',
      data: {
        [modelName]: doc
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    const modelName = Model.modelName.toLowerCase();
    if (query) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      return next(new AppError(`No ${modelName} found with that ID`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        [modelName]: doc
      }
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    // To allow for nested GET reviews on tour
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // To allow for nested GET bookings on user
    if (req.params.id) filter = { user: req.params.id };
    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;
    const modelName = Model.modelName.toLowerCase();
    if (!doc) {
      return next(new AppError(`No ${modelName} found with that ID`, 404));
    }

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        [modelName]: doc
      }
    });
  });
