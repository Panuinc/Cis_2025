import winston from "winston";
import path from "path";
import moment from "moment-timezone";

const timeZone = "Asia/Bangkok";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: () => moment().tz(timeZone).format("YYYY-MM-DD HH:mm:ss"),
    }),
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
      const metaString = Object.keys(meta).length
        ? JSON.stringify(meta, null, 2)
        : "";
      return `${timestamp} [${level}]: ${message} ${metaString}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: path.join(process.cwd(), "logs", "application.log"),
      level: "info",
    }),
  ],
});

export default logger;
