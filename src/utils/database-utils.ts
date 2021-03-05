const mysql = require('mysql');

const pool = mysql.createPool({
    // host: "acordesfacil.tk",
    // host: "acordesfacil.crabdance.com",
    host: "localhost",
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    // database : 'acordesfacilDB',
    database : 'acordesfacil',
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

/////////////////////////////////////////////////////////////////////////////////////
///// ######################################################################### /////
/////////////////////////////////////////////////////////////////////////////////////

export const getCompleteTabById = (href) => 
    simpleQuery(`select * from tablatures where href = '/${href}'`)
        .then(
            (res: any) => ({
                body: res[0],
                statusCode: 200
            })  
        )
        .catch(
            err => {
                console.log("err")
                console.log(err)
                console.log("err fin")
                return defaultResponse(err.message, -1);
            }
        )

// exports.getUser = {
//     path: '/user/{username}',
//     handler: async (request, h) => {

//         const { username } = request.params;

//         return simpleQuery(`select * from users where username = '${username}'`)
//             .then(
//                 (res: any) => res && res.length > 0 ?
//                     defaultResponse('Usuario encontrado', 0, res) :
//                     defaultResponse('Usuario no encontrado', -1)
                    
//             )
//             .catch(
//                 err => {
//                     return defaultResponse(err.message, -1);
//                 }
//             )
//     }
//     ,
//     ...defaultRequest
// }