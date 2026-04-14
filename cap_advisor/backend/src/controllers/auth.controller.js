const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Joi = require('joi');
const { findUserByEmail, createUser, updateRefreshTokenHash, clearRefreshTokenHash } = require('../models/user.model');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwtHelper');
const { successResponse, errorResponse } = require('../utils/responseHelper');

const registerSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  phone: Joi.string().allow('', null)
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required()
});

async function register(req, res, next) {
  try {
    const { error, value } = registerSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(422).json(errorResponse('Validation error', error.details.map((d) => d.message)));
    }

    const existing = await findUserByEmail(value.email);
    if (existing) {
      return res.status(409).json(errorResponse('Email is already registered'));
    }

    const passwordHash = await bcrypt.hash(value.password, 12);
    const user = await createUser({ name: value.name, email: value.email, passwordHash, phone: value.phone });
    const accessToken = signAccessToken({ sub: user.id, email: user.email });
    const refreshToken = signRefreshToken({ sub: user.id, email: user.email });
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await updateRefreshTokenHash(user.id, refreshTokenHash);

    return res.status(201).json(successResponse({ user, accessToken, refreshToken }, 'User registered successfully'));
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { error, value } = loginSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(422).json(errorResponse('Validation error', error.details.map((d) => d.message)));
    }

    const user = await findUserByEmail(value.email);
    if (!user) {
      return res.status(401).json(errorResponse('Invalid credentials'));
    }

    const isValid = await bcrypt.compare(value.password, user.password_hash);
    if (!isValid) {
      return res.status(401).json(errorResponse('Invalid credentials'));
    }

    const accessToken = signAccessToken({ sub: user.id, email: user.email });
    const refreshToken = signRefreshToken({ sub: user.id, email: user.email });
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await updateRefreshTokenHash(user.id, refreshTokenHash);

    const payloadUser = { id: user.id, name: user.name, email: user.email, phone: user.phone };
    return res.status(200).json(successResponse({ user: payloadUser, accessToken, refreshToken }, 'Login successful'));
  } catch (err) {
    return next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const { error, value } = refreshSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(422).json(errorResponse('Validation error', error.details.map((d) => d.message)));
    }

    const tokenPayload = verifyRefreshToken(value.refreshToken);
    const user = await findUserByEmail(tokenPayload.email);
    if (!user) {
      return res.status(401).json(errorResponse('Invalid refresh token'));
    }

    const candidateHash = crypto.createHash('sha256').update(value.refreshToken).digest('hex');
    if (!user.refresh_token_hash || candidateHash !== user.refresh_token_hash) {
      return res.status(401).json(errorResponse('Invalid or revoked refresh token'));
    }

    const accessToken = signAccessToken({ sub: user.id, email: user.email });
    return res.status(200).json(successResponse({ accessToken }, 'Token refreshed successfully'));
  } catch (err) {
    return next(err);
  }
}

async function logout(req, res, next) {
  try {
    if (!req.user || !req.user.sub) {
      return res.status(401).json(errorResponse('Authentication required'));
    }
    await clearRefreshTokenHash(req.user.sub);
    return res.status(200).json(successResponse({}, 'Logged out successfully'));
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login, refresh, logout };
