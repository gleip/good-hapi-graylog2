# good-hapi-graylog2
_Good Reporter For Graylog2_

__Hapi:__ http://hapijs.com/

__Good:__ https://github.com/hapijs/good

__Graylog2:__ https://www.graylog.org/



## Usage:

_npm install good-hapi-graylog2_

```
const Good = require('good');
const Hapi = require('hapi');
const pino = require('pino')();

const server = new Hapi.Server();
server.connection({ port: <your_port> });

const goodOptions = {
  includes: {
    request: ['headers'],
    response: ['payload'],
  },
  reporters: {
    logstash: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{ response: '*', request: '*' }],
    }, {
      module: 'good-hapi-graylog2',
      args: [{
        host: '<graylog server ip>',
        port: '<graylog server port>',
        facility: '<your service name>',
        hostname: '<your host>',
      }],
    }],
  },
};
try {
  server.register([{
      register: good,
      options: goodOptions,
    }], async () => {

    const start = await server.start();
    if (start instanceof Error) throw new Error('Ошибка запуска сервера');

    pino.info('Server running at:', server.info.uri);
  });
} catch((error) => {
  pino.error(error.message)
})

```

## Graylog Setup:
This module requires a _GELF_UDP_ input to be configured on your graylog server.