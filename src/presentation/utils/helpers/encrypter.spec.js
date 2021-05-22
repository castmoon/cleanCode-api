const bcrypt = require('bcrypt');

class Encrypter {
  async compare(password, hashedPassword) {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
  }
}

describe('encrypter', () => {
  test('should return true if bcrypt returns true', async () => {
    expect.hasAssertions();
    const sut = new Encrypter();
    const isValid = await sut.compare('password', 'hashedPassword');
    expect(isValid).toBe(true);
  });

  test('should return false if bcrypt returns false', async () => {
    expect.hasAssertions();
    const sut = new Encrypter();
    bcrypt.isValid = false;
    const isValid = await sut.compare('invalid_password', 'hashedPassword');
    expect(isValid).toBe(false);
  });
});
