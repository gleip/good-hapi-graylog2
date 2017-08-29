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
    const dataString = CircularJSON.stringify(data);
    this.client.info(dataString);
    callback();
  }
}

module.exports = GoodHapiGraylog;
