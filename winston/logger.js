const winston = require('winston');
const { createLogger, transports, format } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

// 기본 로그 설정
const defaultLogger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'app.log' })
  ]
});

// WebRTC 로그 설정
const WebRTCLogger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [
    new transports.File({ filename: './log/WebRTCLog/WebRTCLog.log' })
    // new DailyRotateFile({
    //   filename: './log/WebRTCLog/%DATE%WebRTCLog.log',
    //   datePattern: 'YYYY-MM-DD',
    // })
  ]
});

module.exports = { defaultLogger, WebRTCLogger };
