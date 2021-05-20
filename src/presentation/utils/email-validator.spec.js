/* eslint-disable class-methods-use-this */
/* eslint-disable jest/prefer-expect-assertions */
const validator = require('validator');

class EmailValidator {
  isValid(email) {
    return validator.isEmail(email);
  }
}

describe('email Validator', () => {
  test('should return true if validator returns true', () => {
    const sut = new EmailValidator();
    const isEmailValid = sut.isValid('valid@jest.com');
    expect(isEmailValid).toBe(true);
  });

  test('should return false if validator returns false', () => {
    validator.isEmailValid = false;
    const sut = new EmailValidator();
    const isEmailValid = sut.isValid('invalid@jest.com');
    expect(isEmailValid).toBe(false);
  });
});
