// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/controllers/recommendationController.js
// ============================================================

const axios          = require('axios');
const { query }      = require('../config/db');
const { AppError }   = require('../middleware/errorMiddleware');
const logger         = require('../utils/logger');
const { filterColleges }    = require('../services/filteringEngine');
const { classifyColleges }  = require('../services/classificationEngine');
const { rankColleges }      = require('../services/rankingEngine');

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://ai-engine:8000';

// ── GET /api/recommendations ──────────────────────────────────
const getRecommendations = async (req, res, next) => {
  try {
    // Load student profile
    const studentResult = await query(
      'SELECT * FROM students WHERE user_id = $1',
      [req.user.id]
    );
    if (studentResult.rows.length === 0) {
      throw new AppError('Student profile not found', 404);
    }
    const student = studentResult.rows[0];

    // Try AI recommendation engine first
    let recommendations;
    try {
      const response = await axios.post(
        `${AI_ENGINE_URL}/recommendations`,
        {
          percentile:           student.percentile,
          exam_type:            student.exam_type,
          category:             student.category,
          branch_preferences:   student.branch_preferences,
          location_preferences: student.location_preferences,
          college_type:         student.college_type,
          budget_max:           student.budget_max,
        },
        { timeout: 8000 }
      );
      recommendations = response.data.recommendations;
    } catch {
      logger.warn('AI recommender unavailable — using rule-based fallback');

      // Fallback: filter → classify → rank
      const filtered    = await filterColleges({ ...student, percentile_buffer: 10 });
      const classified  = classifyColleges(filtered, student.percentile);
      const ranked      = rankColleges(classified, student.branch_preferences);

      // Return top 10
      recommendations = ranked.slice(0, 10).map((c) => ({
        college_id:        c.id,
        college_name:      c.name,
        college_code:      c.code,
        branch:            c.branch,
        district:          c.district,
        classification:    c.classification,
        ranking_score:     c.ranking_score,
        cutoff_percentile: c.cutoff_percentile,
        confidence:        c.confidence,
        annual_fees:       c.annual_fees,
        rating:            c.rating,
        placement_score:   c.placement_score,
        reason:            generateReason(c, student),
      }));
    }

    res.status(200).json({
      success: true,
      data: {
        recommendations,
        total: recommendations.length,
        based_on: {
          percentile: student.percentile,
          category:   student.category,
          exam_type:  student.exam_type,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── Generate human-readable recommendation reason ─────────────
const generateReason = (college, student) => {
  const parts = [];

  if (college.classification === 'Safe') {
    parts.push(`Strong match — your ${student.percentile} percentile is comfortably above the ${college.cutoff_percentile} cutoff.`);
  } else if (college.classification === 'Target') {
    parts.push(`Good fit — you are within range of the ${college.cutoff_percentile} cutoff.`);
  } else {
    parts.push(`Aspirational pick — push for this one as a stretch goal.`);
  }

  if (college.rating >= 8.5) parts.push(`Highly rated (${college.rating}/10).`);
  if (college.placement_score >= 80) parts.push(`Excellent placements (${college.placement_score}%).`);
  if (college.college_type === 'Government') parts.push('Government college — lower fees.');

  return parts.join(' ');
};

module.exports = { getRecommendations };
