const Hapi = require('hapi');
const cookieAuth = require('hapi-auth-cookie');
const vision = require('vision');
const inert = require('inert');
const server = new Hapi.Server();
const env = require('env2');
const fs = require('fs');
const path = require('path');

// Install Environment Variables
env('./config.env');

// Set Cookie Options
const options = {
  password: process.env.COOKIE_PASSWORD,
  cookie: 'livepeerscookie',
  ttl: 24 * 60 * 60 * 1000,
  isSecure: process.env.NODE_ENV === 'PRODUCTION',
  isHttpOnly: false,
  redirectTo: '/'
};  // make this :)

// Add certs for https
const tls = {
  key: fs.readFileSync(path.join(__dirname, '../keys/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '../keys/cert.pem'))
};

// Set Connection
server.connection({
  port: process.env.PORT || 8080,
  routes: {
    files: {
      relativeTo: __dirname
    }
  },
  tls: tls
});

// Register Plugins
server.register([vision, inert, cookieAuth], (err) => {
  if (err) { throw err; }

    // Register views
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
  server.auth.strategy('session', 'cookie', options);

  const fileRoute = {
    method: 'GET',
    path: '/{path*}',
    handler: {
      directory: {
        path: '../public'
      }
    }
  };
  server.route([fileRoute, require('./routes/home')]);
});

module.exports = server;
