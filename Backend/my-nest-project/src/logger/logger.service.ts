import { Injectable } from '@nestjs/common';
import { createLogger, transports, format } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class LoggerService {
  private logger;

  constructor() {
    const environment = process.env.NODE_ENV || 'development';

    this.logger = createLogger({
      level: environment === 'development' ? 'debug' : 'info',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.json() // Structured JSON logging for production
      ),
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(
              ({ level, message, timestamp }) =>
                `${timestamp} [${level.toUpperCase()}]: ${message}`
            ),
          ),
        }),
        // Daily rotate file transport
        new DailyRotateFile({
          filename: 'logs/application-%DATE%.log', // The log file pattern
          datePattern: 'YYYY-MM-DD',               // Date pattern for daily rotation
          zippedArchive: true,                     // Optionally zip old logs
          maxSize: '20m',                          // Max file size before rotating
          maxFiles: '14d',                         // Retain logs for 14 days
        }),
      ],
    });
  }

  logInfo(message: string) {
    this.logger.info(message);
  }

  logError(message: string, trace?: string) {
    this.logger.error({ message, trace });
  }

  logWarn(message: string) {
    this.logger.warn(message);
  }
}
