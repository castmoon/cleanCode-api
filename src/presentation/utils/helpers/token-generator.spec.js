const jwt = require('jsonwebtoken');

class TokenGenerator {
  constructor(secret) {
    this.secret = secret;
  }

  async generate(id) {
    return jwt.sign(id, this.secret);
  }
}

const makeSut = () => new TokenGenerator('test_secret');

describe('token Generator', () => {
  test('should return null if JWT returns null', async () => {
    expect.hasAssertions();
    jwt.token = null;
    const sut = makeSut();
    const token = await sut.generate('test_id');
    expect(token).toBeNull();
  });

  test('should return a Token if JWT returns token', async () => {
    expect.hasAssertions();
    const sut = makeSut();
    const token = await sut.generate('test_id');
    expect(token).toBe(jwt.token);
  });

  test('should call JWT with correct values', async () => {
    expect.hasAssertions();
    const sut = makeSut();
    const token = await sut.generate('test_id');
    expect(jwt.id).toBe('test_id');
    expect(jwt.secret).toBe(sut.secret);
  });
});
