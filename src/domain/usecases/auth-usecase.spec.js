/* eslint-disable class-methods-use-this */
const { MissingParamError } = require('../../presentation/utils/errors');

class AuthUseCase {
  async auth(email) {
    if (!email) {
      throw new MissingParamError('email');
    }
  }
}

describe('auth usecase', () => {
  test('should throw if no email is provided', async () => {
    expect.hasAssertions();
    const sut = new AuthUseCase();
    const promise = sut.auth();
    expect(promise).rejects.toThrow(new MissingParamError('email'));
  });
});
