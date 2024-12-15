const { createLogger, format, transports } = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');

const { combine, timestamp, printf } = format;

// Formato personalizado para los logs
const customFormat = printf(({ level, message, timestamp }) => {
  return JSON.stringify({
    timestamp,
    level,
    message
  });
});

// Opciones para ElasticsearchTransport
const esTransportOpts = {
  level: 'info',
  clientOpts: {
    node: 'http://elasticsearch:9200',
  },
  indexPrefix: 'app-logs',
  // Puedes añadir más opciones si es necesario
};

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    customFormat
  ),
  transports: [
    new ElasticsearchTransport(esTransportOpts)
  ],
});

module.exports = logger;
