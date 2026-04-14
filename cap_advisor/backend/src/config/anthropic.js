const { Anthropic } = require('@anthropic-ai/sdk');
const { initEnv } = require('./env');

const env = initEnv();
const anthropicClient = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

module.exports = { anthropicClient };
