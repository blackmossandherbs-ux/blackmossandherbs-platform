/**
 * Enterprise Logging Infrastructure
 * Structured logging with different log levels
 */

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

interface LogContext {
  [key: string]: any;
}

class Logger {
  private context: LogContext;

  constructor(context: LogContext = {}) {
    this.context = context;
  }

  private log(level: LogLevel, message: string, meta?: LogContext) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...this.context,
      ...meta,
      environment: process.env.NODE_ENV,
    };

    // In production, send to logging service (e.g., Sentry, DataDog, etc.)
    if (process.env.NODE_ENV === 'production') {
      // Send to external logging service
      // Example: sendToLoggingService(logEntry);
    }

    // Console output with formatting
    const color = {
      [LogLevel.ERROR]: '\x1b[31m', // Red
      [LogLevel.WARN]: '\x1b[33m',  // Yellow
      [LogLevel.INFO]: '\x1b[36m',  // Cyan
      [LogLevel.DEBUG]: '\x1b[90m', // Gray
    }[level];

    const reset = '\x1b[0m';
    console.log(`${color}[${level.toUpperCase()}]${reset} ${timestamp} - ${message}`, meta || '');
  }

  error(message: string, error?: Error | unknown, meta?: LogContext) {
    const errorMeta = {
      ...meta,
      ...(error instanceof Error && {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      }),
    };
    this.log(LogLevel.ERROR, message, errorMeta);
  }

  warn(message: string, meta?: LogContext) {
    this.log(LogLevel.WARN, message, meta);
  }

  info(message: string, meta?: LogContext) {
    this.log(LogLevel.INFO, message, meta);
  }

  debug(message: string, meta?: LogContext) {
    if (process.env.NODE_ENV !== 'production') {
      this.log(LogLevel.DEBUG, message, meta);
    }
  }

  child(context: LogContext): Logger {
    return new Logger({ ...this.context, ...context });
  }
}

// Default logger instance
export const logger = new Logger({ service: 'blackmossherbs' });

// Create child loggers for specific modules
export const createLogger = (context: LogContext) => new Logger(context);
