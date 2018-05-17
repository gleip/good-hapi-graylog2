
const Stream = require('stream');
const log = require('gelf-pro');
const CircularJSON = require('circular-json');

function removeTimestamp(classInstance) {
    var jsonedObject = {};
    for (var x in classInstance) {
        if (x === "constructor" || x === "timestamp") {
            continue;
        }
        jsonedObject[x] = classInstance[x];
    }
    return jsonedObject;
}

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
    const dataString = CircularJSON.parse(CircularJSON.stringify(removeTimestamp(data)));
    const message = (dataString.description) ? dataString.description : 'None';
    this.log.info(message, dataString );
    callback();
  }
}

module.exports = GoodHapiGraylog;
