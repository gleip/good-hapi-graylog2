const Stream = require('stream');
const graylog2 = require('graylog2');

class GoodHapiGraylog extends Stream.Writable {
  constructor({ host, port, facility, hostname }) {
    super({ objectMode: true, decodeStrings: false });
    this.client = new graylog2.graylog({
      servers: [{ host, port }],
      facility,
      hostname,
    });
    this.once('finish', () => {
      this.write();
    });
  }
  _write(data, encoding, callback) {
    const dataString = JSON.stringify(data);
    this.client.info(dataString);
    callback();
  }
}

module.exports = GoodHapiGraylog;
