import { Module, Global } from '@nestjs/common';
import { LoggerService } from './services/logger.service';
import { SecurityService } from './services/security.service';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

@Global()
@Module({
  providers: [LoggerService, SecurityService, LoggingInterceptor],
  exports: [LoggerService, SecurityService, LoggingInterceptor],
})
export class CommonModule {}
