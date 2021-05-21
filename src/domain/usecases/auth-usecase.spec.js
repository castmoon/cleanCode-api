/* eslint-disable jest/valid-expect */
/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
const {
  MissingParamError,
  InvalidParamError,
} = require('../../presentation/utils/errors');

const AuthUseCase = require('./auth-usecase');

const makeSut = () => {
  class LoadUserByEmailRepositorySpy {
    async load(email) {
      this.email = email;
    }
  }

  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy);

  return {
    sut,
    loadUserByEmailRepositorySpy,
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

  test('should throw if no LoadUserByEmailRepository is provided', async () => {
    expect.hasAssertions();

    const sut = new AuthUseCase();
    const promise = sut.auth('test@jest.com', 'test_password');
    expect(promise).rejects.toThrow(
      new MissingParamError('loadUserByEmailRepository'),
    );
  });

  test('should throw if no LoadUserByEmailRepository has no load method', async () => {
    expect.hasAssertions();

    const sut = new AuthUseCase({});
    const promise = sut.auth('test@jest.com', 'test_password');
    expect(promise).rejects.toThrow(
      new InvalidParamError('loadUserByEmailRepository'),
    );
  });

  test('should return null if LoadUserByEmailRepository returns null', async () => {
    expect.hasAssertions();

    const { sut } = makeSut();
    const accessToken = await sut.auth('invalid@jest.com', 'test_password');
    expect(accessToken).toBeNull();
  });
});
