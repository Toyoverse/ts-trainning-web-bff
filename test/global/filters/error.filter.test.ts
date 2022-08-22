import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ConstraintViolationError, NotFoundError } from 'src/errors';
import { ApiHttpErrorFilter } from 'src/global/filters/error.filter';

describe('Error Filter Tests', () => {
  const filter = new ApiHttpErrorFilter();
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

  test('When catch a not handled error then throw internal server error', () => {
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
});
