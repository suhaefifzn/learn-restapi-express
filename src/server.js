require('dotenv').config();

const express = require('express');

// config
const appConfig = require('./config/app');

// middleware
const { ErrorGlobalHandler } = require('./middleware/errorGlobal');

// routes
const { router: usersRoutes } = require('./routes/usersRoutes');
const { router: authRoutes } = require('./routes/authRoutes');

const app = express();

app.use(express.json());

// use routes
app.use('/authentications', authRoutes);
app.use('/users', usersRoutes);

// when route not found
app.use((req, res, next) => {
  return res.status(404).json({
    status: 'fail',
    message: 'Route tidak ditemukan',
  });
});

// use middleware handle error
app.use(ErrorGlobalHandler);

// run server
app.listen(appConfig.port, appConfig.host, () => {
  console.log(`Aplikasi berjalan di http://${appConfig.host}:${appConfig.port}`);
});