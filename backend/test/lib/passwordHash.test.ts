import { hashPassword, verifyPassword } from '@/lib/passwordHash';
import bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('Password Hash Utility', () => {
  const mockPassword = 'SecurePassword123!';
  const mockHashedPassword = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36jbMeK2';
  const mockSalt = '$2a$10$N9qo8uLOickgx2ZMRZoMye';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash password with bcrypt', async () => {
      (bcrypt.genSalt as jest.Mock).mockResolvedValue(mockSalt);
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);

      const result = await hashPassword(mockPassword);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, mockSalt);
      expect(result).toBe(mockHashedPassword);
    });

    it('should use correct salt rounds', async () => {
      (bcrypt.genSalt as jest.Mock).mockResolvedValue(mockSalt);
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);

      await hashPassword(mockPassword);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    });

    it('should hash different passwords', async () => {
      (bcrypt.genSalt as jest.Mock).mockResolvedValue(mockSalt);
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);

      const password1 = 'password1';
      const password2 = 'password2';

      await hashPassword(password1);
      await hashPassword(password2);

      expect(bcrypt.hash).toHaveBeenCalledWith(password1, mockSalt);
      expect(bcrypt.hash).toHaveBeenCalledWith(password2, mockSalt);
    });

    it('should return a string hash', async () => {
      (bcrypt.genSalt as jest.Mock).mockResolvedValue(mockSalt);
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);

      const result = await hashPassword(mockPassword);

      expect(typeof result).toBe('string');
    });

    it('should handle long passwords', async () => {
      (bcrypt.genSalt as jest.Mock).mockResolvedValue(mockSalt);
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);

      const longPassword = 'a'.repeat(100);

      const result = await hashPassword(longPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith(longPassword, mockSalt);
      expect(result).toBe(mockHashedPassword);
    });

    it('should handle passwords with special characters', async () => {
      (bcrypt.genSalt as jest.Mock).mockResolvedValue(mockSalt);
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);

      const specialPassword = 'P@$$w0rd!#%&*()-_+=[]{}|:;<>?,./';

      const result = await hashPassword(specialPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith(specialPassword, mockSalt);
      expect(result).toBe(mockHashedPassword);
    });

    it('should handle passwords with unicode characters', async () => {
      (bcrypt.genSalt as jest.Mock).mockResolvedValue(mockSalt);
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);

      const unicodePassword = 'Pässwörd123😀';

      const result = await hashPassword(unicodePassword);

      expect(bcrypt.hash).toHaveBeenCalledWith(unicodePassword, mockSalt);
      expect(result).toBe(mockHashedPassword);
    });

    it('should throw error on hash failure', async () => {
      (bcrypt.genSalt as jest.Mock).mockResolvedValue(mockSalt);
      (bcrypt.hash as jest.Mock).mockRejectedValue(new Error('Hash error'));

      await expect(hashPassword(mockPassword)).rejects.toThrow('Hash error');
    });

    it('should throw error on salt generation failure', async () => {
      (bcrypt.genSalt as jest.Mock).mockRejectedValue(new Error('Salt error'));

      await expect(hashPassword(mockPassword)).rejects.toThrow('Salt error');
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await verifyPassword(mockPassword, mockHashedPassword);

      expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, mockHashedPassword);
      expect(result).toBe(true);
    });

    it('should reject incorrect password', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await verifyPassword('wrongPassword', mockHashedPassword);

      expect(bcrypt.compare).toHaveBeenCalledWith('wrongPassword', mockHashedPassword);
      expect(result).toBe(false);
    });

    it('should return boolean', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await verifyPassword(mockPassword, mockHashedPassword);

      expect(typeof result).toBe('boolean');
    });

    it('should handle multiple verification attempts', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await verifyPassword('password1', mockHashedPassword);
      await verifyPassword('password2', mockHashedPassword);
      await verifyPassword('password3', mockHashedPassword);

      expect(bcrypt.compare).toHaveBeenCalledTimes(3);
    });

    it('should handle verification with special character passwords', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const specialPassword = 'P@$$w0rd!#%&*()';

      const result = await verifyPassword(specialPassword, mockHashedPassword);

      expect(bcrypt.compare).toHaveBeenCalledWith(specialPassword, mockHashedPassword);
      expect(result).toBe(true);
    });

    it('should handle verification with unicode passwords', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const unicodePassword = 'Pässwörd123';

      const result = await verifyPassword(unicodePassword, mockHashedPassword);

      expect(bcrypt.compare).toHaveBeenCalledWith(unicodePassword, mockHashedPassword);
      expect(result).toBe(true);
    });

    it('should handle empty password verification', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await verifyPassword('', mockHashedPassword);

      expect(bcrypt.compare).toHaveBeenCalledWith('', mockHashedPassword);
      expect(result).toBe(false);
    });

    it('should throw error on compare failure', async () => {
      (bcrypt.compare as jest.Mock).mockRejectedValue(new Error('Compare error'));

      await expect(verifyPassword(mockPassword, mockHashedPassword)).rejects.toThrow('Compare error');
    });

    it('should throw error with invalid hash', async () => {
      (bcrypt.compare as jest.Mock).mockRejectedValue(new Error('Invalid hash'));

      await expect(verifyPassword(mockPassword, 'invalid-hash')).rejects.toThrow('Invalid hash');
    });
  });

  describe('Password flow integration', () => {
    it('should hash and verify matching password', async () => {
      // Mock hash
      (bcrypt.genSalt as jest.Mock).mockResolvedValue(mockSalt);
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);

      const hashed = await hashPassword(mockPassword);

      // Mock verify
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const isValid = await verifyPassword(mockPassword, hashed);

      expect(hashed).toBe(mockHashedPassword);
      expect(isValid).toBe(true);
    });

    it('should hash and reject non-matching password', async () => {
      // Mock hash
      (bcrypt.genSalt as jest.Mock).mockResolvedValue(mockSalt);
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);

      const hashed = await hashPassword(mockPassword);

      // Mock verify
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const isValid = await verifyPassword('wrongPassword', hashed);

      expect(hashed).toBe(mockHashedPassword);
      expect(isValid).toBe(false);
    });

    it('should hash multiple passwords and verify each', async () => {
      (bcrypt.genSalt as jest.Mock).mockResolvedValue(mockSalt);
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);

      const password1 = 'password1';
      const password2 = 'password2';

      const hashed1 = await hashPassword(password1);
      const hashed2 = await hashPassword(password2);

      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true).mockResolvedValueOnce(false);

      const verify1 = await verifyPassword(password1, hashed1);
      const verify2 = await verifyPassword('wrongPassword', hashed2);

      expect(verify1).toBe(true);
      expect(verify2).toBe(false);
    });
  });
});
