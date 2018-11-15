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

const tagLevels = {
    emergency: 'emergency',
    alert: 'alert',
    critical: 'critical',
    error: 'error',
    warning: 'warning',
    notice: 'notice',
    info: 'info',
    debug: 'debug'
};

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

    // Good event to log level mapping:
    // request, response, ops => info
    // error => error
    // log => <level tag>
    let logLevel = 'info';
    if (data) {
      if (data.event === 'error') {
        logLevel = 'error';
      } else if (data.event === 'log' && data.tags) {
        let tags = data.tags;
        let l = tags.length;
        for (let i = 0; i < l; i++) {
          let t = tags[i];
          if (tagLevels[t]) {
            logLevel = t;
            break;
          }
        }
      }
    }

    this.log[logLevel](message, dataString );
    callback();
  }
}

module.exports = GoodHapiGraylog;
