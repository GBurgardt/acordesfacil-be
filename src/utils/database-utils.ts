const mysql = require('mysql');

const pool = mysql.createPool({
    // host: "acordesfacil.tk",
    host: "acordesfacil.crabdance.com",
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database : 'acordesfacilDB',
    connectionLimit : 10
});


export const simpleQuery = (query) =>
    new Promise(
        (resolve, reject) => 
            pool.query(
                query,
                (err, result, fields) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result)
                    }
                }
            )
    )


export const defaultRequest = {
    method: 'GET',
    config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
}
export const defaultResponse = (message, status = 0, body = null) => ({
    status,
    message,
    body
})
