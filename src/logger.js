const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
  level: 'info', // Niveles: 'debug', 'error'...
  format: combine(
    timestamp(),
    customFormat
  ),
  transports: [
    new transports.File({ filename: 'logs/api.log' }),
  ],
});

module.exports = logger;
