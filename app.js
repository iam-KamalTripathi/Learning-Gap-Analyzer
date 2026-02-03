// core modules
const express = require('express');
const cookieParser = require('cookie-parser');

// internal modules
const userRouter = require('./src/Router/userRouter');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/intellify/api/v1/user', userRouter);

module.exports = app;
