const app = {
  port: process.env.APP_PORT || 3000,
  host: process.env.APP_HOST || 'localhost',
  token: {
    jwt: {
      access: process.env.ACCESS_TOKEN_KEY,
      refresh: process.env.REFRESH_TOKEN_KEY,
      age: process.env.ACCESS_TOKEN_AGE,
    },
  },
};

module.exports = app;