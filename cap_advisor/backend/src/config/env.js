const Joi = require('joi');

function initEnv() {
  const schema = Joi.object({
    PORT: Joi.number().default(3000),
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    DATABASE_URL: Joi.string().uri().required(),
    JWT_SECRET: Joi.string().min(32).required(),
    JWT_REFRESH_SECRET: Joi.string().min(32).required(),
    JWT_EXPIRES_IN: Joi.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
    ANTHROPIC_API_KEY: Joi.string().required(),
    FRONTEND_URL: Joi.string().uri().required(),
    RATE_LIMIT_WINDOW_MS: Joi.number().default(900000),
    RATE_LIMIT_MAX: Joi.number().default(100)
  }).unknown();

  const { value, error } = schema.validate(process.env);
  if (error) {
    throw new Error(`Environment validation error: ${error.message}`);
  }

  return value;
}

module.exports = { initEnv };
