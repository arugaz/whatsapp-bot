const sharp = require('sharp')
const { fromBuffer } = require('file-type')

/**
 * Resize image to buffer or base64
 * @param  {Buffer} bufferdata
 * @param  {Boolean} encode
 * @param  {String} mimType
 */
// eslint-disable-next-line no-async-promise-executor
module.exports = resizeImage = (buff, encode) => new Promise(async (resolve, reject) => {
    console.log('Resizeing image...')
    const { mime } = await fromBuffer(buff)
    sharp(buff, { failOnError: false })
        .resize(512, 512)
        .toBuffer()
        .then(resizedImageBuffer => {
            if (!encode) return resolve(resizedImageBuffer)
            console.log('Create base64 from resizedImageBuffer...')
            const resizedImageData = resizedImageBuffer.toString('base64')
            const resizedBase64 = `data:${mime};base64,${resizedImageData}`
            resolve(resizedBase64)
        })
        .catch(error => reject(error))
})
