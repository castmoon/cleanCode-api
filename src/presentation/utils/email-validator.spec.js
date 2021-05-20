class EmailValidator {
  isValid(email) {
    return true;
  }
}

describe('email Validator', () => {
  test('should return true if validator returns true', () => {
    const sut = new EmailValidator();
    const isEmailValid = sut.isValid('valid@jest.com');
    expect(isEmailValid).toBe(true);
  });
});
