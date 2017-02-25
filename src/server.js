const Hapi = require('hapi');
const CookieAuth = require('hapi-auth-cookie');
const Vision = require('vision');
const Inert = require('inert');
const Path = require('path');
const env = require('env2')('./config.env');
const routes = require('./routes/index.js');

const server = new Hapi.Server();

server.connection({
  port: process.env.PORT || 8080,
  routes: {
    files: {
      relativeTo: Path.join(__dirname, '../public')
    }
  }
});

server.register([Vision, Inert, CookieAuth], (err) => {
  if (err) { throw err; }

  server.views({
    engines: {
      hbs: require('handlebars')
    },
    relativeTo: __dirname,
    path: 'views',
    layoutPath: 'views/layout/',
    helpersPath: 'views/helpers/',
    layout: 'layout',
    partialsPath: 'views/partials/'
  });

  const options = {
    password: process.env.COOKIE_PASSWORD,
    cookie: 'livepeerscookie',
    ttl: 24 * 60 * 60 * 1000,
    isSecure: process.env.NODE_ENV === 'PRODUCTION',
    isHttpOnly: false,
    redirectTo: '/'
  };
  server.auth.strategy('session', 'cookie', options);

  server.route(routes);
});

module.exports = server;
