import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

@Injectable()
export class LoggerService implements NestLoggerService {
  private context?: string;

  setContext(context: string) {
    this.context = context;
    return this;
  }

  log(message: any, context?: string) {
    console.log(
      `[${new Date().toISOString()}] [LOG] [${
        context || this.context
      }] ${message}`,
    );
  }

  error(message: any, trace?: string, context?: string) {
    console.error(
      `[${new Date().toISOString()}] [ERROR] [${
        context || this.context
      }] ${message}`,
    );
    if (trace) {
      console.error(trace);
    }
  }

  warn(message: any, context?: string) {
    console.warn(
      `[${new Date().toISOString()}] [WARN] [${
        context || this.context
      }] ${message}`,
    );
  }

  debug(message: any, context?: string) {
    console.debug(
      `[${new Date().toISOString()}] [DEBUG] [${
        context || this.context
      }] ${message}`,
    );
  }

  verbose(message: any, context?: string) {
    console.log(
      `[${new Date().toISOString()}] [VERBOSE] [${
        context || this.context
      }] ${message}`,
    );
  }

  // Security-specific logging methods
  logSecurityEvent(event: string, details?: any, context?: string) {
    this.warn(`SECURITY EVENT: ${event}`, context);
    if (details) {
      this.debug(`Details: ${JSON.stringify(details)}`, context);
    }
  }

  logApiRequest(method: string, url: string, ip: string, context?: string) {
    this.log(`API Request: ${method} ${url} from ${ip}`, context);
  }

  logDatabaseQuery(query: string, duration: number, context?: string) {
    this.debug(`DB Query (${duration}ms): ${query}`, context);
  }
}
