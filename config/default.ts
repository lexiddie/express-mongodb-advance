export default {
  port: process.env.PORT || 4000,
  host: 'localhost',
  dbUri: process.env.DB_CONNECTION,
  saltWorkFactor: 10,
  accessTokenTtl: '15m',
  refreshTokenTtl: '1y'
};
