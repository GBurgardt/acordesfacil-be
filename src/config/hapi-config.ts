// import * as hapi from "hapi";
import hapi = require('@hapi/hapi');


const initHapi = (routes, tls?) => {
    // Config events
    process.on('unhandledRejection', (err) => {
        console.log(err);
        process.exit(1);
    });

    if (tls) {
        const server: hapi.Server = new hapi.Server({
            port: 3001,
            tls: tls
        })

        routes.forEach(r => server.route(r))

        return server.start()
            .then(
                resp => server
            )
    } else {

        const server: hapi.Server = new hapi.Server({
            host: '192.168.0.243',
            port: 3001
        });

        // Add all routes
        routes.forEach(r => server.route(r))

        return server.start()
            .then(
                resp => server
            )
    }


};

module.exports = { initHapi }
