class Encrypter {
  async compare(password, hashedPassword) {
    return true;
  }
}

describe('encrypter', () => {
  test('should return true if bcrypt returns true', async () => {
    expect.hasAssertions();
    const sut = new Encrypter();
    const isValid = await sut.compare('password', 'hashedPassword');
    expect(isValid).toBe(true);
  });
});
