import { signupController, loginController, logoutController } from '@/controllers/auth.controllers';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import { CONSTANTS } from '@/constants/common';
import { HttpStatus } from '@/constants/httpStatus';
import { responseError, responseSuccess } from '@/lib/apiResponses';
import { signJwt } from '@/lib/jwt';
import { hashPassword, verifyPassword } from '@/lib/passwordHash';
import { UserModel } from '@/models/user.model';
import { Request, Response } from 'express';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

jest.mock('@/lib/jwt');
jest.mock('@/lib/passwordHash');
jest.mock('@/models/user.model');
jest.mock('@/lib/apiResponses');

describe('Auth Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response> & { locals?: any; cookie?: jest.Mock; clearCookie?: jest.Mock };
  let mockUserModel: DeepMockProxy<any>;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {},
    };

    res = {
      locals: {},
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    };

    mockUserModel = mockDeep<typeof UserModel>();
  });

  describe('signupController', () => {
    it('should create a new user and set a cookie', async () => {
      const mockUserId = 'user-123';
      const mockToken = 'mock-jwt-token';
      const username = 'testuser';
      const password = 'password123';
      const hashedPassword = 'hashed_password';

      req.body = { username, password };

      (UserModel.findOne as jest.Mock).mockResolvedValue(null);
      (hashPassword as jest.Mock).mockResolvedValue(hashedPassword);
      (UserModel.create as jest.Mock).mockResolvedValue({
        id: mockUserId,
        username,
        password: hashedPassword,
      });
      (signJwt as jest.Mock).mockReturnValue(mockToken);

      await signupController(req as Request, res as Response);

      expect(UserModel.findOne).toHaveBeenCalledWith({ username });
      expect(hashPassword).toHaveBeenCalledWith(password);
      expect(UserModel.create).toHaveBeenCalledWith({
        username,
        password: hashedPassword,
      });
      expect(signJwt).toHaveBeenCalledWith(mockUserId);
      expect(res.cookie).toHaveBeenCalledWith(
        CONSTANTS.COOKIE_SESSION_NAME,
        mockToken,
        expect.objectContaining({
          httpOnly: true,
          expires: expect.any(Date),
        })
      );
      expect(responseSuccess).toHaveBeenCalledWith(res, {
        message: CONSTANTS.SIGNUP_SUCCESS_MESSAGE,
      });
    });

    it('should return error if user already exists', async () => {
      const username = 'existinguser';
      const password = 'password123';

      req.body = { username, password };

      (UserModel.findOne as jest.Mock).mockResolvedValue({
        id: 'user-456',
        username,
        password: 'hashed_password',
      });

      await signupController(req as Request, res as Response);

      expect(responseError).toHaveBeenCalledWith(res, {
        statusCode: HttpStatus.BAD_REQUEST,
        error: ERROR_MESSAGES.USER_TAKEN,
      });
      expect(UserModel.create).not.toHaveBeenCalled();
    });
  });

  describe('loginController', () => {
    it('should login user successfully with correct credentials', async () => {
      const mockUserId = 'user-123';
      const mockToken = 'mock-jwt-token';
      const username = 'testuser';
      const password = 'password123';
      const hashedPassword = 'hashed_password';

      req.body = { username, password };

      (UserModel.findOne as jest.Mock).mockResolvedValue({
        id: mockUserId,
        username,
        password: hashedPassword,
      });
      (verifyPassword as jest.Mock).mockResolvedValue(true);
      (signJwt as jest.Mock).mockReturnValue(mockToken);

      await loginController(req as Request, res as Response);

      expect(UserModel.findOne).toHaveBeenCalledWith({ username });
      expect(verifyPassword).toHaveBeenCalledWith(password, hashedPassword);
      expect(signJwt).toHaveBeenCalledWith(mockUserId);
      expect(res.cookie).toHaveBeenCalledWith(
        CONSTANTS.COOKIE_SESSION_NAME,
        mockToken,
        expect.objectContaining({
          httpOnly: true,
          expires: expect.any(Date),
        })
      );
      expect(responseSuccess).toHaveBeenCalledWith(res, {
        message: CONSTANTS.LOGIN_SUCCESS_MESSAGE,
      });
    });

    it('should return error if user not found', async () => {
      const username = 'nonexistentuser';
      const password = 'password123';

      req.body = { username, password };

      (UserModel.findOne as jest.Mock).mockResolvedValue(null);

      await loginController(req as Request, res as Response);

      expect(responseError).toHaveBeenCalledWith(res, {
        statusCode: HttpStatus.BAD_REQUEST,
        error: ERROR_MESSAGES.INVALID_CREDENTIALS,
      });
      expect(signJwt).not.toHaveBeenCalled();
    });

    it('should return error if password is invalid', async () => {
      const username = 'testuser';
      const password = 'wrongpassword';
      const hashedPassword = 'hashed_password';

      req.body = { username, password };

      (UserModel.findOne as jest.Mock).mockResolvedValue({
        id: 'user-123',
        username,
        password: hashedPassword,
      });
      (verifyPassword as jest.Mock).mockResolvedValue(false);

      await loginController(req as Request, res as Response);

      expect(verifyPassword).toHaveBeenCalledWith(password, hashedPassword);
      expect(responseError).toHaveBeenCalledWith(res, {
        statusCode: HttpStatus.BAD_REQUEST,
        error: ERROR_MESSAGES.INVALID_CREDENTIALS,
      });
      expect(signJwt).not.toHaveBeenCalled();
    });
  });

  describe('logoutController', () => {
    it('should clear cookie and return success message', async () => {
      await logoutController(req as Request, res as Response);

      expect(res.clearCookie).toHaveBeenCalledWith(CONSTANTS.COOKIE_SESSION_NAME);
      expect(responseSuccess).toHaveBeenCalledWith(res, {
        message: CONSTANTS.LOGOUT_SUCCESS_MESSAGE,
      });
    });
  });
});
