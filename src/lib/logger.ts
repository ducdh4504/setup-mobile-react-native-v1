import { config } from '@/constants/env';

/**
 * Log level priorities: error > warn > info > debug
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Centralized logger that respects environment settings.
 *
 * Usage:
 *   logger.debug('User logged in', { userId: '123' })
 *   logger.error('Network error', error)
 *
 * In production: only errors are logged
 * In development: all levels logged
 */
export const logger = {
  /**
   * Debug-level logs (verbose, only in dev).
   */
  debug: (message: string, data?: unknown) => {
    if (shouldLog('debug')) {
      console.log(`[DEBUG] ${message}`, data);
    }
  },

  /**
   * Info-level logs (general information).
   */
  info: (message: string, data?: unknown) => {
    if (shouldLog('info')) {
      console.log(`[INFO] ${message}`, data);
    }
  },

  /**
   * Warning-level logs (something unexpected but not critical).
   */
  warn: (message: string, data?: unknown) => {
    if (shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, data);
    }
  },

  /**
   * Error-level logs (always logged, always visible).
   */
  error: (message: string, error?: unknown) => {
    if (shouldLog('error')) {
      if (error instanceof Error) {
        console.error(`[ERROR] ${message}`, error.message, error.stack);
      } else {
        console.error(`[ERROR] ${message}`, error);
      }
    }
  },
};

/**
 * Determine if a message at this level should be logged.
 *
 * Priority: error (0) > warn (1) > info (2) > debug (3)
 * If environment logLevel is 'info', only error/warn/info are shown (debug hidden)
 */
function shouldLog(level: LogLevel): boolean {
  const levels: Record<LogLevel, number> = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  };

  const configLevelValue = levels[config.logLevel];
  const messageLevelValue = levels[level];

  // Log if message level <= config level (lower = more important)
  return messageLevelValue <= configLevelValue || !config.enableConsoleLogging
    ? config.enableConsoleLogging || level === 'error'
    : false;
}

/**
 * Network request/response logger.
 * Only logs if enableNetworkLogging is true in config.
 */
export const networkLogger = {
  request: (method: string, url: string, data?: unknown) => {
    if (!config.enableNetworkLogging) return;
    logger.debug(`[HTTP] ${method} ${url}`, data);
  },

  response: (method: string, url: string, status: number, duration: number) => {
    if (!config.enableNetworkLogging) return;
    const statusColor = status < 400 ? '✅' : status < 500 ? '⚠️' : '❌';
    logger.debug(`[HTTP] ${statusColor} ${method} ${url} ${status} (${duration}ms)`);
  },

  error: (method: string, url: string, status: number, error: unknown) => {
    if (!config.enableNetworkLogging) return;
    logger.warn(`[HTTP] ❌ ${method} ${url} ${status}`, error);
  },
};
