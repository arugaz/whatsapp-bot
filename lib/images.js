const { default: fetch } = require('node-fetch')
const { fetchJson } = require('../utils/fetcher')

/**
 *
 * @param  {String} query
 *
 */

 const fdci = async (wall) => new Promise((resolve, reject) => {
     fetchJson('http://api.fdci.se/rep.php?gambar=' + wall)
        .then((result) => {
            const andwall = Math.floor(Math.random() * 41)
            resolve(result[andwall])
        })
        .catch((err) => {
            console.error(err)
            reject(err)
        })
 })

module.exports = {
    fdci
}
