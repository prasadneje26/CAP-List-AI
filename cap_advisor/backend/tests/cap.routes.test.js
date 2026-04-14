const request = require('supertest');

jest.mock('../src/utils/jwtHelper');
jest.mock('../src/services/capEngine.service');
jest.mock('../src/models/capList.model');

const app = require('../server');
const { verifyAccessToken } = require('../src/utils/jwtHelper');
const capService = require('../src/services/capEngine.service');
const capModel = require('../src/models/capList.model');

describe('POST /api/v1/cap/generate', () => {
  beforeAll(() => {
    verifyAccessToken.mockReturnValue({ sub: 'user-id' });
  });

  test('returns 201 and CAP list when request is valid', async () => {
    capService.generateCAPList.mockResolvedValue([
      { capRank: 1, collegeName: 'Test College', branch: 'Computer Engineering' }
    ]);
    capModel.saveCapList.mockResolvedValue({ id: 'list-id' });

    const response = await request(app)
      .post('/api/v1/cap/generate')
      .set('Authorization', 'Bearer valid-token')
      .send({ percentile: 95, category: 'Open', branches: ['Computer Engineering'], location: 'Pune', collegeType: 'Autonomous' });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.capList).toHaveLength(1);
  });
});
