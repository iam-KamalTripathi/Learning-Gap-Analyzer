const { v4: uuidv4 } = require('uuid');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('../Model/userModel');
const asyncHandler = require('../Utils/asyncHandler');
const AppError = require('../Utils/appError');

const signToken = (userUid) => {
  console.log(`${process.env.JWT_SECRET} , ${process.env.JWT_EXPIRES_IN}`);

  return jwt.sign({ userUid }, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_EXPIRES_IN}`,
  });
};

const createSendToken = (newUser, statusCode, res) => {
  const token = signToken(newUser.userUid);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    // httpOnly: true,
  };

  newUser.userPassword = undefined;

  res.cookie('JWT', token, cookieOptions);
  return res.status(statusCode).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
};

exports.signUp = asyncHandler(async (req, res, next) => {
  console.log('Reached signup ');

  const { userName, userEmail, userPassword } = req.body;

  if (!userName || !userEmail || !userPassword)
    return next(new AppError(400, 'Please Provide Required Fields'));

  console.log(req.body);

  const newUser = await User.create({
    userUid: uuidv4(),
    userName,
    userEmail,
    userPassword,
  });

  console.log('going to send token');

  createSendToken(newUser, 200, res);
});

exports.login = asyncHandler(async (req, res, next) => {
  const { userEmail, userPassword } = req.body;

  if (!userEmail || !userPassword)
    return next(new AppError(400, 'Please provide valid email or password'));

  const user = await User.findOne({ userEmail }).select('+userPassword');

  if (!user) return next(new AppError(404, 'User not found'));

  const isCorrect = await user.verifyPassword(userPassword);
  if (!isCorrect)
    return next(new AppError(401, 'Please provide valid password'));

  createSendToken(user, 200, res);
});
