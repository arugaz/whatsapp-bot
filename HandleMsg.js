require('dotenv').config()
const { decryptMedia } = require('@open-wa/wa-automate')

const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')
const axios = require('axios')
const fetch = require('node-fetch')
const { wallpaperanime, lolie, liriklagu, nekonime, hentai, trap, nfswneko } =  require('./lib/functions')
const _ = require('lodash')
const { getGombal } = require("./api/getGombal");
const { getZodiak } = require('./src/zodiak');
const { ramalanCinta } = require('./src/ramalan');
const { 
    removeBackgroundFromImageBase64
} = require('remove.bg')

const {
    exec
} = require('child_process')

const { 
    menuId, 
    cekResi, 
    urlShortener, 
    meme, 
    translate, 
    getLocationData,
    images,
    resep,
    rugapoi,
    rugaapi
} = require('./lib')

const { 
    msgFilter, 
    color, 
    processTime, 
    isUrl
} = require('./utils')

const { uploadImages } = require('./utils/fetcher')

const fs = require('fs-extra')
const banned = JSON.parse(fs.readFileSync('./settings/banned.json'))
const { 
    ownerNumber, 
    groupLimit, 
    memberLimit,
    prefix
} = JSON.parse(fs.readFileSync('./settings/setting.json'))
const {
    apiNoBg
} = JSON.parse(fs.readFileSync('./settings/api.json'))

module.exports = HandleMsg = async (kris, message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
        let { body } = message
        var { name, formattedTitle } = chat
        let { pushname, verifiedName, formattedName } = sender
		const blockNumber = await kris.getBlockedIds()
        pushname = pushname || verifiedName || formattedName // verifiedName is the name of someone who uses a business account
        const botNumber = await kris.getHostNumber() + '@c.us'
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await kris.getGroupAdmins(groupId) : ''
        const isGroupAdmins = groupAdmins.includes(sender.id) || false
        const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
        const isOwnerBot = ownerNumber == sender.id
        const commandArgs = caption || body || '';
  const args1 = commandArgs.split(' ')[1];
  const args2 = commandArgs.split(' ')[2];
  const args3 = commandArgs.split(' ')[3];
  const args4 = commandArgs.split(' ')[4];
        const isBanned = banned.includes(sender.id)
		const isBlocked = blockNumber.includes(sender.id)
		if (isBlocked) return

        // Bot Prefix
        body = (type === 'chat' && body.startsWith(prefix)) ? body : ((type === 'image' && caption || type === 'video' && caption) && caption.startsWith(prefix)) ? caption : ''
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
        const arg = body.trim().substring(body.indexOf(' ') + 1)
        const args = body.trim().split(/ +/).slice(1)
        const isCmd = body.startsWith(prefix)
        const uaOverride = process.env.UserAgent
        const url = args.length !== 0 ? args[0] : ''
        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
	    const isQuotedVideo = quotedMsg && quotedMsg.type === 'video'

        // [BETA] Avoid Spam Message
        if (isCmd && msgFilter.isFiltered(from) && !isGroupMsg) { return console.log(color('[SPAM]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname)) }
        if (isCmd && msgFilter.isFiltered(from) && isGroupMsg) { return console.log(color('[SPAM]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle)) }
        //
        if (!isCmd) { return }
        if (isCmd && !isGroupMsg) { console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname)) }
        if (isCmd && isGroupMsg) { console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle)) }
        
		// [BETA] Avoid Spam Message
        msgFilter.addFilter(from)

        if (isBanned) {
            return console.log(color('[BAN]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
        }
        switch (command) {
        // Menu and TnC
        case 'speed':
        case 'ping':
            await kris.sendText(from, `Pong!!!!\nSpeed: ${processTime(t, moment())} _Second_`)
            break
        case 'tnc':
            await kris.sendText(from, menuId.textTnC())
            break
        case 'menu':
        case 'help':
            await kris.sendText(from, menuId.textMenu(pushname))
            .then(() => ((isGroupMsg) && (isGroupAdmins)) ? kris.sendText(from, `Menu Admin Grup: *${prefix}menuadmin*`) : null)
            break
        case 'menuadmin':
            if (!isGroupMsg) return kris.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
            if (!isGroupAdmins) return kris.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
            await kris.sendText(from, menuId.textAdmin())
            break
        case 'donate':
        case 'donasi':
            await kris.sendText(from, menuId.textDonasi())
            break
        case 'ownerbot':
            await kris.sendContact(from, ownerNumber)
            .then(() => kris.sedText(from, 'Hanya untuk melapor Masalah BOT atau req Fitur!'))
            break
        case 'join':
            if (args.length == 0) return kris.reply(from, `Jika kalian ingin mengundang bot kegroup silahkan invite atau dengan\nketik ${prefix}join [link group]`, id)
            let linkgrup = body.slice(6)
            let islink = linkgrup.match(/(https:\/\/chat.whatsapp.com)/gi)
            let chekgrup = await kris.inviteInfo(linkgrup)
            if (!islink) return kris.reply(from, 'Maaf link group-nya salah! silahkan kirim link yang benar', id)
            if (isOwnerBot) {
                await kris.joinGroupViaLink(linkgrup)
                      .then(async () => {
                          await kris.sendText(from, 'Berhasil join grup via link!')
                          await kris.sendText(chekgrup.id, `Hai semuanya salam kenal, saya adalah SPL-BOT. Untuk mengetahui command dari Bot silahkan kirim ${prefix}menu`)
                      })
            } else {
                let cgrup = await kris.getAllGroups()
                if (cgrup.length > groupLimit) return kris.reply(from, `Sorry, the group on this bot is full\nMax Group is: ${groupLimit}`, id)
                if (cgrup.size < memberLimit) return kris.reply(from, `Sorry, BOT wil not join if the group members do not exceed ${memberLimit} people`, id)
                await kris.joinGroupViaLink(linkgrup)
                      .then(async () =>{
                          await kris.reply(from, 'Berhasil join grup via link!', id)
                      })
                      .catch(() => {
                          kris.reply(from, 'Gagal!', id)
                      })
            }
            break

		//Fitur KRIS
		case 'toimg':
            if (args.length === 2) return kris.reply(from, `Hallo ${pushname} untuk menggunakan fitur sticker to image, Stickernya Di Tag ya Beb! dan kirim pesan *!toimg*`, id)
            if (quotedMsg) {
                kris.reply(from, '_Mohon tunggu ya Beb, sedang mengkonversi stiker kamu 😋', id)
                if( quotedMsg.type === 'sticker') {
                //getStickerDecryptable is an insiders feature! 
                    //let stickerDecryptable = await kris.getStickerDecryptable(quotedMsg.id)
                    //if(stickerDecryptable) mediaData = await decryptMedia(stickerDecryptable, uaOverride)
                   // await kris.sendImage(from, `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`, `${pushname}.jpg`, `Sticker berhasil dikonversi! ${pushname}`)
                   //    } else {
                        mediaData = await decryptMedia(quotedMsg, uaOverride)
                        await kris.sendImage(from, `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`, `${pushname}.jpg`, `Sukses Menkonversi Stiker Kamu 😋! ${pushname}`)
                   //  
                   } else {
                        kris.reply(from, `We Udin ${pushname} Stickernya yg di Tag , Stickernya Di Tag ya Beb! dan kirim pesan *!toimg*`, id)
                   }
                } else {
                    kris.reply(from, `We Udin ${pushname} Stickernya yg di Tag , Stickernya Di Tag ya Beb! dan kirim pesan *!toimg*`, id)
                }
            break
		case 'wanime':
                        const __result = await wallpaperanime()
						kris.sendText(from, '⏳ Tunggu sebentar ya beb . .⏳')
                        kris.sendFileFromUrl(from, __result, '', 'Gimana Kak?😋', id)
                    break
		case 'loli':
                        const resultas = await lolie()
						kris.sendText(from, '⏳ Tunggu sebentar ya beb . .⏳')
						kris.sendFileFromUrl(from, resultas, '', 'Ini Lolinya Kak😋', id)
                    break
		case 'nekoanime':
                        const resultase = await nekonime()
						kris.sendText(from, '⏳ Sabar, lagi nyari ya beb . .⏳')
						kris.sendFileFromUrl(from, resultase, '', 'Gimana Kak?😋', id)
                    break
		case 'animehentai':
                        const resultases = await hentai()
						kris.sendText(from, '⏳ Sabar, lagi nyari ya beb . .⏳')
						kris.sendFileFromUrl(from, resultases, '', 'Gimana Kak?😋', id)
                    break
		case 'trapanime':
                        const resultasese = await trap()
						kris.sendText(from, '⏳ Sabar, lagi nyari ya beb . .⏳')
						kris.sendFileFromUrl(from, resultasese, '', 'Gimana Kak?😋', id)
                    break
		case 'nsfneko':
                        const resultaseses = await nfswneko()
						kris.sendText(from, '⏳ Sabar, lagi nyari ya beb . .⏳')
						kris.sendFileFromUrl(from, resultaseses, '', 'Gimana Kak?😋', id)
                    break
		case 'wahorror':
            kris.sendFileFromUrl(from, 'https://source.unsplash.com/1280x720/?horror','wp.jpeg').catch(err => console.log('[ERROR] send image'))
			break
		case 'slap':
            arg = body.trim().split(' ')
            const person = author.replace('@c.us', '')
            await kris.sendGiphyAsSticker(from, 'https://media.giphy.com/media/S8507sBJm1598XnsgD/source.gif')
            kris.sendTextWithMentions(from, '@' + person + ' *slapped* ' + arg[1])
            break
		case 'hug':
            arg = body.trim().split(' ')
            const man = botNumber.replace('@c.us', '')
            await kris.sendGiphyAsSticker(from, 'https://media.giphy.com/media/JGNmo9nBmmy8U/giphy.gif')
            kris.sendTextWithMentions(from, '@' + man + ' *hug* ' + arg[1])
			break
		case 'kicked':
            arg = body.trim().split(' ')
            const manu = botNumber.replace('@c.us', '')
            await kris.sendGiphyAsSticker(from, 'https://media.giphy.com/media/WRJKR8mGQDhPq/giphy.gif')
            kris.sendTextWithMentions(from, '@' + manu + ' *Kick* ' + arg[1] + ' *ass*' )
			break
		case 'pictquote' :
			kris.sendText(from, '⏳ Tunggu sebentar ya beb . .⏳')
            const aiquote = await axios.get("http://inspirobot.me/api?generate=true")
            await kris.sendFileFromUrl(from, aiquote.data, 'quote.jpg', 'Here the Result🧡' , id )
            break
		case 'bucin':
        case 'gombal':
                kris.reply(from, await getGombal(), id);
                break
		case 'linkgrup':
        case 'linkgroup':
            if (!isBotGroupAdmins) return kris.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
            if (isGroupMsg) {
                const inviteLink = await kris.getGroupInviteLink(groupId);
                kris.sendLinkWithAutoPreview(from, inviteLink, `\nLink group *${name}*`)
            } else {
            	kris.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            }
            break
		case 'listadmin':
        case 'adminlist':
            if (!isGroupMsg) return kris.reply(from, 'ᴍᴏʜᴏɴ ᴍᴀᴀꜰ, ᴋᴀʀᴇɴᴀ ꜰɪᴛᴜʀ ɪɴɪ ʜᴀɴʏᴀ ᴛᴇʀꜱᴇᴅɪᴀ ᴅɪ ɢʀᴏᴜᴘ', id)
            let mimin = ''
            for (let admon of groupAdmins) {
                mimin += `⚜ @${admon.replace(/@c.us/g, '')}\n` 
            }
            await kris.sendTextWithMentions(from, `*Menampilkan list admin*\n\n${mimin}`)
            break
		case 'ownergroup':
            if (!isGroupMsg) return kris.reply(from, 'ᴍᴏʜᴏɴ ᴍᴀᴀꜰ, ᴋᴀʀᴇɴᴀ ꜰɪᴛᴜʀ ɪɴɪ ʜᴀɴʏᴀ ᴛᴇʀꜱᴇᴅɪᴀ ᴅɪ ɢʀᴏᴜᴘ', id)
            const Owner_ = chat.groupMetadata.owner
            await kris.sendTextWithMentions(from, `Owner Group : @${Owner_}`)
            break
		case 'lirik':
        if (!isGroupMsg) return kris.reply(from, 'ᴍᴏʜᴏɴ ᴍᴀᴀꜰ, ᴋᴀʀᴇɴᴀ ꜰɪᴛᴜʀ ɪɴɪ ʜᴀɴʏᴀ ᴛᴇʀꜱᴇᴅɪᴀ ᴅɪ ɢʀᴏᴜᴘ', id)
            if (args.length == 1) return kris.reply(from, 'Kirim perintah *!lirik [optional]*, contoh *!lirik anjayani*', id)
            const lagu = body.slice(7)
            const lirik = await liriklagu(lagu)
            kris.reply(from, lirik, id)
            break
		case 'listblock':
            if (!isOwnerBot) return kris.reply(from, `Hai ${pushname} sepertinya tidak ada perintah ${args[0]} ketik *!menu* untuk melihat perintah yang tersedia`, id)
            let hih = `This is list of blocked number\nTotal : ${blockNumber.length}\n`
            for (let i of blockNumber) {
                hih += `➣ @${i.replace(/@c.us/g,'')}\n`
            }
            kris.sendTextWithMentions(from, hih, id)
            break
		case 'gambar':
        case 'wallpaper':
            if (!isGroupMsg) return kris.reply(from, 'ᴍᴏʜᴏɴ ᴍᴀᴀꜰ, ᴋᴀʀᴇɴᴀ ꜰɪᴛᴜʀ ɪɴɪ ʜᴀɴʏᴀ ᴛᴇʀꜱᴇᴅɪᴀ ᴅɪ ɢʀᴏᴜᴘ', id)
            if (args.length <= 2 || args.length == 1) return await kris.reply(from, 'Random image generator splash, bisa untuk wallpaper.\npenggunaan : *!images [halaman] [kata kunci]* contoh *!images 1 bedroom*', id)
            if (args.length > 2){
            const reqpage = args[1]
            const reqimg = args.slice(2, args.length)
            const imgurl = `https://api.unsplash.com/search/photos?page=${reqpage}&query=${reqimg}&client_id=J92b7gyJFWEdgT3z6OXZlqXovHjcn9242Ob4rKdE3uA`
            const has = await get.get(imgurl).json()
            const { total, total_pages, results } = has
            if (total > 0) {
                const total_img = between(0, results.length)
                const linkUrlFull = results[total_img].urls.full
                const shortgetFull = await get.get(`https://api.haipbis.xyz/bitly?url=${linkUrlFull}`).json()
                const hazel = `*${results[total_img].alt_description}*\n\n*Deskripsi :* ${results[total_img].description}\n*Width :* ${results[total_img].width}\n*Height :* ${results[total_img].height}\n*Link HD :* ${shortgetFull.result}\n\n_Menampilkan page ${reqpage} dari ${total_pages} halaman_`
                const outsplash = results[total_img].urls.regular
                await kris.sendFileFromUrl(from, outsplash, 'outimagesplash.jpeg', hazel, id)
                } else {
                    await kris.reply(from, `[ERROR] Gambar dengan nama ${reqimg} tidak ditemukan!`, id)
                }
            }
            break
		 case 'zodiak':
      kris.sendText(from, 'Silahkan Tunggu Sebentar ya Beb.')
      getZodiak(args1, args2)
        .then((result) => {
          kris.sendText(from, result);
          kris.sendText(from, 'Selesai ✅, donasi kesini ya paypal.me/TheSploit biar aku bisa tetep hidup, ketik *!help* buat kembali.')
        })
        .catch((error) => {
          kris.sendText(from, 'Maaf kamu salah memasukan Commandnya, ketik *!zodiak nama tgl-bulan-tahun kelahiran*| contoh : !zodiak kris 11-09-2001.')
          console.log(error.message);
        });
      break
		case 'ramalan':
       kris.sendText(from, 'Silahkan Tunggu Sebentar ya Beb.')
      ramalanCinta(args1, args2, args3, args4)
        .then((result) => {
          kris.sendText(from, result);
          kris.sendText(from, 'Selesai ✅, donasi kesini ya paypal.me/TheSploit biar aku bisa tetep hidup, ketik *!help* buat kembali');
        })
        .catch((error) => {
          kris.sendText(from, 'Maaf kamu salah memasukan Commandnya, ketik *!ramalan nama kamu tgl-bulan-tahun kelahiran nama Doi tgl-bulan-tahun kelahiran*| contoh : !ramalan kris 11-09-2001 anggun 11-09-2001.');
          console.log(error.message);
        });
      break
		
        // Sticker Creator
        case 'sticker':
        case 'stiker':
            if ((isMedia || isQuotedImage) && args.length === 0) {
                const encryptMedia = isQuotedImage ? quotedMsg : message
                const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
                const mediaData = await decryptMedia(encryptMedia, uaOverride)
                const imageBase64 = `data:${_mimetype};base64,${mediaData.toString('base64')}`
                kris.sendImageAsSticker(from, imageBase64)
                .then(() => {
                    kris.reply(from, 'Udah jadi ya Stickernya😇')
                    console.log(`Sticker Processed for ${processTime(t, moment())} Second`)
                })
            } else if (args[0] === 'nobg') {
                if (isMedia || isQuotedImage) {
                    try {
                    var mediaData = await decryptMedia(message, uaOverride)
                    var imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                    var base64img = imageBase64
                    var outFile = './media/noBg.png'
		            // kamu dapat mengambil api key dari website remove.bg dan ubahnya difolder settings/api.json
                    var result = await removeBackgroundFromImageBase64({ base64img, apiKey: apiNoBg, size: 'auto', type: 'auto', outFile })
                    await fs.writeFile(outFile, result.base64img)
                    await kris.sendImageAsSticker(from, `data:${mimetype};base64,${result.base64img}`)
                    } catch(err) {
                    console.log(err)
	   	            await kris.reply(from, 'Maaf batas penggunaan hari ini sudah mencapai maksimal', id)
                    }
                }
            } else if (args.length === 1) {
                if (!isUrl(url)) { await kris.reply(from, 'Maaf, link yang kamu kirim tidak valid.', id) }
                kris.sendStickerfromUrl(from, url).then((r) => (!r && r !== undefined)
                    ? kris.sendText(from, 'Maaf, link yang kamu kirim tidak memuat gambar.')
                    : kris.reply(from, 'Udah jadi ya Stickernya😇')).then(() => console.log(`Sticker Processed for ${processTime(t, moment())} Second`))
            } else {
                await kris.reply(from, `Tidak ada gambar! Untuk menggunakan ${prefix}sticker\n\n\nKirim gambar dengan caption\n${prefix}sticker <biasa>\n${prefix}sticker nobg <tanpa background>\n\natau Kirim pesan dengan\n${prefix}sticker <link_gambar>`, id)
            }
            break
        case 'stickergif':
        case 'stikergif':
            if (isMedia || isQuotedVideo) {
                if (mimetype === 'video/mp4' && message.duration < 10 || mimetype === 'image/gif' && message.duration < 10) {
                    var mediaData = await decryptMedia(message, uaOverride)
                    kris.reply(from, '[WAIT] Sedang di proses⏳ silahkan tunggu ± 1 min!', id)
                    var filename = `./media/stickergif.${mimetype.split('/')[1]}`
                    await fs.writeFileSync(filename, mediaData)
                    await exec(`gify ${filename} ./media/stickergf.gif --fps=30 --scale=240:240`, async function (error, stdout, stderr) {
                        var gif = await fs.readFileSync('./media/stickergf.gif', { encoding: "base64" })
                        await kris.sendImageAsSticker(from, `data:image/gif;base64,${gif.toString('base64')}`)
                        .catch(() => {
                            kris.reply(from, 'Maaf filenya terlalu besar!', id)
                        })
                    })
                  } else {
                    kris.reply(from, `[❗] Kirim gif dengan caption *${prefix}stickergif* max 10 sec!`, id)
                   }
                } else {
		    kris.reply(from, `[❗] Kirim gif dengan caption *${prefix}stickergif*`, id)
	        }
            break
        case 'stikergiphy':
        case 'stickergiphy':
            if (args.length !== 1) return kris.reply(from, `Maaf, format pesan salah.\nKetik pesan dengan ${prefix}stickergiphy <link_giphy>`, id)
            const isGiphy = url.match(new RegExp(/https?:\/\/(www\.)?giphy.com/, 'gi'))
            const isMediaGiphy = url.match(new RegExp(/https?:\/\/media.giphy.com\/media/, 'gi'))
            if (isGiphy) {
                const getGiphyCode = url.match(new RegExp(/(\/|\-)(?:.(?!(\/|\-)))+$/, 'gi'))
                if (!getGiphyCode) { return kris.reply(from, 'Gagal mengambil kode giphy', id) }
                const giphyCode = getGiphyCode[0].replace(/[-\/]/gi, '')
                const smallGifUrl = 'https://media.giphy.com/media/' + giphyCode + '/giphy-downsized.gif'
                kris.sendGiphyAsSticker(from, smallGifUrl).then(() => {
                    kris.reply(from, 'Udah jadi ya Stickernya😇')
                    console.log(`Sticker Processed for ${processTime(t, moment())} Second`)
                }).catch((err) => console.log(err))
            } else if (isMediaGiphy) {
                const gifUrl = url.match(new RegExp(/(giphy|source).(gif|mp4)/, 'gi'))
                if (!gifUrl) { return kris.reply(from, 'Gagal mengambil kode giphy', id) }
                const smallGifUrl = url.replace(gifUrl[0], 'giphy-downsized.gif')
                kris.sendGiphyAsSticker(from, smallGifUrl)
                .then(() => {
                    kris.reply(from, 'Udah jadi ya Stickernya😇')
                    console.log(`Sticker Processed for ${processTime(t, moment())} Second`)
                })
                .catch(() => {
                    kris.reply(from, `Ada yang error!`, id)
                })
            } else {
                await kris.reply(from, 'Maaf, command sticker giphy hanya bisa menggunakan link dari giphy.  [Giphy Only]', id)
            }
            break
        case 'meme':
            if ((isMedia || isQuotedImage) && args.length >= 2) {
                const top = arg.split('|')[0]
                const bottom = arg.split('|')[1]
                const encryptMedia = isQuotedImage ? quotedMsg : message
                const mediaData = await decryptMedia(encryptMedia, uaOverride)
                const getUrl = await uploadImages(mediaData, false)
                const ImageBase64 = await meme.custom(getUrl, top, bottom)
                kris.sendFile(from, ImageBase64, 'image.png', '', null, true)
                    .then(() => {
                        kris.reply(from, 'Ini makasih!',id)
                    })
                    .catch(() => {
                        kris.reply(from, 'Ada yang error!')
                    })
            } else {
                await kris.reply(from, `Tidak ada gambar! Silahkan kirim gambar dengan caption ${prefix}meme <teks_atas> | <teks_bawah>\ncontoh: ${prefix}meme teks atas | teks bawah`, id)
            }
            break
        case 'quotemaker':
           const qmaker = body.trim().split('|')
            if (qmaker.length >= 3) {
                const quotes = qmaker[1]
                const author = qmaker[2]
                const theme = qmaker[3]
                kris.reply(from, 'Sabar dulu ya Beb', id)
                try {
                    const hasilqmaker = await images.quote(quotes, author, theme)
                    kris.sendFileFromUrl(from, `${hasilqmaker}`, '', 'Udah jadi ya😇', id)
                } catch {
                    kris.reply('yahh proses gagal, udah bener belom isinya beb?..', id)
                }
            } else {
                kris.reply(from, `Pemakaian ${prefix}quotemaker |isi quote|author|theme\n\ncontoh: ${prefix}quotemaker |Anjayani|Kris|random\n\nuntuk theme nya pakai random ya say..`)
            }
            break
        case 'nulis':
            if (args.length == 0) return kris.reply(from, `Membuat bot menulis teks yang dikirim menjadi gambar\nPemakaian: ${prefix}nulis [teks]\n\ncontoh: ${prefix}nulis i love you 3000`, id)
            const nulisq = body.slice(7)
            const nulisp = await rugaapi.tulis(nulisq)
            await kris.sendImage(from, `${nulisp}`, '', 'Udah jadi ya Beb😇', id)
            .catch(() => {
                kris.reply(from, 'Ada yang eror!', id)
            })
            break

        //Islam Command
        case 'listsurah':
            try {
                axios.get('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/islam/surah.json')
                .then((response) => {
                   let hehex = '🔰〘 List Surah 〙🔰\n'
                    for (let i = 0; i < response.data.data.length; i++) {
                        hehex += '✎ '
                        hehex += response.data.data[i].name.transliteration.id.toLowerCase() + '\n'
                            }
                        hehex += '🔰 ╚═〘 *SPL-BOT* 〙🔰'
                    kris.reply(from, hehex, id)
                })
            } catch(err) {
                kris.reply(from, err, id)
            }
            break
        case 'infosurah':
            if (args.length == 0) return kris.reply(from, `*_${prefix}infosurah <nama surah>_*\nMenampilkan informasi lengkap mengenai surah tertentu. Contoh penggunan: ${prefix}infosurah al-baqarah`, message.id)
                var responseh = await axios.get('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/islam/surah.json')
                var { data } = responseh.data
                var idx = data.findIndex(function(post, index) {
                  if((post.name.transliteration.id.toLowerCase() == args[0].toLowerCase())||(post.name.transliteration.en.toLowerCase() == args[0].toLowerCase()))
                    return true;
                });
                var pesan = ""
                pesan = pesan + "Nama : "+ data[idx].name.transliteration.id + "\n" + "Asma : " +data[idx].name.short+"\n"+"Arti : "+data[idx].name.translation.id+"\n"+"Jumlah ayat : "+data[idx].numberOfVerses+"\n"+"Nomor surah : "+data[idx].number+"\n"+"Jenis : "+data[idx].revelation.id+"\n"+"Keterangan : "+data[idx].tafsir.id
                kris.reply(from, pesan, message.id)
              break
        case 'surah':
            if (args.length == 0) return kris.reply(from, `*_${prefix}surah <nama surah> <ayat>_*\nMenampilkan ayat Al-Quran tertentu beserta terjemahannya dalam bahasa Indonesia. Contoh penggunaan : ${prefix}surah al-baqarah 1\n\n*_${prefix}surah <nama surah> <ayat> en/id_*\nMenampilkan ayat Al-Quran tertentu beserta terjemahannya dalam bahasa Inggris / Indonesia. Contoh penggunaan : ${prefix}surah al-baqarah 1 id`, message.id)
                var responseh = await axios.get('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/islam/surah.json')
                var { data } = responseh.data
                var idx = data.findIndex(function(post, index) {
                  if((post.name.transliteration.id.toLowerCase() == args[0].toLowerCase())||(post.name.transliteration.en.toLowerCase() == args[0].toLowerCase()))
                    return true;
                });
                nmr = data[idx].number
                if(!isNaN(nmr)) {
                  var responseh2 = await axios.get('https://api.quran.sutanlab.id/surah/'+nmr+"/"+args[1])
                  var {data} = responseh2.data
                  var last = function last(array, n) {
                    if (array == null) return void 0;
                    if (n == null) return array[array.length - 1];
                    return array.slice(Math.max(array.length - n, 0));
                  };
                  bhs = last(args)
                  pesan = ""
                  pesan = pesan + data.text.arab + "\n\n"
                  if(bhs == "en") {
                    pesan = pesan + data.translation.en
                  } else {
                    pesan = pesan + data.translation.id
                  }
                  pesan = pesan + "\n\n(Q.S. "+data.surah.name.transliteration.id+":"+args[1]+")"
                  kris.reply(from, pesan, message.id)
                }
              break
        case 'tafsir':
            if (args.length == 0) return kris.reply(from, `*_${prefix}tafsir <nama surah> <ayat>_*\nMenampilkan ayat Al-Quran tertentu beserta terjemahan dan tafsirnya dalam bahasa Indonesia. Contoh penggunaan : ${prefix}tafsir al-baqarah 1`, message.id)
                var responsh = await axios.get('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/islam/surah.json')
                var {data} = responsh.data
                var idx = data.findIndex(function(post, index) {
                  if((post.name.transliteration.id.toLowerCase() == args[0].toLowerCase())||(post.name.transliteration.en.toLowerCase() == args[0].toLowerCase()))
                    return true;
                });
                nmr = data[idx].number
                if(!isNaN(nmr)) {
                  var responsih = await axios.get('https://api.quran.sutanlab.id/surah/'+nmr+"/"+args[1])
                  var {data} = responsih.data
                  pesan = ""
                  pesan = pesan + "Tafsir Q.S. "+data.surah.name.transliteration.id+":"+args[1]+"\n\n"
                  pesan = pesan + data.text.arab + "\n\n"
                  pesan = pesan + "_" + data.translation.id + "_" + "\n\n" +data.tafsir.id.long
                  kris.reply(from, pesan, message.id)
              }
              break
        case 'alaudio':
            if (args.length == 0) return kris.reply(from, `*_${prefix}ALaudio <nama surah>_*\nMenampilkan tautan dari audio surah tertentu. Contoh penggunaan : ${prefix}ALaudio al-fatihah\n\n*_${prefix}ALaudio <nama surah> <ayat>_*\nMengirim audio surah dan ayat tertentu beserta terjemahannya dalam bahasa Indonesia. Contoh penggunaan : ${prefix}ALaudio al-fatihah 1\n\n*_${prefix}ALaudio <nama surah> <ayat> en_*\nMengirim audio surah dan ayat tertentu beserta terjemahannya dalam bahasa Inggris. Contoh penggunaan : ${prefix}ALaudio al-fatihah 1 en`, message.id)
              ayat = "ayat"
              bhs = ""
                var responseh = await axios.get('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/islam/surah.json')
                var surah = responseh.data
                var idx = surah.data.findIndex(function(post, index) {
                  if((post.name.transliteration.id.toLowerCase() == args[0].toLowerCase())||(post.name.transliteration.en.toLowerCase() == args[0].toLowerCase()))
                    return true;
                });
                nmr = surah.data[idx].number
                if(!isNaN(nmr)) {
                  if(args.length > 2) {
                    ayat = args[1]
                  }
                  if (args.length == 2) {
                    var last = function last(array, n) {
                      if (array == null) return void 0;
                      if (n == null) return array[array.length - 1];
                      return array.slice(Math.max(array.length - n, 0));
                    };
                    ayat = last(args)
                  } 
                  pesan = ""
                  if(isNaN(ayat)) {
                    var responsih2 = await axios.get('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/islam/surah/'+nmr+'.json')
                    var {name, name_translations, number_of_ayah, number_of_surah,  recitations} = responsih2.data
                    pesan = pesan + "Audio Quran Surah ke-"+number_of_surah+" "+name+" ("+name_translations.ar+") "+ "dengan jumlah "+ number_of_ayah+" ayat\n"
                    pesan = pesan + "Dilantunkan oleh "+recitations[0].name+" : "+recitations[0].audio_url+"\n"
                    pesan = pesan + "Dilantunkan oleh "+recitations[1].name+" : "+recitations[1].audio_url+"\n"
                    pesan = pesan + "Dilantunkan oleh "+recitations[2].name+" : "+recitations[2].audio_url+"\n"
                    kris.reply(from, pesan, message.id)
                  } else {
                    var responsih2 = await axios.get('https://api.quran.sutanlab.id/surah/'+nmr+"/"+ayat)
                    var {data} = responsih2.data
                    var last = function last(array, n) {
                      if (array == null) return void 0;
                      if (n == null) return array[array.length - 1];
                      return array.slice(Math.max(array.length - n, 0));
                    };
                    bhs = last(args)
                    pesan = ""
                    pesan = pesan + data.text.arab + "\n\n"
                    if(bhs == "en") {
                      pesan = pesan + data.translation.en
                    } else {
                      pesan = pesan + data.translation.id
                    }
                    pesan = pesan + "\n\n(Q.S. "+data.surah.name.transliteration.id+":"+args[1]+")"
                    await kris.sendFileFromUrl(from, data.audio.secondary[0])
                    await kris.reply(from, pesan, message.id)
                  }
              }
              break
        case 'jsolat':
            if (args.length == 0) return kris.reply(from, `Untuk melihat jadwal solat dari setiap daerah yang ada\nketik: ${prefix}jsolat [daerah]\n\nuntuk list daerah yang ada\nketik: ${prefix}daerah`, id)
            const solatx = body.slice(8)
            const solatj = await rugaapi.jadwaldaerah(solatx)
            await kris.reply(from, solatj, id)
            .catch(() => {
                kris.reply(from, 'Sudah input daerah yang ada dilist?', id)
            })
            break
        case 'daerah':
            const daerahq = await rugaapi.daerah()
            await kris.reply(from, daerahq, id)
            .catch(() => {
                kris.reply(from, 'Ada yang eror!', id)
            })
            break
        //Media
        case 'instagram':
            if (args.length == 0) return kris.reply(from, `Untuk mendownload gambar atau video dari instagram\nketik: ${prefix}instagram [link_ig]`, id)
            const instag = await rugaapi.insta(args[0])
            await kris.sendFileFromUrl(from, instag, '', '', id)
            .catch(() => {
                kris.reply(from, 'Ada yang eror!', id)
            })
            break
        case 'ytmp3':
			// kris.reply(from, 'Fitur di Nonaktifkan dikarenakan Terlalu Banyak Spam, jika ingin menggunakan harap check menu !donasi', id)
            if (args.length == 0) return kris.reply(from, `Untuk mendownload lagu dari youtube\nketik: ${prefix}ytmp3 [link_yt]`, id)
            rugaapi.ytmp3(args[0])
            .then(async(res) => {
				if (res.status == 'error') return kris.sendFileFromUrl(from, `${res.link}`, '', `${res.judul}`, id)
				if (res.status == 'filesize') return kris.sendFileFromUrl(from, `${res.link}`, '', `${res.judul}`, id)
				await kris.sendFileFromUrl(from, `${res.thumb}`, '', `Youtube ditemukan\n\nJudul: ${res.judul}\n\nUkuran: ${res.size}\n\nAudio sedang dikirim`, id)
				await kris.sendFileFromUrl(from, `${res.link}`, '', '', id)
			})
			break
        case 'ytmp4':
			//kris.reply(from, 'Fitur di Nonaktifkan dikarenakan Terlalu Banyak Spam, jika ingin menggunakan harap check menu !donasi', id)
         if (args.length == 0) return kris.reply(from, `Untuk mendownload video dari youtube\nketik: ${prefix}ytmp3 [link_yt]`)
          rugaapi.ytmp4(args[0])
          .then(async(res) => {
				if (res.status == 'error') return kris.sendFileFromUrl(from, `${res.link}`, '', `${res.judul}`, id)
				if (res.status == 'filesize') return kris.sendFileFromUrl(from, `${res.link}`, '', `${res.judul}`, id)
				await kris.sendFileFromUrl(from, `${res.thumb}`, '', `Youtube ditemukan\n\nJudul: ${res.judul}\n\nUkuran: ${res.size}\n\nVideo sedang dikirim`, id)
				await kris.sendFileFromUrl(from, `${res.link}`, '', '', id)
			})
            break

        // Random Kata
        case 'fakta':
            fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/faktaunix.txt')
            .then(res => res.text())
            .then(body => {
                let splitnix = body.split('\n')
                let randomnix = splitnix[Math.floor(Math.random() * splitnix.length)]
                kris.reply(from, randomnix, id)
            })
            .catch(() => {
                kris.reply(from, 'Ada yang eror!', id)
            })
            break
        case 'katabijak':
            fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/katabijax.txt')
            .then(res => res.text())
            .then(body => {
                let splitbijak = body.split('\n')
                let randombijak = splitbijak[Math.floor(Math.random() * splitbijak.length)]
                kris.reply(from, randombijak, id)
            })
            .catch(() => {
                kris.reply(from, 'Ada yang eror!', id)
            })
            break
        case 'pantun':
            fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/pantun.txt')
            .then(res => res.text())
            .then(body => {
                let splitpantun = body.split('\n')
                let randompantun = splitpantun[Math.floor(Math.random() * splitpantun.length)]
                kris.reply(from, randompantun.replace(/kris-line/g,"\n"), id)
            })
            .catch(() => {
                kris.reply(from, 'Ada yang eror!', id)
            })
            break
        case 'quote':
            const quotex = await rugaapi.quote()
            await kris.reply(from, quotex, id)
            .catch(() => {
                kris.reply(from, 'Ada yang eror!', id)
            })
            break

        //Random Images
        case 'anime':
            if (args.length == 0) return kris.reply(from, `Untuk menggunakan ${prefix}anime\nSilahkan ketik: ${prefix}anime [query]\nContoh: ${prefix}anime random\n\nquery yang tersedia:\nrandom, waifu, husbu, neko`, id)
            if (args[0] == 'random' || args[0] == 'waifu' || args[0] == 'husbu' || args[0] == 'neko') {
                fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/anime/' + args[0] + '.txt')
                .then(res => res.text())
                .then(body => {
                    let randomnime = body.split('\n')
                    let randomnimex = randomnime[Math.floor(Math.random() * randomnime.length)]
                    kris.sendFileFromUrl(from, randomnimex, '', 'Gimana Beb?😋', id)
                })
                .catch(() => {
                    kris.reply(from, 'Ada yang eror!', id)
                })
            } else {
                kris.reply(from, `Maaf query tidak tersedia. Silahkan ketik ${prefix}anime untuk melihat list query`)
            }
            break
        case 'kpop':
            if (args.length == 0) return kris.reply(from, `Untuk menggunakan ${prefix}kpop\nSilahkan ketik: ${prefix}kpop [query]\nContoh: ${prefix}kpop bts\n\nquery yang tersedia:\nblackpink, exo, bts`, id)
            if (args[0] == 'blackpink' || args[0] == 'exo' || args[0] == 'bts') {
                fetch('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/random/kpop/' + args[0] + '.txt')
                .then(res => res.text())
                .then(body => {
                    let randomkpop = body.split('\n')
                    let randomkpopx = randomkpop[Math.floor(Math.random() * randomkpop.length)]
                    kris.sendFileFromUrl(from, randomkpopx, '', 'Gimana Beb?😋', id)
                })
                .catch(() => {
                    kris.reply(from, 'Ada yang eror!', id)
                })
            } else {
                kris.reply(from, `Maaf query tidak tersedia. Silahkan ketik ${prefix}kpop untuk melihat list query`)
            }
            break
        case 'memes':
            const randmeme = await meme.random()
            kris.sendFileFromUrl(from, randmeme, '', '', id)
            .catch(() => {
                kris.reply(from, 'Ada yang eror!', id)
            })
            break
        
        // Search Any
        case 'images':
            if (args.length == 0) return kris.reply(from, `Untuk mencari gambar di pinterest\nketik: ${prefix}images [search]\ncontoh: ${prefix}images naruto`, id)
            const cariwall = body.slice(8)
            const hasilwall = await images.fdci(cariwall)
            kris.sendFileFromUrl(from, hasilwall, '', '', id)
            .catch(() => {
                kris.reply(from, 'Ada yang eror!', id)
            })
            break
        case 'sreddit':
            if (args.length == 0) return kris.reply(from, `Untuk mencari gambar di sub reddit\nketik: ${prefix}sreddit [search]\ncontoh: ${prefix}sreddit naruto`, id)
            const carireddit = body.slice(9)
            const hasilreddit = await images.sreddit(carireddit)
            kris.sendFileFromUrl(from, hasilreddit, '', '', id)
            .catch(() => {
                kris.reply(from, 'Ada yang eror!', id)
            })
        case 'resep':
            if (args.length == 0) return kris.reply(from, `Untuk mencari resep makanan\nCaranya ketik: ${prefix}resep [search]\n\ncontoh: ${prefix}resep tahu`, id)
            const cariresep = body.slice(7)
            const hasilresep = await resep.resep(cariresep)
            kris.reply(from, hasilresep + '\n\nIni kak resep makanannya 😋..', id)
            .catch(() => {
                kris.reply(from, 'Ada yang eror!', id)
            })
            break
        case 'nekopoi':
            kris.sendText(from, `Sedang mencari video terbaru dari website nekopoi...`)
            rugapoi.getLatest()
            .then((result) => {
                rugapoi.getVideo(result.link)
                .then((res) => {
                    let heheq = '\n'
                    for (let i = 0; i < res.links.length; i++) {
                        heheq += `${res.links[i]}\n`
                    }
                    kris.reply(from, `Title: ${res.title}\n\nLink:\n${heheq}\nmasih tester bntr :v`)
                })
            })
            .catch(() => {
                kris.reply(from, 'Ada yang eror!', id)
            })
            break
        case 'stalkig':
            if (args.length == 0) return kris.reply(from, `Untuk men-stalk akun instagram seseorang\nketik ${prefix}stalkig [username]\ncontoh: ${prefix}stalkig ini.arga`, id)
            const igstalk = await rugaapi.stalkig(args[0])
            const igstalkpict = await rugaapi.stalkigpict(args[0])
            await kris.sendFileFromUrl(from, igstalkpict, '', igstalk, id)
            .catch(() => {
                kris.reply(from, 'Ada yang eror!', id)
            })
            break
        case 'wiki':
            if (args.length == 0) return kris.reply(from, `Untuk mencari suatu kata dari wikipedia\nketik: ${prefix}wiki [kata]`, id)
            const wikip = body.slice(6)
            const wikis = await rugaapi.wiki(wikip)
            await kris.reply(from, wikis, id)
            .catch(() => {
                kris.reply(from, 'Ada yang eror!', id)
            })
            break
        case 'cuaca':
            if (args.length == 0) return kris.reply(from, `Untuk melihat cuaca pada suatu daerah\nketik: ${prefix}cuaca [daerah]`, id)
            const cuacaq = body.slice(7)
            const cuacap = await rugaapi.cuaca(cuacaq)
            await kris.reply(from, cuacap, id)
            .catch(() => {
                kris.reply(from, 'Ada yang eror!', id)
            })
            break
        case 'chord':
            if (args.length == 0) return kris.reply(from, `Untuk mencari lirik dan chord dari sebuah lagu\bketik: ${prefix}chord [judul_lagu]`, id)
            const chordq = body.slice(7)
            const chordp = await rugaapi.chord(chordq)
            await kris.reply(from, chordp, id)
            .catch(() => {
                kris.reply(from, 'Ada yang eror!', id)
            })
            break
        case 'ss': //jika error silahkan buka file di folder settings/api.json dan ubah apiSS 'API-KEY' yang kalian dapat dari website https://apiflash.com/
            if (args.length == 0) return kris.reply(from, `Membuat bot men-screenshot sebuah web\n\nPemakaian: ${prefix}ss [url]\n\ncontoh: ${prefix}ss http://google.com`, id)
            const scrinshit = await meme.ss(args[0])
            await kris.sendFile(from, scrinshit, 'ss.jpg', 'cekrek 😋', id)
            .catch(() => {
                kris.reply(from, 'Ada yang eror!', id)
            })
            break
        case 'play'://silahkan kalian custom sendiri jika ada yang ingin diubah
			//kris.reply(from, 'Fitur di Nonaktifkan dikarenakan Terlalu Banyak Spam, jika ingin menggunakan harap check menu !donasi', id)
           if (args.length == 0) return kris.reply(from, `Untuk mencari lagu dari youtube\n\nPenggunaan: ${prefix}play judul lagu`, id)
           axios.get(`https://arugaytdl.herokuapp.com/search?q=${body.slice(6)}`)
           then(async (res) => {
             await kris.sendFileFromUrl(from, `${res.data[0].thumbnail}`, ``, `Lagu ditemukan\n\nJudul: ${res.data[0].title}\nDurasi: ${res.data[0].duration}detik\nUploaded: ${res.data[0].uploadDate}\nView: ${res.data[0].viewCount}\n\nsedang dikirim`, id)
           axios.get(`https://arugaz.herokuapp.com/api/yta?url=https://youtu.be/${res.data[0].id}`)
           then(async(rest) => {
					if (Number(rest.data.filesize.split(' MB')[0]) >= 10.00) return kris.reply(from, 'Maaf ukuran file terlalu besar!')
                    await kris.sendPtt(from, `${rest.data.result}`, id)
                })
                .catch(() => {
                  kris.reply(from, 'Ada yang eror!', id)
                 })
           })
            .catch(() => {
              kris.reply(from, 'Ada yang eror!', id)
            })
			break
        case 'whatanime':
            if (isMedia && type === 'image' || quotedMsg && quotedMsg.type === 'image') {
                if (isMedia) {
                    var mediaData = await decryptMedia(message, uaOverride)
                } else {
                    var mediaData = await decryptMedia(quotedMsg, uaOverride)
                }
                const fetch = require('node-fetch')
                const imgBS4 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                kris.reply(from, 'Sabar Beb lagi Nyari', id)
                fetch('https://trace.moe/api/search', {
                    method: 'POST',
                    body: JSON.stringify({ image: imgBS4 }),
                    headers: { "Content-Type": "application/json" }
                })
                .then(respon => respon.json())
                .then(resolt => {
                	if (resolt.docs && resolt.docs.length <= 0) {
                		kris.reply(from, 'Maaf, saya tidak tau ini anime apa, pastikan gambar yang akan di Search tidak Buram/Kepotong', id)
                	}
                    const { is_adult, title, title_chinese, title_romaji, title_english, episode, similarity, filename, at, tokenthumb, anilist_id } = resolt.docs[0]
                    teks = ''
                    if (similarity < 0.92) {
                    	teks = '*Saya memiliki keyakinan rendah dalam hal ini* :\n\n'
                    }
                    teks += `➸ *Title Japanese* : ${title}\n➸ *Title chinese* : ${title_chinese}\n➸ *Title Romaji* : ${title_romaji}\n➸ *Title English* : ${title_english}\n`
                    teks += `➸ *R-18?* : ${is_adult}\n`
                    teks += `➸ *Eps* : ${episode.toString()}\n`
                    teks += `➸ *Kesamaan* : ${(similarity * 100).toFixed(1)}%\n`
                    var video = `https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`;
                    kris.sendFileFromUrl(from, video, 'anime.mp4', teks, id).catch(() => {
                        kris.reply(from, teks, id)
                    })
                })
                .catch(() => {
                    kris.reply(from, 'Ada yang eror!', id)
                })
            } else {
				kris.reply(from, `Maaf format salah\n\nSilahkan kirim foto dengan caption ${prefix}whatanime\n\nAtau reply foto dengan caption ${prefix}whatanime`, id)
			}
            break
            
        // Other Command
        case 'resi':
            if (args.length !== 2) return kris.reply(from, `Maaf, format pesan salah.\nSilahkan ketik pesan dengan ${prefix}resi <kurir> <no_resi>\n\nKurir yang tersedia:\njne, pos, tiki, wahana, jnt, rpx, sap, sicepat, pcp, jet, dse, first, ninja, lion, idl, rex`, id)
            const kurirs = ['jne', 'pos', 'tiki', 'wahana', 'jnt', 'rpx', 'sap', 'sicepat', 'pcp', 'jet', 'dse', 'first', 'ninja', 'lion', 'idl', 'rex']
            if (!kurirs.includes(args[0])) return kris.sendText(from, `Maaf, jenis ekspedisi pengiriman tidak didukung layanan ini hanya mendukung ekspedisi pengiriman ${kurirs.join(', ')} Tolong periksa kembali.`)
            console.log('Memeriksa No Resi', args[1], 'dengan ekspedisi', args[0])
            cekResi(args[0], args[1]).then((result) => kris.sendText(from, result))
            break
        case 'tts':
            if (args.length == 0) return kris.reply(from, `Mengubah teks menjadi sound (google voice)\nketik: ${prefix}tts <kode_bahasa> <teks>\ncontoh : ${prefix}tts id halo\nuntuk kode bahasa cek disini : https://anotepad.com/note/read/5xqahdy8`)
            const ttsGB = require('node-gtts')(args[0])
            const dataText = body.slice(8)
                if (dataText === '') return kris.reply(from, 'apa teksnya syg😘', id)
                try {
                    ttsGB.save('./media/tts.mp3', dataText, function () {
                    kris.sendPtt(from, './media/tts.mp3', id)
                    })
                } catch (err) {
                    kris.reply(from, err, id)
                }
            break
        case 'translate':
            if (args.length != 1) return kris.reply(from, `Maaf, format pesan salah.\nSilahkan reply sebuah pesan dengan caption ${prefix}translate <kode_bahasa>\ncontoh ${prefix}translate id`, id)
            if (!quotedMsg) return kris.reply(from, `Maaf, format pesan salah.\nSilahkan reply sebuah pesan dengan caption ${prefix}translate <kode_bahasa>\ncontoh ${prefix}translate id`, id)
            const quoteText = quotedMsg.type == 'chat' ? quotedMsg.body : quotedMsg.type == 'image' ? quotedMsg.caption : ''
            translate(quoteText, args[0])
                .then((result) => kris.sendText(from, result))
                .catch(() => kris.sendText(from, 'Error, Kode bahasa salah.'))
            break
        case 'ceklokasi':
            if (quotedMsg.type !== 'location') return kris.reply(from, `Maaf, format pesan salah.\nKirimkan lokasi dan reply dengan caption ${prefix}ceklokasi`, id)
            console.log(`Request Status Zona Penyebaran Covid-19 (${quotedMsg.lat}, ${quotedMsg.lng}).`)
            const zoneStatus = await getLocationData(quotedMsg.lat, quotedMsg.lng)
            if (zoneStatus.kode !== 200) kris.sendText(from, 'Maaf, Terjadi error ketika memeriksa lokasi yang anda kirim.')
            let datax = ''
            for (let i = 0; i < zoneStatus.data.length; i++) {
                const { zone, region } = zoneStatus.data[i]
                const _zone = zone == 'green' ? 'Hijau* (Aman) \n' : zone == 'yellow' ? 'Kuning* (Waspada) \n' : 'Merah* (Bahaya) \n'
                datax += `${i + 1}. Kel. *${region}* Berstatus *Zona ${_zone}`
            }
            const text = `*CEK LOKASI PENYEBARAN COVID-19*\nHasil pemeriksaan dari lokasi yang anda kirim adalah *${zoneStatus.status}* ${zoneStatus.optional}\n\nInformasi lokasi terdampak disekitar anda:\n${datax}`
            kris.sendText(from, text)
            break
        case 'shortlink':
            if (args.length == 0) return kris.reply(from, `ketik ${prefix}shortlink <url>`, id)
            if (!isUrl(args[0])) return kris.reply(from, 'Maaf, url yang kamu kirim tidak valid.', id)
            const shortlink = await urlShortener(args[0])
            await kris.sendText(from, shortlink)
            .catch(() => {
                kris.reply(from, 'Ada yang eror!', id)
            })
            break

        // Group Commands (group admin only)
	    case 'add':
            if (!isGroupMsg) return kris.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
            if (!isGroupAdmins) return kris.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
            if (!isBotGroupAdmins) return kris.reply(from, 'Gagal, silahkan tambahkan bot sebagai admin grup!', id)
	        if (args.length !== 1) return kris.reply(from, `Untuk menggunakan ${prefix}add\nPenggunaan: ${prefix}add <nomor>\ncontoh: ${prefix}add 628xxx`, id)
                try {
                    await kris.addParticipant(from,`${args[0]}@c.us`)
		            .then(() => kris.reply(from, 'Hello Selamat Datang ya', id))
                } catch {
                    kris.reply(from, 'Tidak dapat menambahkan target', id)
                }
            break
        case 'kick':
            if (!isGroupMsg) return kris.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
            if (!isGroupAdmins) return kris.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
            if (!isBotGroupAdmins) return kris.reply(from, 'Gagal, silahkan tambahkan bot sebagai admin grup!', id)
            if (mentionedJidList.length === 0) return kris.reply(from, 'Maaf, format pesan salah.\nSilahkan tag satu atau lebih orang yang akan dikeluarkan', id)
            if (mentionedJidList[0] === botNumber) return await kris.reply(from, 'Maaf, format pesan salah.\nTidak dapat mengeluarkan akun bot sendiri', id)
            await kris.sendTextWithMentions(from, `Request diterima, mengeluarkan:\n${mentionedJidList.map(x => `@${x.replace('@c.us', '')}`).join('\n')}`)
            for (let i = 0; i < mentionedJidList.length; i++) {
                if (groupAdmins.includes(mentionedJidList[i])) return await kris.sendText(from, 'Gagal, kamu tidak bisa mengeluarkan admin grup.')
                await kris.removeParticipant(groupId, mentionedJidList[i])
            }
            break
        case 'promote':
            if (!isGroupMsg) return kris.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
            if (!isGroupAdmins) return kris.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
            if (!isBotGroupAdmins) return kris.reply(from, 'Gagal, silahkan tambahkan bot sebagai admin grup!', id)
            if (mentionedJidList.length !== 1) return kris.reply(from, 'Maaf, hanya bisa mempromote 1 user', id)
            if (groupAdmins.includes(mentionedJidList[0])) return await kris.reply(from, 'Maaf, user tersebut sudah menjadi admin.', id)
            if (mentionedJidList[0] === botNumber) return await kris.reply(from, 'Maaf, format pesan salah.\nTidak dapat mempromote akun bot sendiri', id)
            await kris.promoteParticipant(groupId, mentionedJidList[0])
            await kris.sendTextWithMentions(from, `Request diterima, menambahkan @${mentionedJidList[0].replace('@c.us', '')} sebagai admin.`)
            break
        case 'demote':
            if (!isGroupMsg) return kris.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
            if (!isGroupAdmins) return kris.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
            if (!isBotGroupAdmins) return kris.reply(from, 'Gagal, silahkan tambahkan bot sebagai admin grup!', id)
            if (mentionedJidList.length !== 1) return kris.reply(from, 'Maaf, hanya bisa mendemote 1 user', id)
            if (!groupAdmins.includes(mentionedJidList[0])) return await kris.reply(from, 'Maaf, user tersebut belum menjadi admin.', id)
            if (mentionedJidList[0] === botNumber) return await kris.reply(from, 'Maaf, format pesan salah.\nTidak dapat mendemote akun bot sendiri', id)
            await kris.demoteParticipant(groupId, mentionedJidList[0])
            await kris.sendTextWithMentions(from, `Request diterima, menghapus jabatan @${mentionedJidList[0].replace('@c.us', '')}.`)
            break
        case 'bye':
            if (!isGroupMsg) return kris.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
            if (!isGroupAdmins) return kris.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
            kris.sendText(from, 'Good bye... ( ⇀‸↼‶ )').then(() => kris.leaveGroup(groupId))
            break
        case 'del':
            if (!isGroupAdmins) return kris.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
            if (!quotedMsg) return kris.reply(from, `Maaf, format pesan salah silahkan.\nReply pesan bot dengan caption ${prefix}del`, id)
            if (!quotedMsgObj.fromMe) return kris.reply(from, `Maaf, format pesan salah silahkan.\nReply pesan bot dengan caption ${prefix}del`, id)
            kris.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
            break
        case 'tagall':
        case 'everyone':
            if (!isGroupMsg) return kris.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
            if (!isGroupAdmins) return kris.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup!', id)
            const groupMem = await kris.getGroupMembers(groupId)
            let hehex = '🌹⚜️〘 Mention All 💕 〙⚜️══\n'
            for (let i = 0; i < groupMem.length; i++) {
                hehex += '🌹❥'
                hehex += ` @${groupMem[i].id.replace(/@c.us/g, '')}\n`
            }
            hehex += '🔊〘 Hi semua, Apakabar🤭 〙'
            await kris.sendTextWithMentions(from, hehex)
            break
        case 'botstat': {
            const loadedMsg = await kris.getAmountOfLoadedMessages()
            const chatIds = await kris.getAllChatIds()
            const groups = await kris.getAllGroups()
            kris.sendText(from, `Status :\n- *${loadedMsg}* Loaded Messages\n- *${groups.length}* Group Chats\n- *${chatIds.length - groups.length}* Personal Chats\n- *${chatIds.length}* Total Chats`)
            break
        }

        //Owner Group
        case 'kickall': //mengeluarkan semua member
        if (!isGroupMsg) return kris.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup!', id)
        let isOwner = chat.groupMetadata.owner == sender.id
        if (!isOwner) return kris.reply(from, 'Maaf, perintah ini hanya dapat dipakai oleh owner grup!', id)
        if (!isBotGroupAdmins) return kris.reply(from, 'Gagal, silahkan tambahkan bot sebagai admin grup!', id)
            const allMem = await kris.getGroupMembers(groupId)
            for (let i = 0; i < allMem.length; i++) {
                if (groupAdmins.includes(allMem[i].id)) {

                } else {
                    await kris.removeParticipant(groupId, allMem[i].id)
                }
            }
            kris.reply(from, 'Success kick all member', id)
        break

        //Owner Bot
        case 'ban':
            if (!isOwnerBot) return kris.reply(from, 'Perintah ini hanya untuk Owner bot!', id)
            if (args.length == 0) return kris.reply(from, `Untuk banned seseorang agar tidak bisa menggunakan commands\n\nCaranya ketik: \n${prefix}ban add 628xx --untuk mengaktifkan\n${prefix}ban del 628xx --untuk nonaktifkan\n\ncara cepat ban banyak digrup ketik:\n${prefix}ban @tag @tag @tag`, id)
            if (args[0] == 'add') {
                banned.push(args[1]+'@c.us')
                fs.writeFileSync('./settings/banned.json', JSON.stringify(banned))
                kris.reply(from, 'Success banned target!')
            } else
            if (args[0] == 'del') {
                let xnxx = banned.indexOf(args[1]+'@c.us')
                banned.splice(xnxx,1)
                fs.writeFileSync('./settings/banned.json', JSON.stringify(banned))
                kris.reply(from, 'Success unbanned target!')
            } else {
             for (let i = 0; i < mentionedJidList.length; i++) {
                banned.push(mentionedJidList[i])
                fs.writeFileSync('./settings/banned.json', JSON.stringify(banned))
                kris.reply(from, 'Success ban target!', id)
                }
            }
            break
        case 'bc': //untuk broadcast atau promosi
            if (!isOwnerBot) return kris.reply(from, 'Perintah ini hanya untuk Owner bot!', id)
            if (args.length == 0) return kris.reply(from, `Untuk broadcast ke semua chat ketik:\n${prefix}bc [isi chat]`)
            let msg = body.slice(4)
            const chatz = await kris.getAllChatIds()
            for (let idk of chatz) {
                var cvk = await kris.getChatById(idk)
                if (!cvk.isReadOnly) kris.sendText(idk, `〘 *SPL-BOT BROADCAST* 〙\n\n${msg}`)
                if (cvk.isReadOnly) kris.sendText(idk, `〘 *SPL-BOT BROADCAST* 〙\n\n${msg}`)
            }
            kris.reply(from, 'Broadcast Success!', id)
            break
        case 'leaveall': //mengeluarkan bot dari semua group serta menghapus chatnya
            if (!isOwnerBot) return kris.reply(from, 'Perintah ini hanya untuk Owner bot', id)
            const allChatz = await kris.getAllChatIds()
            const allGroupz = await kris.getAllGroups()
            for (let gclist of allGroupz) {
                await kris.sendText(gclist.contact.id, `Maaf bot sedang pembersihan, total chat aktif : ${allChatz.length}`)
                await kris.leaveGroup(gclist.contact.id)
                await kris.deleteChat(gclist.contact.id)
            }
            kris.reply(from, 'Success leave all group!', id)
            break
        case 'clearall': //menghapus seluruh pesan diakun bot
            if (!isOwnerBot) return kris.reply(from, 'Perintah ini hanya untuk Owner bot', id)
            const allChatx = await kris.getAllChats()
            for (let dchat of allChatx) {
                await kris.deleteChat(dchat.id)
            }
            kris.reply(from, 'Success clear all chat!', id)
            break
        default:
            console.log(color('[EROR]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'Unregistered Command from', color(pushname))
            break
        }
    } catch (err) {
        console.log(color('[EROR]', 'red'), err)
    }
}
