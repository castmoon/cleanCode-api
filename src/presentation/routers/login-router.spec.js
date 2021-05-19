/* eslint-disable class-methods-use-this */
// eslint-disable-next-line jest/consistent-test-it
// sut = system under testing

class LoginRouter {
  route(httpRequest) {
    const { email, password } = httpRequest.body;
    if (!email || !password) {
      return {
        statusCode: 400,
      };
    }
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
});
