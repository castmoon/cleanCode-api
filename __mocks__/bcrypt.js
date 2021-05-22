module.exports = {
  isValid: true,
  password: '',
  hashedPassword: '',

  compare(password, hashedPassword) {
    this.password = password;
    this.hashedPassword = hashedPassword;
    return this.isValid;
  },
};
