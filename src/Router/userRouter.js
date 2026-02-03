const express = require('express');
const authController = require('../Controller/authController');

const userRouter = express.Router();

userRouter.post('/signUp', authController.signUp); // intellify/api/v1/user/signUp;
userRouter.post('/login', authController.login); // intellify/api/v1/user/login;

module.exports = userRouter;
