const hapiConfig = require('./config/hapi-config');

// Import routes
const routesJson = require('./routes');
const routes = Object.keys(routesJson).map(rk => routesJson[rk][rk])


const fs = require('fs');

const isProduction = process.env.ACORDESFACIL_IS_PROD;

if (isProduction) {
    const tls = {
        key: fs.readFileSync('/etc/letsencrypt/live/acordesfacil.tk/privkey.pem', 'utf8'),
        cert: fs.readFileSync('/etc/letsencrypt/live/acordesfacil.tk/cert.pem', 'utf8'),
        ca: fs.readFileSync('/etc/letsencrypt/live/acordesfacil.tk/chain.pem', 'utf8')
    };

    // Init server
    hapiConfig.initHapi(routes, tls)
        .then(
            server => {
                console.log('https Server running on %s', server.info.uri);
            }
        )
} else {
    hapiConfig.initHapi(routes)
        .then(
            server => {
                console.log('Server running on %s', server.info.uri);
            }
        )

}

