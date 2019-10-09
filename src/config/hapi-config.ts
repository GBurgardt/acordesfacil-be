// import * as hapi from "hapi";
import hapi = require('@hapi/hapi');


const initHapi = (routes) => {
    // Config events
    process.on('unhandledRejection', (err) => {
        console.log(err);
        process.exit(1);
    });

    const server: hapi.Server = new hapi.Server({
        host: 'localhost',
        port: 3000
    });

    // Add all routes
    routes.forEach(r => server.route(r))

    return server.start()
        .then(
            resp => server
        )

};

module.exports = { initHapi }
