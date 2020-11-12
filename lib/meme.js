const { fetchJson, fetchBase64 } = require('../utils/fetcher')
const fs = require('fs-extra')
const {
    apiSS
} = JSON.parse(fs.readFileSync('./settings/api.json'))

/**
 * Get meme from random subreddit
 *
 * @param  {String} _subreddit
 * @return  {Promise} Return meme from dankmemes, wholesomeanimemes, wholesomememes, AdviceAnimals, MemeEconomy, memes, terriblefacebookmemes, teenagers, historymemes
 */
const random = async (_subreddit) => new Promise((resolve, reject) => {
    const subreddits = ['dankmemes', 'wholesomeanimemes', 'wholesomememes', 'AdviceAnimals', 'MemeEconomy', 'memes', 'terriblefacebookmemes', 'teenagers', 'historymemes', 'okbuddyretard', 'nukedmemes']
    const randSub = subreddits[Math.random() * subreddits.length | 0]
    console.log('looking for memes on ' + randSub)
    fetchJson('https://meme-api.herokuapp.com/gimme/' + randSub)
        .then((result) => resolve(result.url))
        .catch((err) => {
            console.error(err)
            reject(err)
        })
})

/**
 * create custom meme
 * @param  {String} imageUrl
 * @param  {String} topText
 * @param  {String} bottomText
 */
const custom = async (imageUrl, top, bottom) => new Promise((resolve, reject) => {
    topText = top.trim().replace(/\s/g, '_').replace(/\?/g, '~q').replace(/\%/g, '~p').replace(/\#/g, '~h').replace(/\//g, '~s')
    bottomText = bottom.trim().replace(/\s/g, '_').replace(/\?/g, '~q').replace(/\%/g, '~p').replace(/\#/g, '~h').replace(/\//g, '~s')
    fetchBase64(`https://api.memegen.link/images/custom/${topText}/${bottomText}.png?background=${imageUrl}`, 'image/png')
        .then((result) => resolve(result))
        .catch((err) => {
            console.error(err)
            reject(err)
        })
})

const ss = async (url) => new Promise((resolve, reject) => {
    fetchBase64(`https://api.apiflash.com/v1/urltoimage?access_key=${apiSS}&url=${url}`)
    .then((res) => {
        resolve(res)
    })
    .catch((err) => {
        reject(err)
    })
})

module.exports = {
    random,
    custom,
    ss
}
