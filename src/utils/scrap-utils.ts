import { get } from 'request-promise';
import ScrapResponse from '../models/scrapResponse';

const baseUrl = 'https://acordes.lacuerda.net';
const $ = require('cheerio');



/**
 * Obtener una tab con textos 
 * @param {*} hrefSongId ejemplo: En https://acordes.lacuerda.net/enanitos/amores_lejanos-7.shtml sería enanitos/amores_lejanos-7
 */
export const getCompleteTabById = (hrefSongId: String): Promise<ScrapResponse> =>
    get(`${baseUrl}/${hrefSongId}.shtml`)
        .then(
            html => {
                const preElement = $('pre', html);

                return { body: preElement.text(), statusCode: 200 }
            }
        )
        .catch(
            ({ message: body, statusCode }) => ({ body, statusCode })
        );


export const getQuantityTabById = (hrefSongId: String): Promise<ScrapResponse> =>
    get(`${baseUrl}/${hrefSongId}`)
        .then(
            html => {

                const rmainTrs = $('#r_main > tbody > tr', html);

                const cant: any = rmainTrs && rmainTrs.length ? 
                    rmainTrs.length - 1 : null;

                return { body: cant, statusCode: 200 }
            }
        )
        .catch(
            ({ message: body, statusCode }) => ({ body, statusCode })
        );