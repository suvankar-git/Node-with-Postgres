const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');

const env = process.env.NODE_ENV || 'dev';
const logDir = 'log';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: `${logDir}/%DATE%-results.log`,
  datePattern: 'YYYY-MM-DD'
});
//const filename = path.join(logDir, 'results.log');

const logger = createLogger({
  // change level if in dev environment versus production
  level: env === 'development' ? 'info' : 'debug',
  format: combine(
    format.label({ label: path.basename(module.parent.filename) }),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    printf(info =>  `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`)
    //format.json()
  ),
  transports: [
    new transports.Console({
      level: 'info',
      format: combine(
        format.label({ label: path.basename(module.parent.filename) }),
        format.colorize(),
        printf(
          info =>  `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
        )
      )
    }),
    dailyRotateFileTransport
  ]
});

/*logger.debug('Debugging info');
logger.verbose('Verbose info');
logger.info('Hello world');
logger.warn('Warning message');
logger.error('Error info');*/

module.exports = logger;