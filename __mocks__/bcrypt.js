module.exports = {
  isValid: true,
  compare(password, hashedPassword) {
    return this.isValid;
  },
};
