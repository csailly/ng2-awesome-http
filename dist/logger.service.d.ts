export declare enum LoggerLevel {
    LOG = 0,
    DEBUG = 1,
    WARN = 2,
    ERROR = 3,
    OFF = 4,
}
export interface LoggerConfig {
    levels: LoggerLevel[];
}
export declare class Logger {
    private loggerConfig;
    log(...args: any[]): void;
    debug(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    doLog(level: LoggerLevel, ...args: any[]): void;
    isEnabled(level: LoggerLevel): boolean;
    private isLoggerOff(level);
    private containsLogger(level);
    setConfig(loggerConfig: LoggerConfig): void;
}
