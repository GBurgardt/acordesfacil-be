const hapiConfig = require('./config/hapi-config');

// Import routes
const routesJson = require('./routes');
const routes = Object.keys(routesJson).map(rk => routesJson[rk][rk])

// Init server
hapiConfig.initHapi(routes)
    .then(
        server => {
            console.log('Server running on %s', server.info.uri);
        }
    )