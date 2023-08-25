// redisConfig.js
const Redis = require('ioredis');

const redis = new Redis({
  host: 'localhost',
  port: 6379,
  // Add other configuration options as needed
});

module.exports = redis;
