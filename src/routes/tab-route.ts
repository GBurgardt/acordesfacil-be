import scrapUtils = require('../utils/scrap-utils');
import databaseUtils = require('../utils/database-utils');
import { defaultRequest } from '../utils/database-utils';


exports.getGoogleChords = {
    path: '/google',
    handler: async (request, h) => {
        const { search, start } = request.query;

        if (!search) {
            return null
        }

        const suggestions = await scrapUtils.getGoogleSuggestionsBySearch(search, start);


        console.log(suggestions)

        return suggestions;
    },
    ...defaultRequest
}


exports.getTabById = {
    path: '/{hrefArtistId}/{hrefSongId}',
    handler: async (request, h) => {
        const { hrefArtistId, hrefSongId } = request.params;

        const hrefTabId = `${hrefArtistId}/${hrefSongId}`;

        const tab = await databaseUtils.getCompleteTabById(hrefTabId);

        return tab;
    },
    ...defaultRequest
}


















// exports.getTabByLaCuerdaIdAndTone = {
//     path: '/cuerda/{laCuerdaId}/{tone}',
//     handler: async (request, h) => {
//         const { laCuerdaId, tone } = request.params;

//         const tab = await scrapUtils.getCompleteTabByLaCuerdaIdAndTone(laCuerdaId, tone);

//         return tab;
//     },
//     ...defaultRequest
// }

// exports.getQuantityTabById = {
//     path: '/quantity/{hrefArtistId}/{hrefSongId}',
//     handler: async (request, h) => {
//         const { hrefArtistId, hrefSongId } = request.params;
//         const hrefTabId = 
//             `${hrefArtistId}/${hrefSongId}`.includes('-') ?
//                 `${hrefArtistId}/${hrefSongId}`.substring(
//                     0, `${hrefArtistId}/${hrefSongId}`.indexOf('-')
//                 ) : 
//                 `${hrefArtistId}/${hrefSongId}`
//         const cant = await scrapUtils.getQuantityTabById(hrefTabId);
//         return cant;
//     },
//     ...defaultRequest
// }


