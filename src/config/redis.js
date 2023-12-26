import dotenv from "dotenv";

dotenv.config();

const Redis = require('ioredis');

const redis = new Redis({
  host: 'localhost',
  port: process.env.REDIS_PORT,
});

module.exports = redis;
