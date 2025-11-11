import { getUser } from '@/controllers/user.controller';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import { HttpStatus } from '@/constants/httpStatus';
import { responseError, responseSuccess } from '@/lib/apiResponses';
import { UserModel } from '@/models/user.model';
import { Request, Response, NextFunction } from 'express';

jest.mock('@/models/user.model');
jest.mock('@/lib/apiResponses');

describe('User Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response> & { locals?: any };
  let next: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {};

    res = {
      locals: {
        userId: 'user-123',
      },
    };

    next = jest.fn();
  });

  describe('getUser', () => {
    it('should retrieve user successfully', async () => {
      const mockUser = {
        id: 'user-123',
        username: 'testuser',
        password: 'hashed_password',
        toJSON: jest.fn().mockReturnValue({
          id: 'user-123',
          username: 'testuser',
          password: 'hashed_password',
        }),
      };

      (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

      await getUser(req as Request, res as Response, next);

      expect(UserModel.findById).toHaveBeenCalledWith('user-123');
      expect(mockUser.toJSON).toHaveBeenCalled();
      expect(responseSuccess).toHaveBeenCalledWith(res, {
        data: expect.objectContaining({
          id: 'user-123',
          username: 'testuser',
          password: undefined,
        }),
      });
    });

    it('should return error if user not found', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(null);

      await getUser(req as Request, res as Response, next);

      expect(UserModel.findById).toHaveBeenCalledWith('user-123');
      expect(responseError).toHaveBeenCalledWith(res, {
        statusCode: HttpStatus.UNAUTHORIZED,
        error: ERROR_MESSAGES.ACCOUNT_NOT_FOUND,
      });
      expect(responseSuccess).not.toHaveBeenCalled();
    });

    it('should exclude password from response', async () => {
      const mockUser = {
        id: 'user-123',
        username: 'testuser',
        password: 'hashed_password',
        email: 'test@example.com',
        toJSON: jest.fn().mockReturnValue({
          id: 'user-123',
          username: 'testuser',
          password: 'hashed_password',
          email: 'test@example.com',
        }),
      };

      (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

      await getUser(req as Request, res as Response, next);

      expect(responseSuccess).toHaveBeenCalledWith(res, {
        data: expect.objectContaining({
          password: undefined,
        }),
      });
    });
  });
});
