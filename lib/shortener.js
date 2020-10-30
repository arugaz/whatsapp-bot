const { fetchText } = require('../utils/fetcher')

/**
 * Create shorturl
 *
 * @param  {String} url
 */
module.exports = shortener = (url) => new Promise((resolve, reject) => {
    console.log('Creating short url...')
    fetchText(`https://tinyurl.com/api-create.php?url=${url}`)
        .then((text) => resolve(text))
        .catch((err) => reject(err))
})
