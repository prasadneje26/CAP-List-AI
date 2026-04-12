// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/controllers/predictionController.js
// ============================================================

const axios                   = require('axios');
const { v4: uuidv4 }          = require('uuid');
const { query }               = require('../config/db');
const { AppError }            = require('../middleware/errorMiddleware');
const logger                  = require('../utils/logger');
const { filterColleges }      = require('../services/filteringEngine');
const { classifyColleges,
        groupByClassification,
        validateBalance }      = require('../services/classificationEngine');
const { rankColleges,
        topPerBucket }         = require('../services/rankingEngine');
const { batchProbabilities }  = require('../services/probabilityEngine');
const { generateCAPOrder,
        validateCAPList }      = require('../services/capOrderEngine');

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://ai-engine:8000';

// ── Helper: save prediction results to DB ─────────────────────
const savePredictions = async (studentId, capList) => {
  const values = capList.map((c) => [
    uuidv4(),
    studentId,
    c.college_id,
    c.branch,
    c.cutoff_percentile,
    c.admission_probability || null,
    c.classification,
    c.ranking_score,
    c.cap_order,
  ]);

  // Bulk insert
  for (const v of values) {
    await query(
      `INSERT INTO predictions
         (id, student_id, college_id, branch, predicted_cutoff,
          admission_probability, classification, ranking_score, cap_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT DO NOTHING`,
      v
    );
  }
};

// ── Helper: log prediction audit ─────────────────────────────
const logPrediction = async (studentId, input, output, startTime) => {
  await query(
    `INSERT INTO prediction_logs
       (id, student_id, input_data, output_data, model_version, processing_time_ms)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [
      uuidv4(),
      studentId,
      JSON.stringify(input),
      JSON.stringify({ total: output.length }),
      '1.0.0',
      Date.now() - startTime,
    ]
  );
};

// ── POST /api/predict/full ────────────────────────────────────
/**
 * Full prediction pipeline:
 * 1. Load student profile
 * 2. Predict cutoffs via AI engine
 * 3. Filter colleges
 * 4. Classify (Dream/Target/Safe)
 * 5. Rank
 * 6. Get admission probabilities
 * 7. Generate CAP order
 * 8. Save to DB
 */
const fullPrediction = async (req, res, next) => {
  const startTime = Date.now();
  try {
    // 1. Load student profile
    const studentResult = await query(
      'SELECT * FROM students WHERE user_id = $1',
      [req.user.id]
    );
    if (studentResult.rows.length === 0) {
      throw new AppError('Student profile not found. Please create your profile first.', 404);
    }
    const student = studentResult.rows[0];

    const {
      percentile,
      exam_type,
      category,
      branch_preferences,
      location_preferences,
      college_type,
      budget_max,
    } = student;

    // 2. Filter colleges from DB
    logger.info(`Running full prediction for student: ${student.id}`);
    const filtered = await filterColleges({
      percentile,
      exam_type,
      category,
      branch_preferences,
      location_preferences,
      college_type,
      budget_max,
      percentile_buffer: 15,
    });

    if (filtered.length === 0) {
      throw new AppError(
        'No colleges found matching your profile. Try broadening your filters.',
        404
      );
    }

    // 3. Classify (Dream / Target / Safe)
    const classified = classifyColleges(filtered, percentile);
    const groups     = groupByClassification(classified);
    const warnings   = validateBalance(groups);

    // 4. Rank within each bucket
    const ranked = rankColleges(classified, branch_preferences);

    // 5. Batch admission probabilities (calls AI engine)
    const withProbabilities = await batchProbabilities(ranked, {
      percentile,
      category,
      exam_type,
    });

    // 6. Generate CAP order
    const groupsWithProb = groupByClassification(withProbabilities);
    const capList        = generateCAPOrder(groupsWithProb);
    const validation     = validateCAPList(capList);

    // 7. Save results to DB
    await savePredictions(student.id, capList);
    await logPrediction(student.id, { percentile, exam_type, category }, capList, startTime);

    // 8. Top picks per bucket for dashboard summary
    const rankedGroups = groupByClassification(withProbabilities);
    const topPicks     = topPerBucket(withProbabilities, 5);

    logger.info(`Prediction complete in ${Date.now() - startTime}ms — ${capList.length} colleges`);

    res.status(200).json({
      success: true,
      data: {
        student: {
          percentile,
          exam_type,
          category,
        },
        summary: {
          total_colleges:  capList.length,
          dream_count:     validation.summary.dreamCount,
          target_count:    validation.summary.targetCount,
          safe_count:      validation.summary.safeCount,
          processing_time: `${Date.now() - startTime}ms`,
        },
        top_picks:  topPicks,
        cap_list:   capList,
        warnings:   [...warnings, ...validation.warnings],
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/predict/cutoff ──────────────────────────────────
/**
 * Predict next year's cutoff for a specific college + branch.
 */
const predictCutoff = async (req, res, next) => {
  try {
    const { college_id, branch, category, exam_type } = req.body;

    // Get historical cutoffs
    const history = await query(
      `SELECT year, cutoff_percentile FROM cutoffs
       WHERE college_id = $1 AND branch = $2 AND category = $3 AND exam_type = $4
       ORDER BY year ASC`,
      [college_id, branch, category, exam_type]
    );

    if (history.rows.length === 0) {
      throw new AppError('No historical cutoff data found for this combination.', 404);
    }

    // Call AI engine for ML-based prediction
    let predicted_cutoff;
    try {
      const response = await axios.post(
        `${AI_ENGINE_URL}/cutoff/predict`,
        { college_id, branch, category, exam_type, history: history.rows },
        { timeout: 8000 }
      );
      predicted_cutoff = response.data.predicted_cutoff;
    } catch {
      // Fallback: simple linear trend
      const rows   = history.rows;
      const n      = rows.length;
      const latest = parseFloat(rows[n - 1].cutoff_percentile);
      const prev   = n > 1 ? parseFloat(rows[n - 2].cutoff_percentile) : latest;
      const trend  = latest - prev;
      predicted_cutoff = parseFloat((latest + trend * 0.6).toFixed(2));
      logger.warn('AI cutoff engine unavailable — using linear trend fallback');
    }

    res.status(200).json({
      success: true,
      data: {
        college_id,
        branch,
        category,
        exam_type,
        historical: history.rows,
        predicted_cutoff,
        predicted_year: new Date().getFullYear() + 1,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/predict/admission ───────────────────────────────
/**
 * Predict admission probability for a single college.
 */
const predictAdmission = async (req, res, next) => {
  try {
    const { percentile, cutoff_percentile, category, exam_type } = req.body;

    let probability;
    try {
      const response = await axios.post(
        `${AI_ENGINE_URL}/admission/predict`,
        { percentile, cutoff_percentile, category, exam_type },
        { timeout: 5000 }
      );
      probability = response.data.probability;
    } catch {
      // Sigmoid fallback
      const gap = parseFloat(percentile) - parseFloat(cutoff_percentile);
      const raw = 1 / (1 + Math.exp(-0.8 * gap));
      probability = Math.min(95, Math.max(5, Math.round((raw * 90 + 5) * 10) / 10));
    }

    const gap            = parseFloat(percentile) - parseFloat(cutoff_percentile);
    const classification =
      gap < 0 ? 'Dream' : gap <= 3 ? 'Target' : 'Safe';

    res.status(200).json({
      success: true,
      data: {
        percentile,
        cutoff_percentile,
        gap: parseFloat(gap.toFixed(2)),
        probability,
        classification,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/predict/history ──────────────────────────────────
/**
 * Get a student's past prediction results.
 */
const getPredictionHistory = async (req, res, next) => {
  try {
    const studentResult = await query(
      'SELECT id FROM students WHERE user_id = $1',
      [req.user.id]
    );
    if (studentResult.rows.length === 0) {
      throw new AppError('Student profile not found', 404);
    }

    const history = await query(
      `SELECT p.*, c.name AS college_name, c.code AS college_code, c.district
       FROM predictions p
       JOIN colleges c ON c.id = p.college_id
       WHERE p.student_id = $1
       ORDER BY p.cap_order ASC, p.predicted_at DESC`,
      [studentResult.rows[0].id]
    );

    res.status(200).json({
      success: true,
      data: { predictions: history.rows },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { fullPrediction, predictCutoff, predictAdmission, getPredictionHistory };
