import scrapUtils = require('../utils/scrap-utils');

exports.getTabById = {
    method: 'GET',
    path: '/{hrefArtistId}/{hrefSongId}',
    handler: async (request, h) => {
        const { hrefArtistId, hrefSongId } = request.params;

        const hrefTabId = `${hrefArtistId}/${hrefSongId}`;

        const tab = await scrapUtils.getCompleteTabById(hrefTabId);

        return tab;
    }
}

exports.getQuantityTabById = {
    method: 'GET',
    path: '/quantity/{hrefArtistId}/{hrefSongId}',
    handler: async (request, h) => {
        const { hrefArtistId, hrefSongId } = request.params;

        const hrefTabId = `${hrefArtistId}/${hrefSongId}`;

        const cant = await scrapUtils.getQuantityTabById(hrefTabId);

        return cant;
    }
}