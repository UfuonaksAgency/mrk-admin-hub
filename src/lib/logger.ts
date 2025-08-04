import { isProduction } from './env';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogData {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  component?: string;
}

class Logger {
  private log(level: LogLevel, message: string, data?: any, component?: string) {
    const logData: LogData = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      component,
    };

    // In development, use console methods
    if (!isProduction) {
      const consoleMethod = level === 'info' ? 'log' : level;
      console[consoleMethod](`[${level.toUpperCase()}] ${component ? `[${component}] ` : ''}${message}`, data || '');
    }

    // In production, you would send logs to your logging service
    if (isProduction && (level === 'error' || level === 'warn')) {
      // Send to your error tracking service (e.g., Sentry, LogRocket)
      this.sendToLoggingService(logData);
    }
  }

  private sendToLoggingService(logData: LogData) {
    // Implementation would send to your logging service
    // For now, we'll store critical errors in sessionStorage as a fallback
    try {
      const logs = JSON.parse(sessionStorage.getItem('app_logs') || '[]');
      logs.push(logData);
      // Keep only last 50 logs to prevent storage overflow
      if (logs.length > 50) {
        logs.splice(0, logs.length - 50);
      }
      sessionStorage.setItem('app_logs', JSON.stringify(logs));
    } catch (error) {
      // Fallback failed, at least try console in production for critical errors
      console.error('Logging failed:', logData);
    }
  }

  info(message: string, data?: any, component?: string) {
    this.log('info', message, data, component);
  }

  warn(message: string, data?: any, component?: string) {
    this.log('warn', message, data, component);
  }

  error(message: string, data?: any, component?: string) {
    this.log('error', message, data, component);
  }

  debug(message: string, data?: any, component?: string) {
    this.log('debug', message, data, component);
  }
}

export const logger = new Logger();
