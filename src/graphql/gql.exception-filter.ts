import {
  Catch,
  ArgumentsHost,
  Logger,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql/error';

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  private readonly logger = new Logger(GraphQLExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    // приховуємо Forbidden / Unauthorized — повертаємо null замість помилки
    if (
      exception instanceof ForbiddenException ||
      exception instanceof UnauthorizedException
    ) {
      console.log('ForbiddenException || UnauthorizedException');
      return null;
    }

    // Validation errors (filter / pagination)
    if (exception instanceof BadRequestException) {
      const response = exception.getResponse() as any;

      const message = Array.isArray(response?.message)
        ? response.message.join(', ')
        : response?.message || 'Validation error';

      return new GraphQLError(message, {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      });
    }

    // Internal errors
    if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
    } else {
      this.logger.error(String(exception));
    }

    return new GraphQLError(
      exception instanceof Error ? exception.message : String(exception),
      {
        extensions: {
          code: 'INNER_DATABASE_ERROR',
        },
      },
    );
  }
}
