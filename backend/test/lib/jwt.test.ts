import { signJwt, verifyJwt } from '@/lib/jwt';
import { CONSTANTS } from '@/constants/common';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('JWT Utility', () => {
  const mockUserId = 'user-123';
  const mockToken = 'mock-jwt-token-123';
  const mockSecret = process.env.JWT_SECRET || 'test-jwt-secret';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signJwt', () => {
    it('should sign a token with userId payload', () => {
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const token = signJwt(mockUserId);

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUserId },
        mockSecret,
        expect.objectContaining({
          algorithm: CONSTANTS.JWT_ALGORITHM,
          expiresIn: CONSTANTS.HOUR_IN_MILIS,
          audience: CONSTANTS.JWT_AUDIENCE,
          issuer: CONSTANTS.JWT_ISSUER,
        })
      );
      expect(token).toBe(mockToken);
    });

    it('should use correct signing options', () => {
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      signJwt(mockUserId);

      const callArgs = (jwt.sign as jest.Mock).mock.calls[0];
      const options = callArgs[2];

      expect(options.algorithm).toBe(CONSTANTS.JWT_ALGORITHM);
      expect(options.expiresIn).toBe(CONSTANTS.HOUR_IN_MILIS);
      expect(options.audience).toBe(CONSTANTS.JWT_AUDIENCE);
      expect(options.issuer).toBe(CONSTANTS.JWT_ISSUER);
    });

    it('should handle different user IDs', () => {
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const userId1 = 'user-111';
      const userId2 = 'user-222';

      signJwt(userId1);
      signJwt(userId2);

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: userId1 },
        expect.any(String),
        expect.any(Object)
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: userId2 },
        expect.any(String),
        expect.any(Object)
      );
    });

    it('should return a string token', () => {
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const token = signJwt(mockUserId);

      expect(typeof token).toBe('string');
    });
  });

  describe('verifyJwt', () => {
    it('should verify a valid token', () => {
      const decodedToken = { userId: mockUserId };
      (jwt.verify as jest.Mock).mockReturnValue(decodedToken);

      const result = verifyJwt(mockToken);

      expect(jwt.verify).toHaveBeenCalledWith(
        mockToken,
        mockSecret,
        expect.objectContaining({
          algorithms: [CONSTANTS.JWT_ALGORITHM],
          audience: CONSTANTS.JWT_AUDIENCE,
          issuer: CONSTANTS.JWT_ISSUER,
        })
      );
      expect(result).toEqual(decodedToken);
    });

    it('should use correct verification options', () => {
      const decodedToken = { userId: mockUserId };
      (jwt.verify as jest.Mock).mockReturnValue(decodedToken);

      verifyJwt(mockToken);

      const callArgs = (jwt.verify as jest.Mock).mock.calls[0];
      const options = callArgs[2];

      expect(options.algorithms).toContain(CONSTANTS.JWT_ALGORITHM);
      expect(options.audience).toBe(CONSTANTS.JWT_AUDIENCE);
      expect(options.issuer).toBe(CONSTANTS.JWT_ISSUER);
    });

    it('should return userId from decoded token', () => {
      const decodedToken = { userId: 'specific-user-id' };
      (jwt.verify as jest.Mock).mockReturnValue(decodedToken);

      const result = verifyJwt(mockToken);

      expect(result.userId).toBe('specific-user-id');
    });

    it('should throw error on invalid token', () => {
      const error = new Error('Invalid token');
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw error;
      });

      expect(() => verifyJwt(mockToken)).toThrow('Invalid token');
    });

    it('should throw error on expired token', () => {
      const error = new jwt.TokenExpiredError('Token expired', new Date());
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw error;
      });

      expect(() => verifyJwt(mockToken)).toThrow();
    });

    it('should throw error on malformed token', () => {
      const error = new jwt.JsonWebTokenError('Malformed token');
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw error;
      });

      expect(() => verifyJwt(mockToken)).toThrow();
    });

    it('should throw error when audience does not match', () => {
      const error = new jwt.JsonWebTokenError('Invalid audience');
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw error;
      });

      expect(() => verifyJwt(mockToken)).toThrow();
    });

    it('should throw error when issuer does not match', () => {
      const error = new jwt.JsonWebTokenError('Invalid issuer');
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw error;
      });

      expect(() => verifyJwt(mockToken)).toThrow();
    });
  });

  describe('Token flow integration', () => {
    it('should sign and verify a token successfully', () => {
      const tokenPayload = { userId: mockUserId };
      
      // First sign
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);
      const token = signJwt(mockUserId);
      
      expect(token).toBe(mockToken);

      // Then verify
      (jwt.verify as jest.Mock).mockReturnValue(tokenPayload);
      const verified = verifyJwt(token);

      expect(verified.userId).toBe(mockUserId);
    });

    it('should handle multiple token signings with same user', () => {
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const token1 = signJwt(mockUserId);
      const token2 = signJwt(mockUserId);

      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(token1).toBe(mockToken);
      expect(token2).toBe(mockToken);
    });
  });
});
