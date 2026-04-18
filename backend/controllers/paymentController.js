// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/controllers/paymentController.js
// ============================================================
const logger = require('../utils/logger');

const PLANS = [
  {
    id: 'free',
    name: 'Explorer',
    price: 0,
    currency: 'INR',
    billing: 'free',
    description: 'Perfect for getting started',
    features: [
      '1 complimentary session/month',
      'Chat-based mentor interaction',
      'Basic college insights',
      'Community forum access',
    ],
    badge: null,
    cta: 'Book Free Session',
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 299,
    currency: 'INR',
    billing: 'per session',
    description: 'Most popular for serious students',
    features: [
      'Priority mentor matching',
      '60-min video call session',
      'Google Meet / Zoom link',
      'Session notes & follow-up',
      'Doubt clearing via chat',
    ],
    badge: 'Most Popular',
    cta: 'Book for ₹299',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 999,
    currency: 'INR',
    billing: 'per month',
    description: 'All-in for maximum guidance',
    features: [
      'Unlimited sessions/month',
      'Dedicated mentor assignment',
      'WhatsApp mentor access',
      'DTE form review & strategy',
      'Mock CAP round simulations',
      'Priority support 24/7',
    ],
    badge: 'Best Value',
    cta: 'Go Pro for ₹999/mo',
  },
];

// GET /api/payment/plans
const getPlans = (_req, res) => {
  res.json({ success: true, data: { plans: PLANS } });
};

// POST /api/payment/create-intent
const createPaymentIntent = async (req, res, next) => {
  try {
    const { plan_id, amount } = req.body;
    const plan = PLANS.find(p => p.id === plan_id);

    if (!plan) {
      return res.status(400).json({ success: false, message: 'Invalid plan selected' });
    }

    // Free plan — no payment needed
    if (plan.price === 0) {
      return res.json({
        success: true,
        data: { client_secret: null, plan_id: 'free', amount: 0, simulated: true },
      });
    }

    // Stripe integration when STRIPE_SECRET_KEY is set
    if (process.env.STRIPE_SECRET_KEY) {
      const Stripe = require('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: (amount || plan.price) * 100, // paise
        currency: 'inr',
        metadata: { plan_id, user_id: req.user.id },
        description: `CAP AI - ${plan.name} Plan`,
      });

      logger.info(`Stripe payment intent created: ${paymentIntent.id}`);
      return res.json({
        success: true,
        data: {
          client_secret: paymentIntent.client_secret,
          payment_intent_id: paymentIntent.id,
          plan_id,
          amount: plan.price,
          simulated: false,
        },
      });
    }

    // Simulated payment (demo mode — no Stripe key configured)
    const fakeIntentId = `pi_demo_${Date.now()}_${Math.random().toString(36).slice(2,9)}`;
    logger.info(`Simulated payment intent: ${fakeIntentId}`);
    return res.json({
      success: true,
      data: {
        client_secret: `${fakeIntentId}_secret`,
        payment_intent_id: fakeIntentId,
        plan_id,
        amount: plan.price,
        simulated: true,
      },
    });

  } catch (err) {
    next(err);
  }
};

// POST /api/payment/confirm  — record confirmed payment
const confirmPayment = async (req, res, next) => {
  try {
    const { payment_intent_id, plan_id } = req.body;
    if (!payment_intent_id || !plan_id) {
      return res.status(400).json({ success: false, message: 'Missing payment data' });
    }

    logger.info(`Payment confirmed for user ${req.user.id}: ${payment_intent_id} plan=${plan_id}`);

    res.json({
      success: true,
      message: 'Payment confirmed. You may now book your session.',
      data: { payment_intent_id, plan_id, confirmed_at: new Date().toISOString() },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPlans, createPaymentIntent, confirmPayment };
