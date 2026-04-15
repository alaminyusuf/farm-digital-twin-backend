/**
 * Validates that all required environment variables are set.
 * Throws an error if any are missing.
 */
const validateEnv = () => {
    const required = [
        "MONGO_URI",
        "JWT_SECRET"
    ];

    const missing = required.filter(env => !process.env[env]);

    if (missing.length > 0) {
        console.error(`ERROR: Missing required environment variables: ${missing.join(", ")}`);
        process.exit(1);
    }
};

module.exports = validateEnv;
