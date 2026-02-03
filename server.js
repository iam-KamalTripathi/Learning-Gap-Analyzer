// core modules
require('dotenv').config();
const mongoose = require('mongoose');

// internal modules
const app = require('./app');

// TO catch unhandled synchronous errors
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 🤐 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const PORT = process.env.PORT || 8000;

// DATABASE CONNECTION

const DB = process.env.DB_STRING.replace('<USER>', process.env.DB_USER).replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => console.log('✅ DataBase Connected Successfully'))
  .catch((err) => {
    console.log(`❌ DataBase Connection failed Error: ${err}`);
  });

const server = app.listen(PORT, () => {
  console.log(`App runing on port ${PORT}...`);
});

// TO catch unhandled async reject

process.on('unhandledRejection', (err) => {
  console.log('UHANDLED REJECTION! 🤐 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
