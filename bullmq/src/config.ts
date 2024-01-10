export default {
    redisConnection: {
        host: 'localhost',
        port: 6379
    },
    port: 3000,
    maxAttempts: 10,
    maxAttemptsForEmail: 5,
    backoffDelay: 2000,
    userPort: 3001,
}