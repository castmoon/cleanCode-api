const jwt = require('jsonwebtoken');

class TokenGenerator {
  async generate(id) {
    return jwt.sign(id, 'secret');
  }
}

describe('token Generator', () => {
  test('should return null if JWT returns null', async () => {
    expect.hasAssertions();
    jwt.token = null;
    const sut = new TokenGenerator();
    const token = await sut.generate('test_id');
    expect(token).toBeNull();
  });

  test('should return a Token if JWT returns token', async () => {
    expect.hasAssertions();
    const sut = new TokenGenerator();
    const token = await sut.generate('test_id');
    expect(token).toBe(jwt.token);
  });
});
