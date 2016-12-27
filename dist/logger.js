"use strict";
(function (LoggerLevel) {
    LoggerLevel[LoggerLevel["LOG"] = 0] = "LOG";
    LoggerLevel[LoggerLevel["DEBUG"] = 1] = "DEBUG";
    LoggerLevel[LoggerLevel["WARN"] = 2] = "WARN";
    LoggerLevel[LoggerLevel["ERROR"] = 3] = "ERROR";
    LoggerLevel[LoggerLevel["OFF"] = 4] = "OFF";
})(exports.LoggerLevel || (exports.LoggerLevel = {}));
var LoggerLevel = exports.LoggerLevel;
var defaultConfig = { levels: [LoggerLevel.OFF] };
var tag = 'awesomeHttp @';
var Logger = (function () {
    function Logger() {
        this.loggerConfig = defaultConfig;
    }
    Logger.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        this.doLog(LoggerLevel.LOG, args);
    };
    Logger.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        this.doLog(LoggerLevel.DEBUG, args);
    };
    Logger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        this.doLog(LoggerLevel.WARN, args);
    };
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        this.doLog(LoggerLevel.ERROR, args);
    };
    Logger.prototype.doLog = function (level) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        try {
            if (this.isEnabled(level)) {
                var methodName = LoggerLevel[level].toString().toLowerCase();
                var logArgs = (args[0] || []).join(' ');
                console[methodName](tag, logArgs);
            }
        }
        catch (e) {
            console.error(tag, 'Unable to log', e);
        }
    };
    Logger.prototype.isEnabled = function (level) {
        return !this.isLoggerOff(level) && this.containsLogger(level);
    };
    Logger.prototype.isLoggerOff = function (level) {
        return LoggerLevel.OFF === level;
    };
    Logger.prototype.containsLogger = function (level) {
        return !!this.loggerConfig && !!this.loggerConfig.levels && this.loggerConfig.levels.indexOf(level) !== -1;
    };
    Logger.prototype.setConfig = function (loggerConfig) {
        this.loggerConfig = loggerConfig;
    };
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map