/* eslint-disable class-methods-use-this */
const bcrypt = require('bcrypt');

class Encrypter {
  async compare(password, hashedPassword) {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
  }
}

const makeSut = () => new Encrypter();

describe('encrypter', () => {
  test('should return true if bcrypt returns true', async () => {
    expect.hasAssertions();
    const sut = makeSut();
    const isValid = await sut.compare('password', 'hashedPassword');
    expect(isValid).toBe(true);
  });

  test('should return false if bcrypt returns false', async () => {
    expect.hasAssertions();
    const sut = makeSut();
    bcrypt.isValid = false;
    const isValid = await sut.compare('invalid_password', 'hashedPassword');
    expect(isValid).toBe(false);
  });

  test('should call bcrypt with correct values', async () => {
    expect.hasAssertions();
    const sut = makeSut();
    await sut.compare('test_password', 'hashedPassword');
    expect(bcrypt.password).toBe('test_password');
    expect(bcrypt.hashedPassword).toBe('hashedPassword');
  });
});
