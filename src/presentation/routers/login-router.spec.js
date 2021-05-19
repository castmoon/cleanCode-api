/* eslint-disable no-shadow */
/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
// eslint-disable-next-line jest/consistent-test-it
// sut = system under testing
const LoginRouter = require('./login-router');
const MissingParamError = require('../helpers/missing-param-error');

const makeSut = () => new LoginRouter();

describe('login Router', () => {
  test('should return 400 if no email is provided', () => {
    expect.hasAssertions();
    const sut = makeSut();
    const httpRequest = {
      body: {
        password: 'test_password',
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toStrictEqual(new MissingParamError('email'));
  });

  test('should return 400 if no password is provided', () => {
    expect.hasAssertions();
    const sut = makeSut();
    const httpRequest = {
      body: {
        email: 'test@jest.com',
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toStrictEqual(new MissingParamError('password'));
  });

  test('should return 500 if no httpRequest is provided', () => {
    expect.hasAssertions();
    const sut = makeSut();
    const httpResponse = sut.route();
    expect(httpResponse.statusCode).toBe(500);
  });

  test('should return 500 if httpRequest has no body', () => {
    expect.hasAssertions();
    const sut = makeSut();
    const httpResponse = sut.route({});
    expect(httpResponse.statusCode).toBe(500);
  });
});
