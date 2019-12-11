import { simpleQuery, defaultRequest, defaultResponse } from '../utils/database-utils';

exports.createUser = {
    path: '/user',
    handler: async (request, h) => {

        const { username } = request.payload;

        return simpleQuery(`insert into users values ('${username}');`)
            .then(
                (res: any) => 
                    res && res.affectedRows && res.affectedRows > 0 ?
                        defaultResponse('Usuario creado con exito'):
                        defaultResponse('Hubo algun problema', -1)

            )
            .catch(
                err => {
                    return defaultResponse(err.message, -1);
                }
            )
    }
    ,
    ...defaultRequest,
    method: 'POST'
}

exports.getUser = {
    path: '/user/{username}',
    handler: async (request, h) => {

        const { username } = request.params;

        return simpleQuery(`select * from users where username = '${username}'`)
            .then(
                (res: any) => res && res.length > 0 ?
                    defaultResponse('Usuario encontrado', 0, res) :
                    defaultResponse('Usuario no encontrado', -1)
                    
            )
            .catch(
                err => {
                    return defaultResponse(err.message, -1);
                }
            )
    }
    ,
    ...defaultRequest
}

exports.createFavorite = {
    path: '/favorite',
    handler: async (request, h) => {

        const { href } = request.payload;
        const { username } = request.payload;
        const { description } = request.payload;

        const now = new Date();
        const mysqlNow = now.toISOString().slice(0, 19).replace('T', ' ');
        console.log(mysqlNow);

        return simpleQuery(`insert into favorites values ('${href}', '${username}', '${description}', '${mysqlNow}');`)
            .then(
                (res: any) => 
                    res && res.affectedRows && res.affectedRows > 0 ?
                        defaultResponse('Favorito creado con exito', 0, res):
                        defaultResponse('Hubo algun problema', -1, res)
                

            )
            .catch(
                err => {
                    return defaultResponse(err.message, -1);
                }
            )
    }
    ,
    ...defaultRequest,
    method: 'POST'
}

exports.getUserFavorites = {
    path: '/favorite/user/{username}',
    handler: async (request, h) => {

        const { username } = request.params;

        return simpleQuery(`select * from favorites where username = '${username}' order by creationTime desc`)
            .then(
                (res: any) => 
                    defaultResponse('Lista de favoritos', 0, res)

            )
            .catch(
                err => {
                    return defaultResponse(err.message, -1);
                }
            )
    }
    ,
    ...defaultRequest
}

exports.deleteFavorite = {
    path: '/favorite',
    handler: async (request, h) => {

        const { href, username } = request.payload;
        
        return simpleQuery(`delete from favorites where href = '${href}' and username = '${username}'`)
            .then(
                (res: any) => 
                    res && res.affectedRows && res.affectedRows > 0 ?
                        defaultResponse('Favorito borrado con exito', 0, res):
                        defaultResponse('Hubo algun problema', -1, res)
                

            )
            .catch(
                err => {
                    return defaultResponse(err.message, -1);
                }
            )
    }
    ,
    ...defaultRequest,
    method: 'DELETE'
}