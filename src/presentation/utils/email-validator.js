/* eslint-disable class-methods-use-this */
const validator = require('validator');

module.exports = class EmailValidator {
  isValid(email) {
    return validator.isEmail(email);
  }
};
