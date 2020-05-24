import { get } from 'request-promise';
import ScrapResponse from '../models/scrapResponse';
import { SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG } from 'constants';

const baseUrl = 'https://acordes.lacuerda.net';
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const rp = require('request-promise');

const getScrapRequest = (method, url) =>
    rp({
        encoding: null,
        method: method,
        uri: url
    }).then(html => {
        // const $ = cheerio.load(
        //     iconv.decode(
        //         new Buffer(html), "ISO-8859-1"
        //     )
        // );
        const $ = cheerio.load(
            iconv.decode(
                new Buffer(html), "UTF-8"
            ),
            { decodeEntities: false }
        );

        return $;
    })

const getNormalRequest = (method, url) =>
    rp({
        method: method,
        uri: url
    }).then(
        resp => {
            try {
                return JSON.parse(resp);
            } catch(err) {
                return resp
            }
        }
    )
    .catch(
        err => {
            console.log(err)
        }
    )


/**
 * Obtener una tab con textos 
 * @param {*} hrefSongId ejemplo: En https://acordes.lacuerda.net/enanitos/amores_lejanos-7.shtml sería enanitos/amores_lejanos-7
 */
export const getCompleteTabById = (hrefSongId: String): Promise<ScrapResponse> =>
    getScrapRequest('GET', `${baseUrl}/${hrefSongId}.shtml`)
        .then(
            $ => {
                    
                const auxScriptCode = $('head script');

                const auxcac = auxScriptCode.toString();
                const code = auxcac
                    .substring(
                        auxcac.indexOf(`ocod='`) + `ocod='`.length,
                        auxcac.indexOf(', odes') - 1
                    )

                const preElement = $('#t_body pre');

                return { 
                    body: {
                        pre: preElement.html(),
                        laCuerdaId: code
                    }, 
                    statusCode: 200 
                }
            }
        )
        .catch(
            ({ message: body, statusCode }) => ({ body, statusCode })
        );

/**
 * Obtener una tab dado su laCuerdaId y su tono 
 */
export const getCompleteTabByLaCuerdaIdAndTone = (laCuerdaId: String, tone: String): Promise<ScrapResponse> =>
    getNormalRequest('GET', `https://acordes.lacuerda.net/TRAN/procTran.php?codigo=${laCuerdaId}&action=newact&reqn=0&reqo=${tone}`)
        .then(
            resp => ({ 
                body: 
                    resp && resp.body ?
                        {
                            ...resp,
                            laCuerdaId,
                            pre: cheerio.load(
                                resp.body
                            )('pre').html()
                        } : 
                        {
                            pre: null,
                            laCuerdaId: null
                        }, 
                statusCode: 200 
            })
        )
        .catch(
            ({ message: body, statusCode }) => {
                console.log(body)
                return { body, statusCode }
            }
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



/**
 * Obtener tab en tonalidad orgiinal
 */
export const getOriginalTab = (laCuerdaId: String, tone: String): Promise<ScrapResponse> =>
    getNormalRequest('GET', `https://acordes.lacuerda.net/TRAN/procTran.php?codigo=${laCuerdaId}&action=newact&reqn=0&reqo=${tone}`)
        .then(
            resp => ({ 
                body: 
                    resp && resp.body ?
                        {
                            ...resp,
                            laCuerdaId,
                            pre: cheerio.load(
                                resp.body
                            )('pre').html()
                        } : 
                        {
                            pre: null,
                            laCuerdaId: null
                        }, 
                statusCode: 200 
            })
        )
        .catch(
            ({ message: body, statusCode }) => {
                console.log(body)
                return { body, statusCode }
            }
        );