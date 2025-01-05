export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  jwt_secret: parseInt(process.env.JWT_SECRET, 10) || 3000,
  database: {
    url: process.env.DATABASE_URL,
  },
});
