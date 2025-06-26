// auto-connect-backend/configs/log.config.js
import pino from "pino";
import dotenv from "dotenv";

dotenv.config();

const isDevelopment = process.env.NODE_ENV === "development";
const logLevel = process.env.LOG_LEVEL || "info";

// Pino configuration
const pinoConfig = {
  level: logLevel,
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => {
      return { level: label };
    },
    bindings: (bindings) => {
      return {
        pid: bindings.pid,
        hostname: bindings.hostname,
        name: bindings.name,
      };
    },
  },
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err,
  },
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "req.body.password",
      "req.body.confirmPassword",
      "req.body.currentPassword",
      "req.body.newPassword",
    ],
    censor: "[REDACTED]",
  },
};

// Pretty printing for development
const transport = isDevelopment
  ? {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
        ignore: "pid,hostname",
      },
    }
  : undefined;

if (transport) {
  pinoConfig.transport = transport;
}

const logger = pino(pinoConfig);

// Custom log methods for different scenarios
const LOG = {
  // Core pino methods and properties (REQUIRED for pino-http compatibility)
  info: logger.info.bind(logger),
  error: logger.error.bind(logger),
  warn: logger.warn.bind(logger),
  debug: logger.debug.bind(logger),
  fatal: logger.fatal.bind(logger),
  trace: logger.trace.bind(logger),
  child: logger.child.bind(logger),
  level: logger.level,

  // Your existing custom methods
  customInfo: (message, meta = {}) => logger.info(meta, message),
  customError: (message, meta = {}) => logger.error(meta, message),
  customWarn: (message, meta = {}) => logger.warn(meta, message),
  customDebug: (message, meta = {}) => logger.debug(meta, message),

  // Authentication specific logs
  auth: {
    login: (userId, email, success = true, meta = {}) => {
      const logData = { userId, email, success, type: "login", ...meta };
      if (success) {
        logger.info(logData, "User login successful");
      } else {
        logger.warn(logData, "User login failed");
      }
    },
    register: (userId, email, role, success = true, meta = {}) => {
      const logData = {
        userId,
        email,
        role,
        success,
        type: "register",
        ...meta,
      };
      if (success) {
        logger.info(logData, "User registration successful");
      } else {
        logger.warn(logData, "User registration failed");
      }
    },
    logout: (userId, email, meta = {}) => {
      const logData = { userId, email, type: "logout", ...meta };
      logger.info(logData, "User logout");
    },
    tokenRefresh: (userId, email, success = true, meta = {}) => {
      const logData = {
        userId,
        email,
        success,
        type: "token_refresh",
        ...meta,
      };
      if (success) {
        logger.info(logData, "Token refresh successful");
      } else {
        logger.warn(logData, "Token refresh failed");
      }
    },
    passwordReset: (email, success = true, meta = {}) => {
      const logData = { email, success, type: "password_reset", ...meta };
      if (success) {
        logger.info(logData, "Password reset initiated");
      } else {
        logger.warn(logData, "Password reset failed");
      }
    },
  },

  // Security specific logs
  security: {
    rateLimitHit: (ip, endpoint, meta = {}) => {
      const logData = { ip, endpoint, type: "rate_limit_hit", ...meta };
      logger.warn(logData, "Rate limit exceeded");
    },
    suspiciousActivity: (userId, activity, meta = {}) => {
      const logData = {
        userId,
        activity,
        type: "suspicious_activity",
        ...meta,
      };
      logger.warn(logData, "Suspicious activity detected");
    },
    invalidToken: (token, reason, meta = {}) => {
      const logData = {
        token: token ? token.substring(0, 10) + "..." : "null",
        reason,
        type: "invalid_token",
        ...meta,
      };
      logger.warn(logData, "Invalid token usage");
    },
  },

  // Database specific logs
  db: {
    connection: (status, meta = {}) => {
      const logData = { status, type: "db_connection", ...meta };
      if (status === "connected") {
        logger.info(logData, "Database connection established");
      } else {
        logger.error(logData, "Database connection failed");
      }
    },
    query: (query, duration, meta = {}) => {
      const logData = { query, duration, type: "db_query", ...meta };
      logger.debug(logData, "Database query executed");
    },
  },

  // HTTP request logging
  http: (req, res, responseTime, meta = {}) => {
    const logData = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime,
      userAgent: req.get("user-agent"),
      ip: req.ip,
      type: "http_request",
      ...meta,
    };

    if (res.statusCode >= 400) {
      logger.warn(logData, "HTTP request completed with error");
    } else {
      logger.info(logData, "HTTP request completed");
    }
  },
};

export default LOG;
