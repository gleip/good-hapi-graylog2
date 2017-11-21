const Stream = require('stream');
const graylog2 = require('graylog2');
const CircularJSON = require('circular-json');

class GoodHapiGraylog extends Stream.Writable {
  constructor({ host, port, facility, hostname, bufferSize = 1400 }) {
    super({ objectMode: true, decodeStrings: false });
    this.host = host;
    this.port = port;
    this.facility = facility;
    this.hostname = hostname;
    this.bufferSize = bufferSize;
    this.once('finish', () => {
      this.write();
    });
  }
  _write(data, encoding, callback) {
    const client = new graylog2.graylog({
      servers: [{ host: this.host, port: this.port }],
      facility: this.facility,
      hostname: this.hostname,
      bufferSize: this.bufferSize,
    });
    const dataString = CircularJSON.stringify(data);
    client.log(dataString);
    callback();
  }
}

module.exports = GoodHapiGraylog;
