import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const { method, url } = request;
    const now = Date.now();

    // Log the incoming request
    this.logger.log(`Incoming Request: ${method} ${url}`);

    return next.handle().pipe(
      tap((response) => {
        const responseTime = Date.now() - now;

        // Log the outgoing response
        this.logger.log(
          `Outgoing Response: ${method} ${url} - Status: ${res.statusCode} - ${responseTime}ms`,
        );
      }),
    );
  }
}
