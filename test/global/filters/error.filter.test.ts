import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import {
  BadRequestError,
  ConstraintViolationError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from 'src/errors';
import { ApiHttpErrorFilter } from 'src/global/filters/error.filter';

describe('Error Filter Tests', () => {
  const filter = new ApiHttpErrorFilter();

  test('When catch an unexpected error then throw internal server error', () => {
    const error = new Error();

    const mockResponse = {
      status: jest.fn().mockImplementation(() => mockResponse),
      json: jest.fn(),
    };

    const ctx = {
      getResponse: () => mockResponse,
    };

    const host = {
      switchToHttp: () => ctx,
    };

    filter.catch(error, host as any);

    expect(mockResponse.status).toBeCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toBeCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    });
  });

  test('When catch an internal server error then throw internal server error', () => {
    const error = new InternalServerError('Internal Server Error');

    const mockResponse = {
      status: jest.fn().mockImplementation(() => mockResponse),
      json: jest.fn(),
    };

    const ctx = {
      getResponse: () => mockResponse,
    };

    const host = {
      switchToHttp: () => ctx,
    };

    filter.catch(error, host as any);

    const expectedResponse = new InternalServerErrorException(error.message);

    expect(mockResponse.status).toBeCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toBeCalledWith(expectedResponse.getResponse());
  });

  test('When catch a http exception then forward it', () => {
    const error = new NotFoundException();

    const mockResponse = {
      status: jest.fn().mockImplementation(() => mockResponse),
      json: jest.fn(),
    };

    const ctx = {
      getResponse: () => mockResponse,
    };

    const host = {
      switchToHttp: () => ctx,
    };

    filter.catch(error, host as any);

    expect(mockResponse.status).toBeCalledWith(error.getStatus());
    expect(mockResponse.json).toBeCalledWith(error.getResponse());
  });

  test('When catch a not found error then forward http not found exception', () => {
    const error = new NotFoundError();

    const mockResponse = {
      status: jest.fn().mockImplementation(() => mockResponse),
      json: jest.fn(),
    };

    const ctx = {
      getResponse: () => mockResponse,
    };

    const host = {
      switchToHttp: () => ctx,
    };

    filter.catch(error, host as any);

    const expectedResponse = new NotFoundException();

    expect(mockResponse.status).toBeCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toBeCalledWith(expectedResponse.getResponse());
  });

  test('When catch a bad request error then forward http bad request exception', () => {
    const error = new BadRequestError();

    const mockResponse = {
      status: jest.fn().mockImplementation(() => mockResponse),
      json: jest.fn(),
    };

    const ctx = {
      getResponse: () => mockResponse,
    };

    const host = {
      switchToHttp: () => ctx,
    };

    filter.catch(error, host as any);

    const expectedResponse = new BadRequestException();

    expect(mockResponse.status).toBeCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toBeCalledWith(expectedResponse.getResponse());
  });

  test('When catch a constraint violation error then forward bad request exception', () => {
    const error = new ConstraintViolationError();

    const mockResponse = {
      status: jest.fn().mockImplementation(() => mockResponse),
      json: jest.fn(),
    };

    const ctx = {
      getResponse: () => mockResponse,
    };

    const host = {
      switchToHttp: () => ctx,
    };

    filter.catch(error, host as any);

    const expectedResponse = new BadRequestException();

    expect(mockResponse.status).toBeCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toBeCalledWith(expectedResponse.getResponse());
  });

  test('When catch a forbidden error then forward forbidden exception', () => {
    const error = new ForbiddenError();

    const mockResponse = {
      status: jest.fn().mockImplementation(() => mockResponse),
      json: jest.fn(),
    };

    const ctx = {
      getResponse: () => mockResponse,
    };

    const host = {
      switchToHttp: () => ctx,
    };

    filter.catch(error, host as any);

    const expectedResponse = new ForbiddenException();

    expect(mockResponse.status).toBeCalledWith(HttpStatus.FORBIDDEN);
    expect(mockResponse.json).toBeCalledWith(expectedResponse.getResponse());
  });

  test('When catch a unauthorized error then forward unauthorized exception', () => {
    const error = new UnauthorizedError();

    const mockResponse = {
      status: jest.fn().mockImplementation(() => mockResponse),
      json: jest.fn(),
    };

    const ctx = {
      getResponse: () => mockResponse,
    };

    const host = {
      switchToHttp: () => ctx,
    };

    filter.catch(error, host as any);

    const expectedResponse = new UnauthorizedException();

    expect(mockResponse.status).toBeCalledWith(HttpStatus.UNAUTHORIZED);
    expect(mockResponse.json).toBeCalledWith(expectedResponse.getResponse());
  });
});
