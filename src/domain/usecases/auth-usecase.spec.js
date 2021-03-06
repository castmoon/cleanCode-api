/* eslint-disable jest/require-to-throw-message */
/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
/* eslint-disable jest/valid-expect */
/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
const {
  MissingParamError,
  InvalidParamError,
} = require('../../presentation/utils/errors');

const AuthUseCase = require('./auth-usecase');

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare(password, hashedPassword) {
      this.password = password;
      this.hashedPassword = hashedPassword;
      return this.isValid;
    }
  }
  const encrypterSpy = new EncrypterSpy();
  encrypterSpy.isValid = true;
  return encrypterSpy;
};

const makeTokenGenerator = () => {
  class TokenGeneratorSpy {
    async generate(userId) {
      this.userId = userId;
      return this.accessToken;
    }
  }

  const tokenGeneratorSpy = new TokenGeneratorSpy();
  tokenGeneratorSpy.accessToken = 'test_token';
  return tokenGeneratorSpy;
};

const makeLoadUserByEmailRepository = () => {
  class LoadUserByEmailRepositorySpy {
    async load(email) {
      this.email = email;
      return this.user;
    }
  }

  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
  loadUserByEmailRepositorySpy.user = {
    id: 'test_id',
    password: 'hashed_password',
  };
  return loadUserByEmailRepositorySpy;
};

const makeLoadUserByEmailRepositoryWithError = () => {
  class LoadUserByEmailRepositorySpy {
    async load() {
      throw new Error();
    }
  }
  return new LoadUserByEmailRepositorySpy();
};

const makeEncrypterWithError = () => {
  class EncrypterSpy {
    async compare() {
      throw new Error();
    }
  }
  return new EncrypterSpy();
};

const makeTokenGeneratorWithError = () => {
  class TokenGeneratorSpy {
    async generate() {
      throw new Error();
    }
  }
};

const makeupdateAccessTokenRepository = () => {
  class updateAccessTokenRepositorySpy {
    async update(userId, accessToken) {
      this.userId = userId;
      this.accessToken = accessToken;
    }
  }

  const updateAcessTokenRepositorySpy = new updateAccessTokenRepositorySpy();

  return updateAcessTokenRepositorySpy;
};

const makeUpdateAccessTokenRepositoryWithError = () => {
  class updateAccessTokenRepositorySpy {
    async update() {
      throw new Error();
    }
  }
};

const makeSut = () => {
  const encrypterSpy = makeEncrypter();
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository();
  const tokenGeneratorSpy = makeTokenGenerator();
  const updateAccessTokenRepositorySpy = makeupdateAccessTokenRepository();
  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy,
    updateAccessTokenRepository: updateAccessTokenRepositorySpy,
  });
  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy,
    updateAccessTokenRepositorySpy,
  };
};

describe('auth usecase', () => {
  test('should throw if no email is provided', async () => {
    expect.hasAssertions();
    const { sut } = makeSut();
    const promise = sut.auth();
    expect(promise).rejects.toThrow(new MissingParamError('email'));
  });

  test('should throw if no password is provided', async () => {
    expect.hasAssertions();
    const { sut } = makeSut();
    const promise = sut.auth('test@jest.com');
    expect(promise).rejects.toThrow(new MissingParamError('password'));
  });

  test('should call LoadUserByEmailRepository with correct email', async () => {
    expect.hasAssertions();

    const { sut, loadUserByEmailRepositorySpy } = makeSut();
    await sut.auth('test@jest.com', 'test_password');
    expect(loadUserByEmailRepositorySpy.email).toBe('test@jest.com');
  });

  test('should throw if no dependecy is provided', async () => {
    expect.hasAssertions();

    const sut = new AuthUseCase();
    const promise = sut.auth('test@jest.com', 'test_password');
    expect(promise).rejects.toThrow(
      new MissingParamError('loadUserByEmailRepository'),
    );
  });

  test('should throw if no LoadUserByEmailRepository is provided', async () => {
    expect.hasAssertions();

    const sut = new AuthUseCase({});
    const promise = sut.auth('test@jest.com', 'test_password');
    expect(promise).rejects.toThrow(
      new MissingParamError('loadUserByEmailRepository'),
    );
  });

  test('should throw if no LoadUserByEmailRepository has no load method', async () => {
    expect.hasAssertions();

    const sut = new AuthUseCase({ loadUserByEmailRepository: {} });
    const promise = sut.auth('test@jest.com', 'test_password');
    expect(promise).rejects.toThrow(
      new InvalidParamError('loadUserByEmailRepository'),
    );
  });

  test('should return null if an invalid email is provided', async () => {
    expect.hasAssertions();

    const { sut, loadUserByEmailRepositorySpy } = makeSut();
    loadUserByEmailRepositorySpy.user = null;
    const accessToken = await sut.auth('invalid@jest.com', 'test_password');
    expect(accessToken).toBeNull();
  });

  test('should return null if an invalid password is provided', async () => {
    expect.hasAssertions();
    const { sut, encrypterSpy } = makeSut();
    encrypterSpy.isValid = false;
    const accessToken = await sut.auth('test@jest.com', 'invalid_password');
    expect(accessToken).toBeNull();
  });

  test('should call Encrypter with correct values', async () => {
    expect.hasAssertions();

    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut();
    await sut.auth('test@jest.com', 'test_password');
    expect(encrypterSpy.password).toBe('test_password');
    expect(encrypterSpy.hashedPassword).toBe(
      loadUserByEmailRepositorySpy.user.password,
    );
  });

  test('should call TokenGenerator with correct userId', async () => {
    expect.hasAssertions();

    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut();
    await sut.auth('test@jest.com', 'test_password');
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id);
  });
  test('should return an accessToken if correct credentials are provided', async () => {
    expect.hasAssertions();

    const { sut, tokenGeneratorSpy } = makeSut();
    const accessToken = await sut.auth('test@jest.com', 'test_password');
    expect(accessToken).toBe(tokenGeneratorSpy.accessToken);
    expect(accessToken).toBeTruthy();
  });

  test('should throw if any dependecy throw', async () => {
    expect.hasAssertions();
    const loadUserByEmailRepository = makeLoadUserByEmailRepository();
    const encrypter = makeEncrypter();
    const tokenGenerator = makeTokenGenerator();
    const suts = [].concat(
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepositoryWithError(),
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter: makeEncrypterWithError(),
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: makeTokenGeneratorWithError(),
      }),
      new AuthUseCase({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator,
        updateAccessTokenRepository: makeUpdateAccessTokenRepositoryWithError(),
      }),
    );

    for (const sut of suts) {
      const promise = sut.auth('test@jest.com', 'test_password');
      expect(promise).rejects.toThrow();
    }
  });

  test('should call updateAccessTokenRepository with correct values', async () => {
    expect.hasAssertions();

    const {
      sut,
      loadUserByEmailRepositorySpy,
      updateAccessTokenRepositorySpy,
      tokenGeneratorSpy,
    } = makeSut();
    await sut.auth('test@jest.com', 'test_password');
    expect(updateAccessTokenRepositorySpy.userId).toBe(
      loadUserByEmailRepositorySpy.user.id,
    );
    expect(updateAccessTokenRepositorySpy.accessToken).toBe(
      tokenGeneratorSpy.accessToken,
    );
  });
});
