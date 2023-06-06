const Stream = require('stream');
const log = require('gelf-pro');
const CircularJSON = require('circular-json');

class GoodHapiGraylog extends Stream.Writable {
  constructor({ host, port, facility, hostname, adapter = 'udp' }) {
    super({ objectMode: true, decodeStrings: false });
    this.once('finish', () => {
      this.write();
    });
    this.log = log.setConfig({
      fields: { facility, host:hostname },
      adapterName: adapter,
      adapterOptions: {
        host,
        port
      }
    }); 
  }
  _write(data, encoding, callback) {
    const dataString = CircularJSON.stringify(data);
    this.log.info(dataString);
    callback();
  }
}

module.exports = GoodHapiGraylog;