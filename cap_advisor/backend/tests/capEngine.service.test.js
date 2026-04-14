const { classify, getProbability, generateCAPList } = require('../src/services/capEngine.service');

describe('capEngine service', () => {
  test('classify returns Dream when diff < -2', () => {
    expect(classify(90, 95)).toBe('Dream');
  });

  test('classify returns Target when diff between -2 and 2', () => {
    expect(classify(97, 95)).toBe('Target');
  });

  test('classify returns Safe when diff > 2', () => {
    expect(classify(99, 95)).toBe('Safe');
  });

  test('getProbability returns expected labels', () => {
    expect(getProbability(90, 99).label).toBe('Moderate');
    expect(getProbability(95, 95).label).toBe('Good');
    expect(getProbability(99, 95).label).toBe('High');
  });

  test('generateCAPList throws when no branches provided', async () => {
    await expect(generateCAPList({ percentile: 95, category: 'Open', branches: [] })).rejects.toThrow('At least one branch must be selected');
  });
});
