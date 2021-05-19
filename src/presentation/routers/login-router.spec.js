/* eslint-disable class-methods-use-this */
// eslint-disable-next-line jest/consistent-test-it
// sut = system under testing

class LoginRouter {
  route(httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return {
        statusCode: 500,
      };
    }
    const { email, password } = httpRequest.body;
    if (!email || !password) {
      return {
        statusCode: 400,
      };
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
