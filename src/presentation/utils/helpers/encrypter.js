/* eslint-disable class-methods-use-this */
const bcrypt = require('bcrypt');
const MissingParamError = require('../errors/missing-param-error');

module.exports = class Encrypter {
  async compare(password, hashedPassword) {
    if (!password) {
      throw new MissingParamError('password');
    }
    if (!hashedPassword) {
      throw new MissingParamError('hashedPassword');
    }
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
  }
};
