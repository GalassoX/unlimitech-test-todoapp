import { responseSuccess, responseError } from '@/lib/apiResponses';
import { CONSTANTS } from '@/constants/common';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import { HttpStatus } from '@/constants/httpStatus';
import { Response } from 'express';

describe('API Responses', () => {
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('responseSuccess', () => {
    it('should send success response with default status code', () => {
      const data = { id: '123', name: 'Test' };
      const message = 'Operation successful';

      responseSuccess(mockResponse as Response, {
        data,
        message,
      });

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data,
        message,
      });
    });

    it('should send success response with custom status code', () => {
      const data = { id: '123', name: 'Test' };
      const message = 'Created successfully';
      const statusCode = HttpStatus.CREATED;

      responseSuccess(mockResponse as Response, {
        statusCode,
        data,
        message,
      });

      expect(mockResponse.status).toHaveBeenCalledWith(statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data,
        message,
      });
    });

    it('should send success response with empty data when not provided', () => {
      const message = 'Success';

      responseSuccess(mockResponse as Response, {
        message,
      });

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: {},
        message,
      });
    });

    it('should send success response with empty message when not provided', () => {
      const data = { id: '123' };

      responseSuccess(mockResponse as Response, {
        data,
      });

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data,
        message: '',
      });
    });

    it('should send success response with array data', () => {
      const data = [{ id: '1' }, { id: '2' }];
      const message = 'Items retrieved';

      responseSuccess(mockResponse as Response, {
        data,
        message,
      });

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data,
        message,
      });
    });

    it('should send success response with null data - converts to empty object', () => {
      const message = 'No content';

      responseSuccess(mockResponse as Response, {
        data: null,
        message,
      });

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: {},
        message,
      });
    });
  });

  describe('responseError', () => {
    it('should send error response with default status code', () => {
      const error = ERROR_MESSAGES.INVALID_CREDENTIALS;

      responseError(mockResponse as Response, {
        error,
      });

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: CONSTANTS.GENERIC_ERROR,
        error,
      });
    });

    it('should send error response with custom status code', () => {
      const error = ERROR_MESSAGES.ACCOUNT_NOT_FOUND;
      const statusCode = HttpStatus.UNAUTHORIZED;

      responseError(mockResponse as Response, {
        statusCode,
        error,
      });

      expect(mockResponse.status).toHaveBeenCalledWith(statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: CONSTANTS.GENERIC_ERROR,
        error,
      });
    });

    it('should send error response with NOT_FOUND status', () => {
      const error = ERROR_MESSAGES.TASK_NOT_FOUND;
      const statusCode = HttpStatus.NOT_FOUND;

      responseError(mockResponse as Response, {
        statusCode,
        error,
      });

      expect(mockResponse.status).toHaveBeenCalledWith(statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: CONSTANTS.GENERIC_ERROR,
        error,
      });
    });

    it('should send error response with INTERNAL_SERVER_ERROR status', () => {
      const error = ERROR_MESSAGES.GENERIC_ERROR;
      const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

      responseError(mockResponse as Response, {
        statusCode,
        error,
      });

      expect(mockResponse.status).toHaveBeenCalledWith(statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: CONSTANTS.GENERIC_ERROR,
        error,
      });
    });

    it('should always use GENERIC_ERROR as message in error response', () => {
      const error = ERROR_MESSAGES.USER_TAKEN;

      responseError(mockResponse as Response, {
        error,
      });

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: CONSTANTS.GENERIC_ERROR,
        })
      );
    });
  });

  describe('Response chaining', () => {
    it('should allow method chaining for status and json', () => {
      const data = { id: '123' };
      const message = 'Success';

      responseSuccess(mockResponse as Response, {
        data,
        message,
      });

      expect(mockResponse.status).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });
});
