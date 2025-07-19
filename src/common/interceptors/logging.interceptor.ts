import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../services/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext('LoggingInterceptor');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const now = Date.now();

    this.logger.logApiRequest(method, url, ip);

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const delay = Date.now() - now;

          this.logger.log(`${method} ${url} ${response.statusCode} ${delay}ms`);
        },
        error: (error) => {
          const delay = Date.now() - now;
          this.logger.error(
            `${method} ${url} ${error.status || 500} ${delay}ms - ${
              error.message
            }`,
          );
        },
      }),
    );
  }
}
