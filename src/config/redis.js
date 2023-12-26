import dotenv from "dotenv";

dotenv.config();

const Redis = require('ioredis');

const redis = new Redis({
  host: 'red-cm5jdpmd3nmc73anmhfg',
  port: 6379,
});

module.exports = redis;
