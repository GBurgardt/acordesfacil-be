import { get } from 'request-promise';
import ScrapResponse from '../models/scrapResponse';

const baseUrl = 'https://acordes.lacuerda.net';
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const rp = require('request-promise');

const getRequestDefault = (method, url) =>
    rp({
        encoding: null,
        method: method,
        uri: url
    }).then(html => {
        const $ = cheerio.load(
            iconv.decode(
                new Buffer(html), "ISO-8859-1"
            )
        );

        return $;
    })


/**
 * Obtener una tab con textos 
 * @param {*} hrefSongId ejemplo: En https://acordes.lacuerda.net/enanitos/amores_lejanos-7.shtml sería enanitos/amores_lejanos-7
 */
export const getCompleteTabById = (hrefSongId: String): Promise<ScrapResponse> =>
    getRequestDefault('GET', `${baseUrl}/${hrefSongId}.shtml`)
        .then(
            $ => {
                const preElement = $('pre');

                return { body: preElement.html(), statusCode: 200 }
            }
        )
        .catch(
            ({ message: body, statusCode }) => ({ body, statusCode })
        );


export const getGoogleSuggestionsBySearch = (search: String, start: number = 0): Promise<ScrapResponse> =>
    get(`https://www.google.com/search?q=${search.replace(new RegExp(' ', 'g'), '+')}+%22acordes.lacuerda.net%22&start=${start}`)
        .then(
            html => {
                const $ = cheerio;
                const domResp = $('a', html);

                let suggestions = [];

                domResp
                    .filter((i, elem) => {
                        const auxHref = $(elem).attr('href');
                        return auxHref.includes('acordes.lacuerda.net')
                    })
                    .map((i, elem) => {
                        const auxHref = $(elem).attr('href');
                        const href: string = auxHref
                            .substring(
                                auxHref.indexOf('https://acordes.lacuerda.net/') + 'https://acordes.lacuerda.net/'.length,
                                auxHref.indexOf('&sa=')
                            )
                            .replace(new RegExp('.shtml', 'g'), '')

                        const text = href
                            .split('/')
                            .map(
                                a =>
                                    a && a.length > 0 ?
                                        `${a[0].toUpperCase()}${a.slice(1)}`
                                            .replace(new RegExp('_', 'g'), ' ')
                                        :
                                        ''
                            )
                            .join(', ')

                        const songName = text
                            .substring(
                                text.indexOf(',') + 1
                            )
                            .trim()


                        if (
                            !href.includes('.lacuerda.') &&
                            !href.includes('&source') &&
                            !href.includes('&ie') &&
                            !href.includes('&ei') &&
                            !href.includes('.txt') &&
                            songName.replace(/\s/g, '').length
                        ) {
                            suggestions.push({ href, text })
                        }
                    })

                return { body: suggestions, statusCode: 200 }
            }
        )
        .catch(
            ({ message: body, statusCode }) => ({ body, statusCode })
        )


export const getQuantityTabById = (hrefSongId: String): Promise<ScrapResponse> =>
    get(`${baseUrl}/${hrefSongId}`)
        .then(
            html => {
                const $ = cheerio;
                const rmainTrs = $('#r_main > tbody > tr', html);

                const cant: any = rmainTrs && rmainTrs.length ?
                    rmainTrs.length - 1 : null;

                return { body: cant, statusCode: 200 }
            }
        )
        .catch(
            ({ message: body, statusCode }) => ({ body, statusCode })
        );
