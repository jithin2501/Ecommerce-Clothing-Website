
const { createClient } = require('redis');

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis client error:', err));

// Connect once at startup; the rest of the app imports this ready client.
(async () => {
    await redisClient.connect();
    console.log('Redis connected.');
})();

module.exports = redisClient;