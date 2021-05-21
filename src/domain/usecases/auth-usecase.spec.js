/* eslint-disable class-methods-use-this */
class AuthUseCase {
  async auth(email) {
    if (!email) {
      throw new Error();
    }
  }
}

describe('auth usecase', () => {
  test('should throw if no email is provided', async () => {
    expect.hasAssertions();
    const sut = new AuthUseCase();
    const promise = sut.auth();
    expect(promise).rejects.toThrow();
  });
});
