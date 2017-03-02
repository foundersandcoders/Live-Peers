const Hapi = require('hapi');
const cookieauth = require('hapi-auth-cookie');
const vision = require('vision');
const inert = require('inert');
const fs = require('fs');
const path = require('path');
const env = require('env2')('./config.env');
const routes = require('./routes/index.js');

const server = new Hapi.Server();

const tls = {
  key: fs.readFileSync(path.join(__dirname, '../keys/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '../keys/cert.pem'))
};

server.connection({
  port: process.env.PORT || 8080,
  routes: {
    files: {
      relativeTo: __dirname
    }
  },
  tls: tls
});

server.register([vision, inert, cookieauth], (err) => {
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

  // Required for static files
  const fileRoute = {
    method: 'GET',
    path: '/{path*}',
    handler: {
      directory: {
        path: '../public'
      }
    }
  };
  server.auth.strategy('session', 'cookie', options);

  server.route([fileRoute, ...routes]);
});

module.exports = server;
