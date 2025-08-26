import winston from "winston";

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Custom format for dev (color + pretty print)
const devFormat = combine(
  colorize(),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack }) => {
    return `[${timestamp}] ${level}: ${stack || message}`;
  })
);

// JSON structured logs for prod
const prodFormat = combine(timestamp(), errors({ stack: true }), json());

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  format: process.env.NODE_ENV === "development" ? devFormat : prodFormat,
  transports: [
    new winston.transports.Console(),
    // File logs (optional)
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});
