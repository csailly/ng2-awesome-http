export enum LoggerLevel {
  LOG,
  DEBUG,
  WARN,
  ERROR,
  OFF
}

export interface LoggerConfig {
  levels: LoggerLevel[];
}

const defaultConfig = { levels: [LoggerLevel.OFF] };

const tag = 'awesomeHttp @';

export class Logger {

  private loggerConfig = defaultConfig;

  log(...args: any[]) {
    this.doLog(LoggerLevel.LOG, args);
  }

  debug(...args: any[]) {
    this.doLog(LoggerLevel.DEBUG, args);
  }

  warn(...args: any[]) {
    this.doLog(LoggerLevel.WARN, args);
  }

  error(...args: any[]) {
    this.doLog(LoggerLevel.ERROR, args);
  }

  doLog(level: LoggerLevel, ...args: any[]) {
    try {
      if (this.isEnabled(level)) {
        const methodName = LoggerLevel[level].toString().toLowerCase();
        const logArgs = (args[0] || []).join(' ');
        console[methodName](tag, logArgs);
      }
    } catch (e) {
      console.error(tag, 'Unable to log', e);
    }
  }

  isEnabled(level: LoggerLevel) {
    return !this.isLoggerOff(level) && this.containsLogger(level);
  }

  private isLoggerOff(level: LoggerLevel) {
    return LoggerLevel.OFF === level;
  }

  private containsLogger(level: LoggerLevel) {
    return !!this.loggerConfig && !!this.loggerConfig.levels && this.loggerConfig.levels.indexOf(level) !== -1;
  }

  setConfig(loggerConfig: LoggerConfig) {
    this.loggerConfig = loggerConfig;
  }

}
