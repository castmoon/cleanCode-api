/* eslint-disable class-methods-use-this */
const httpResponse = require('../helpers/http-response');
const MissingParamError = require('../helpers/missing-param-error');

module.exports = class LoginRouter {
  constructor(authUseCase) {
    this.authUseCase = authUseCase;
  }

  async route(httpRequest) {
    try {
      const { email, password } = httpRequest.body;
      if (!email) {
        return httpResponse.badRequest(new MissingParamError('email'));
      }
      if (!password) {
        return httpResponse.badRequest(new MissingParamError('password'));
      }
      const accessToken = await this.authUseCase.auth(email, password);
      if (!accessToken) {
        return httpResponse.unauthorizedError();
      }
      return httpResponse.ok({ accessToken });
    } catch (error) {
      return httpResponse.serverError();
    }
  }
};
