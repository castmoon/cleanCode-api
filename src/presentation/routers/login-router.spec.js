/* eslint-disable no-shadow */
/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
// eslint-disable-next-line jest/consistent-test-it
// sut = system under testing

class MissingParamError extends Error {
  constructor(paramName) {
    super(`Missing param: ${paramName}`);
    this.name = 'MissingParamError';
  }
}

class httpResponse {
  static badRequest(paramName) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName),
    };
  }

  static serverError() {
    return {
      statusCode: 500,
    };
  }
}

class LoginRouter {
  route(httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return httpResponse.serverError();
    }
    const { email, password } = httpRequest.body;
    if (!email) {
      return httpResponse.badRequest('email');
    }
    if (!password) {
      return httpResponse.badRequest('password');
    }
    return {
      statusCode: 200,
    };
  }
}

describe('login Router', () => {
  test('should return 400 if no email is provided', () => {
    expect.hasAssertions();
    const sut = new LoginRouter();
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
    const sut = new LoginRouter();
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
    const sut = new LoginRouter();
    const httpResponse = sut.route();
    expect(httpResponse.statusCode).toBe(500);
  });

  test('should return 500 if httpRequest has no body', () => {
    expect.hasAssertions();
    const sut = new LoginRouter();
    const httpResponse = sut.route({});
    expect(httpResponse.statusCode).toBe(500);
  });
});
