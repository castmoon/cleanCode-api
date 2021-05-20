/* eslint-disable no-shadow */
/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
// eslint-disable-next-line jest/consistent-test-it
// sut = system under testing
const LoginRouter = require('./login-router');
const MissingParamError = require('../helpers/missing-param-error');
const UnauthorizedError = require('../helpers/unauthorized-error');
const ServerError = require('../helpers/server-error');
const InvalidParamError = require('../helpers/invalid-param-error');

const makeEmailValidator = () => {
  class EmailValidatorSpy {
    isValid(email) {
      this.email = email;
      return this.isEmailValid;
    }
  }
  const emailValidatorSpy = new EmailValidatorSpy();
  emailValidatorSpy.isEmailValid = true;
  return emailValidatorSpy;
};

const makeEmailValidatorWithError = () => {
  class EmailValidatorSpy {
    isValid() {
      throw new Error();
    }
  }
  return new EmailValidatorSpy();
};

const makeAuthUseCase = () => {
  class AuthUseCaseSpy {
    async auth(email, password) {
      this.email = email;
      this.password = password;
      return this.accessToken;
    }
  }
  return new AuthUseCaseSpy();
};

const makeAuthUseCaseWithError = () => {
  class AuthUseCaseSpyWithError {
    async auth() {
      throw new Error();
    }
  }
  return new AuthUseCaseSpyWithError();
};

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase();
  const emailValidatorSpy = makeEmailValidator();
  authUseCaseSpy.accessToken = 'valid_token';
  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy);

  return {
    sut,
    authUseCaseSpy,
    emailValidatorSpy,
  };
};

describe('login Router', () => {
  test('should return 400 if no email is provided', async () => {
    expect.hasAssertions();
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'test_password',
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toStrictEqual(new MissingParamError('email'));
  });

  test('should return 400 if no password is provided', async () => {
    expect.hasAssertions();
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'test@jest.com',
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toStrictEqual(new MissingParamError('password'));
  });

  test('should return 500 if no httpRequest is provided', async () => {
    expect.hasAssertions();
    const { sut } = makeSut();
    const httpResponse = await sut.route();
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toStrictEqual(new ServerError());
  });

  test('should return 500 if httpRequest has no body', async () => {
    expect.hasAssertions();
    const { sut } = makeSut();
    const httpResponse = await sut.route({});
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toStrictEqual(new ServerError());
  });

  test('should call AuthUseCase with correct params', async () => {
    expect.hasAssertions();
    const { sut, authUseCaseSpy } = makeSut();
    const httpRequest = {
      body: {
        email: 'test@jest.com',
        password: 'test_password',
      },
    };
    await sut.route(httpRequest);
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
  });

  test('should return 401 when invalid credentials are provided', async () => {
    expect.hasAssertions();
    const { sut, authUseCaseSpy } = makeSut();
    authUseCaseSpy.accessToken = null;
    const httpRequest = {
      body: {
        email: 'invalid@jest.com',
        password: 'invalid_password',
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toStrictEqual(new UnauthorizedError());
  });

  test('should return 200 when valid credentials are provided', async () => {
    expect.hasAssertions();

    const { sut, authUseCaseSpy } = makeSut();
    const httpRequest = {
      body: {
        email: 'valid@jest.com',
        password: 'valid_password',
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body.accessToken).toStrictEqual(
      authUseCaseSpy.accessToken,
    );
  });

  test('should return 500 if no AuthUseCase is provided', async () => {
    expect.hasAssertions();
    const sut = new LoginRouter();
    const httpRequest = {
      body: {
        email: 'test@jest.com',
        password: 'test_password',
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toStrictEqual(new ServerError());
  });

  test('should return 500 if AuthUseCase has no auth method', async () => {
    expect.hasAssertions();

    const sut = new LoginRouter({});
    const httpRequest = {
      body: {
        email: 'test@jest.com',
        password: 'test_password',
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toStrictEqual(new ServerError());
  });

  test('should return 500 if AuthUseCase throws', async () => {
    expect.hasAssertions();
    const authUseCaseSpyWithError = makeAuthUseCaseWithError();
    const sut = new LoginRouter(authUseCaseSpyWithError);
    const httpRequest = {
      body: {
        email: 'test@jest.com',
        password: 'test_password',
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  });

  test('should return 400 if an invalid email is provided', async () => {
    expect.hasAssertions();
    const { sut, emailValidatorSpy } = makeSut();
    emailValidatorSpy.isEmailValid = false;
    const httpRequest = {
      body: {
        email: 'invalid@jest.com',
        password: 'test_password',
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toStrictEqual(new InvalidParamError('email'));
  });

  test('should return 500 if no EmailValidator is provided', async () => {
    expect.hasAssertions();
    const authUseCaseSpy = makeAuthUseCase();
    const sut = new LoginRouter(authUseCaseSpy);
    const httpRequest = {
      body: {
        email: 'test@jest.com',
        password: 'test_password',
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toStrictEqual(new ServerError());
  });

  test('should return 500 if EmailValidator has no isValid method', async () => {
    expect.hasAssertions();
    const authUseCaseSpy = makeAuthUseCase();
    const sut = new LoginRouter(authUseCaseSpy, {});
    const httpRequest = {
      body: {
        email: 'test@jest.com',
        password: 'test_password',
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toStrictEqual(new ServerError());
  });

  test('should return 500 if EmailValidator throws', async () => {
    expect.hasAssertions();
    const authUseCase = makeAuthUseCase();
    const emailValidatorWithError = makeEmailValidatorWithError();
    const sut = new LoginRouter(authUseCase, emailValidatorWithError);
    const httpRequest = {
      body: {
        email: 'test@jest.com',
        password: 'test_password',
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toStrictEqual(new ServerError());
  });

  test('should call EmailValidator with correct params', async () => {
    expect.hasAssertions();
    const { sut, emailValidatorSpy } = makeSut();
    const httpRequest = {
      body: {
        email: 'test@jest.com',
        password: 'test_password',
      },
    };
    await sut.route(httpRequest);
    expect(emailValidatorSpy.email).toBe(httpRequest.body.email);
  });
});
