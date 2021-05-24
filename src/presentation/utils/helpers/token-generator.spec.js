const jwt = require('jsonwebtoken');
const MissingParamError = require('../errors/missing-param-error');

class TokenGenerator {
  constructor(secret) {
    this.secret = secret;
  }

  async generate(id) {
    if (!id) {
      throw new MissingParamError('id');
    }
    if (!this.secret) {
      throw new MissingParamError('secret');
    }
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

  test('should throw with no secret is provided', async () => {
    expect.hasAssertions();
    const sut = new TokenGenerator();
    const promise = sut.generate('test_id');
    expect(promise).rejects.toThrow(new MissingParamError('secret'));
  });

  test('should throw with no id is provided', async () => {
    expect.hasAssertions();
    const sut = makeSut();
    const promise = sut.generate();
    expect(promise).rejects.toThrow(new MissingParamError('id'));
  });
});
