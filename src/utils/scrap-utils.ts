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

export const getGoogleSuggestionsBySearchOld = (search: String): Promise<ScrapResponse> =>
    get(`https://www.google.com/search?q=${search.replace(new RegExp(' ', 'g'), '+')}+la+cuerda`) 
        .then(
            html => {
                console.log(`https://www.google.com/search?q=${search.replace(new RegExp(' ', 'g'), '+')}+la+cuerda`)
                const domResp = $('.BNeawe .v9i61e a', html);

                let suggestions = [];

                domResp.map((i, elem) => {

                    const auxHref = $(elem).attr('href');
                    const href = auxHref.substring(
                        7,
                        auxHref.indexOf('&sa=')
                    )

                    suggestions.push({
                        href,
                        text: $(elem).text()
                    })
                });

                return { body: suggestions, statusCode: 200 }
            }
        )
        .catch(
            ({ message: body, statusCode }) => ({ body, statusCode })
        )


export const getGoogleSuggestionsBySearch = (search: String): Promise<ScrapResponse> =>
    get(`https://www.google.com/search?q=${search.replace(new RegExp(' ', 'g'), '+')}+la+cuerda`) 
        .then(
            html => {
                
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

                        suggestions.push({ href, text })
                    });

                return { body: suggestions, statusCode: 200 }
            }
        )
        .catch(
            ({ message: body, statusCode }) => ({ body, statusCode })
        )