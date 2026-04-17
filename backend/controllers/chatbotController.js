// ============================================================
// AI COLLEGE CAP COUNSELING PLATFORM
// File: backend/controllers/chatbotController.js
// ============================================================

const axios  = require('axios');
const logger = require('../utils/logger');

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://127.0.0.1:8000';

// ── POST /api/chatbot/ask ─────────────────────────────────────
const ask = async (req, res, next) => {
  try {
    const { message, history = [], student_context = null } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    let result;
    try {
      const response = await axios.post(
        `${AI_ENGINE_URL}/chatbot/ask`,
        { message: message.trim(), history, student_context },
        { timeout: 10000 }
      );
      result = response.data;
    } catch (aiErr) {
      logger.warn('AI chatbot engine unavailable — using rule-based fallback');
      result = ruleFallback(message.trim(), student_context);
    }

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// ── Rule-based fallback when AI engine is down ────────────────
const ruleFallback = (message, ctx) => {
  const msg = message.toLowerCase();

  let response;
  let intent = 'general';

  if (/cutoff|percentile.*get|can i get|will i get|chance/.test(msg)) {
    intent = 'cutoff_query';
    const p = ctx?.percentile || 'your';
    const c = ctx?.category   || 'OPEN';
    response = `With ${p} percentile under ${c} category, your chances depend on each college's cutoff. Run a full prediction above to see your personalized Dream/Target/Safe list. For live cutoffs, check the DTE Maharashtra portal.`;
  } else if (/cap round|how.*admission|round 1|round 2|round 3|cap process/.test(msg)) {
    intent = 'cap_process';
    response = 'The CAP process has 3 rounds. In each round you can update your preference list. Fill all 30 slots — put Dream colleges first, Safe colleges last. Once allotted a seat, confirm within the deadline or lose it.';
  } else if (/document|certificate|required.*paper|what.*bring/.test(msg)) {
    intent = 'document';
    response = 'Key documents: 10th & 12th marksheets, MHT-CET / JEE scorecard, category certificate (if applicable), domicile certificate, school leaving certificate, passport photos, and Aadhaar card.';
  } else if (/category|reservation|obc|sc|st|ews|tfws/.test(msg)) {
    intent = 'category';
    response = 'Maharashtra CAP has reservations: OBC (19%), SC (13%), ST (7%), EWS (10%), TFWS (5% across all), PWD (3%). Category certificates must be issued by the competent authority. Check the DTE website for the latest reservation details.';
  } else if (/coep|vjti|pict|vit|pccoe|mit|wce|spce/.test(msg)) {
    intent = 'college_info';
    response = 'Top Maharashtra engineering colleges include COEP (Pune), VJTI (Mumbai), ICT (Mumbai), VIT Pune, PICT, PCCOE, and WCE Sangli. Use our full prediction to get your personalized Dream/Target/Safe ranking.';
  } else {
    response = "I'm here to help with Maharashtra engineering admissions! Ask me about cutoffs, the CAP process, college comparisons, or document requirements.";
  }

  const followupMap = {
    cutoff_query: ['What is the CAP round process?', 'Which documents do I need?'],
    cap_process:  ['How do I fill my preference list?', 'What happens in Round 2?'],
    college_info: ['What are the cutoffs for CS branch?', 'Compare COEP vs VIT'],
    document:     ['When do I submit documents?', 'Is category certificate mandatory?'],
    category:     ['What is TFWS quota?', 'How does OBC reservation work?'],
    general:      ['Tell me about CAP rounds', 'What colleges suit my percentile?'],
  };

  return {
    response,
    intent,
    college_mentioned: null,
    suggested_followups: followupMap[intent] || followupMap.general,
  };
};

module.exports = { ask };
