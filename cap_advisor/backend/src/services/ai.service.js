const { anthropicClient } = require('../config/anthropic');

const SYSTEM_PROMPT = `You are an expert Maharashtra CAP admission counselor.
Provide actionable guidance for students based on CET percentile, category, branch choices, and college list.
Focus on practical CAP strategy and risk-aware preference ordering.`;

async function getStrategy(studentData, capList) {
  const prompt = `${SYSTEM_PROMPT}\nStudent profile: ${JSON.stringify(studentData)}\nTop CAP list:\n${capList.slice(0, 10).map((item, index) => `${index + 1}. ${item.collegeName} - ${item.branch} (${item.classification}, ${item.probability}%)`).join('\n')}\n\nProvide:\n1. Profile Assessment\n2. CAP Strategy\n3. Branch vs College Trade-off advice.`;

  const response = await anthropicClient.responses.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens_to_generate: 800,
    temperature: 0.7,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt }
    ]
  });
  return response.output_text?.trim() || 'Unable to generate strategy at this time.';
}

async function getCollegeInsight(studentData, collegeItem) {
  const prompt = `${SYSTEM_PROMPT}\nStudent profile: ${JSON.stringify(studentData)}\nCollege item: ${JSON.stringify(collegeItem)}\n\nProvide a concise two-sentence insight tailored to this student and college combination.`;
  const response = await anthropicClient.responses.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens_to_generate: 150,
    temperature: 0.7,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt }
    ]
  });
  return response.output_text?.trim() || 'No insight available.';
}

async function chatResponse(messages, studentContext) {
  const contextText = studentContext ? `Student details: ${JSON.stringify(studentContext)}\n` : '';
  const promptMessages = [
    { role: 'system', content: `${SYSTEM_PROMPT} ${contextText}` },
    ...messages.map((message) => ({ role: message.role, content: message.content }))
  ];

  const response = await anthropicClient.responses.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens_to_generate: 300,
    temperature: 0.7,
    messages: promptMessages
  });
  return response.output_text?.trim() || 'Sorry, I could not generate a response right now.';
}

module.exports = { getStrategy, getCollegeInsight, chatResponse };
