/* eslint-disable no-shadow */
/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
// eslint-disable-next-line jest/consistent-test-it
// sut = system under testing
const LoginRouter = require('./login-router');
const MissingParamError = require('../helpers/missing-param-error');
const httpResponse = require('../helpers/http-response');
const UnauthorizedError = require('../helpers/unauthorized-error');

const makeSut = () => {
  class AuthUseCaseSpy {
    auth(email, password) {
      this.email = email;
      this.password = password;
    }
  }
  const authUseCaseSpy = new AuthUseCaseSpy();
  const sut = new LoginRouter(authUseCaseSpy);

  return {
    sut,
    authUseCaseSpy,
  };
};

describe('login Router', () => {
  test('should return 400 if no email is provided', () => {
    expect.hasAssertions();
    const { sut } = makeSut();
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
    const { sut } = makeSut();
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
    const { sut } = makeSut();
    const httpResponse = sut.route();
    expect(httpResponse.statusCode).toBe(500);
  });

  test('should return 500 if httpRequest has no body', () => {
    expect.hasAssertions();
    const { sut } = makeSut();
    const httpResponse = sut.route({});
    expect(httpResponse.statusCode).toBe(500);
  });

  test('should call AuthUseCase with correct params', () => {
    expect.hasAssertions();
    const { sut, authUseCaseSpy } = makeSut();
    const httpRequest = {
      body: {
        email: 'test@jest.com',
        password: 'test_password',
      },
    };
    sut.route(httpRequest);
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
  });

  test('should return 401 when invalid credentials are provided', () => {
    expect.hasAssertions();
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'invalid@jest.com',
        password: 'invalid_password',
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toStrictEqual(new UnauthorizedError());
  });

  test('should return 500 if no AuthUseCase is provided', () => {
    expect.hasAssertions();
    const sut = new LoginRouter();
    const httpRequest = {
      body: {
        email: 'test@jest.com',
        password: 'test_password',
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  });

  test('should return 500 if AuthUseCase has no auth method', () => {
    expect.hasAssertions();

    const sut = new LoginRouter({});
    const httpRequest = {
      body: {
        email: 'test@jest.com',
        password: 'test_password',
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  });
});
