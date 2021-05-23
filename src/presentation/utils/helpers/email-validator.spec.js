/* eslint-disable class-methods-use-this */
/* eslint-disable jest/prefer-expect-assertions */
const validator = require('validator');
const MissingParamError = require('../errors/missing-param-error');
const EmailValidator = require('./email-validator');

const makeSut = () => new EmailValidator();

describe('email Validator', () => {
  test('should return true if validator returns true', () => {
    const sut = makeSut();
    const isEmailValid = sut.isValid('valid@jest.com');
    expect(isEmailValid).toBe(true);
  });

  test('should return false if validator returns false', () => {
    validator.isEmailValid = false;
    const sut = makeSut();
    const isEmailValid = sut.isValid('invalid@jest.com');
    expect(isEmailValid).toBe(false);
  });

  test('should call validator with correct email', () => {
    const sut = makeSut();
    sut.isValid('test@jest.com');
    expect(validator.email).toStrictEqual('test@jest.com');
  });

  test('should throw if no email is provided', async () => {
    expect.hasAssertions();
    const sut = makeSut();
    expect(() => {
      sut.isValid();
    }).toThrow(new MissingParamError('email'));
  });
});
