import scrapUtils = require('../utils/scrap-utils');

const defaultRequest = {
    method: 'GET',
    config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
}

exports.getTabById = {
    path: '/{hrefArtistId}/{hrefSongId}',
    handler: async (request, h) => {
        const { hrefArtistId, hrefSongId } = request.params;

        const hrefTabId = `${hrefArtistId}/${hrefSongId}`;

        const tab = await scrapUtils.getCompleteTabById(hrefTabId);

        return tab;
    },
    ...defaultRequest
}

exports.getQuantityTabById = {
    path: '/quantity/{hrefArtistId}/{hrefSongId}',
    handler: async (request, h) => {
        const { hrefArtistId, hrefSongId } = request.params;
        const hrefTabId = `${hrefArtistId}/${hrefSongId}`;
        const cant = await scrapUtils.getQuantityTabById(hrefTabId);
        return cant;
    },
    ...defaultRequest
}


exports.getGoogleChords = {
    path: '/google/{search}',
    handler: async (request, h) => {
        const { search } = request.params;

        const suggestions = await scrapUtils.getGoogleSuggestionsBySearch(search);

        return suggestions;
    },
    ...defaultRequest
}