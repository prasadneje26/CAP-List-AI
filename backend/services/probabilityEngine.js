// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/services/probabilityEngine.js
// ============================================================

const axios  = require('axios');
const logger = require('../utils/logger');

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://ai-engine:8000';

/**
 * Call AI engine to get admission probability for a student + college pair.
 * Falls back to a local heuristic if AI engine is unreachable.
 */
const getAdmissionProbability = async ({ percentile, cutoff_percentile, category, exam_type }) => {
  try {
    const response = await axios.post(
      `${AI_ENGINE_URL}/admission/predict`,
      { percentile, cutoff_percentile, category, exam_type },
      { timeout: 5000 }
    );
    return response.data.probability;
  } catch (err) {
    logger.warn('AI engine unreachable — using heuristic probability');
    return heuristicProbability(percentile, cutoff_percentile);
  }
};

/**
 * Local heuristic probability when AI engine is down.
 * Sigmoid-like curve based on percentile gap.
 */
const heuristicProbability = (percentile, cutoff) => {
  const gap = parseFloat(percentile) - parseFloat(cutoff);

  // Sigmoid: P = 1 / (1 + e^(-k*gap))
  const k = 0.8;
  const raw = 1 / (1 + Math.exp(-k * gap));

  // Scale to 5–95% (never 0 or 100)
  const probability = Math.round((raw * 90 + 5) * 10) / 10;
  return Math.min(95, Math.max(5, probability));
};

/**
 * Batch probability computation for a list of colleges.
 */
const batchProbabilities = async (colleges, studentData) => {
  const results = await Promise.all(
    colleges.map(async (college) => {
      const probability = await getAdmissionProbability({
        percentile:        studentData.percentile,
        cutoff_percentile: college.cutoff_percentile,
        category:          studentData.category,
        exam_type:         studentData.exam_type,
      });
      return { ...college, admission_probability: probability };
    })
  );
  return results;
};

module.exports = { getAdmissionProbability, heuristicProbability, batchProbabilities };
