const Stream = require('stream');
const graylog2 = require('graylog2');
const CircularJSON = require('circular-json');

class GoodHapiGraylog extends Stream.Writable {
  constructor({ host, port, facility, hostname, bufferSize = 1400 }) {
    super({ objectMode: true, decodeStrings: false });
    this.client = new graylog2.graylog({
      servers: [{ host, port }],
      facility,
      hostname,
      bufferSize,
    });
    this.once('finish', () => {
      this.write();
    });
  }
  _write(data, encoding, callback) {
    const level = (data.tags) ? data.tags[0] : 'info';
    const dataString = (data.data) ? `[${level}] ${CircularJSON.stringify(data.data)}` : CircularJSON.stringify(data);
    switch (level) {
      case 'debug':
        this.client.debug(dataString);
        break;
      case 'info':
        this.client.info(dataString);
        break;
      case 'error':
        this.client.error(dataString);
        break;
      case 'warn':
        this.client.warning(dataString);
        break;
      default:
        this.client.info(dataString);
        break;
    }
    callback();
  }
}

module.exports = GoodHapiGraylog;
