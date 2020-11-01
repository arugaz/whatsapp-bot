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

 /**
 *
 * @param  {String} 
 * @param  {String}
 * @param  {String}
 * 
 */

 const quote = async (quotes, author , type) => new Promise((resolve, reject) => {
     const q = quotes.replace(/ /g, '%20').replace('\n','%5Cn')
     fetchJson('https://terhambar.com/aw/qts/?kata=' + q + '&author=' + author + '&tipe=' + type + '/')
        .then((res) => {
            resolve(res.result)
     })
        .catch((err) => {
            console.error(err)
             reject(err)
     })
     
 })

module.exports = {
    fdci,
    quote
}
