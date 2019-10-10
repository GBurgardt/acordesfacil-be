// import * as hapi from "hapi";
import hapi = require('@hapi/hapi');


const initHapi = (routes, tls?) => {
    // Config events
    process.on('unhandledRejection', (err) => {
        console.log(err);
        process.exit(1);
    });

    if (tls) {
        const server: hapi.Server = new hapi.Server();

        server.connection({
            address: '0.0.0.0',
            port: 3000,
            tls: tls
        })
        server.connection({
            address: '0.0.0.0',
            port: 3003
        })

        //faf

        // Add all routes
        routes.forEach(r => server.route(r))

        return server.start()
            .then(
                resp => server
            )
    } else {

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
    }


};

module.exports = { initHapi }
