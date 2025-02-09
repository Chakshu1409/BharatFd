const Redis = require('ioredis');
const dotenv = require('dotenv');
dotenv.config();
const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    // password: process.env.REDIS_PASSWORD, // if applicable
});
redis.on('connect', () => {
    console.log('Redis client connected');
});
redis.on('error', (err) => {
    console.error('Redis error: ', err);
});
module.exports = redis;