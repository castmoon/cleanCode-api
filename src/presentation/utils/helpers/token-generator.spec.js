class TokenGenerator {
  async generate(id) {
    return null;
  }
}

describe('token Generator', () => {
  test('should return null if JWT returns null', async () => {
    expect.hasAssertions();
    const sut = new TokenGenerator();
    const token = await sut.generate('test_id');
    expect(token).toBeNull();
  });
});
