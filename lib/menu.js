const fs = require('fs-extra')
const { 
    prefix
} = JSON.parse(fs.readFileSync('./settings/setting.json'))

/*

Dimohon untuk tidak menghapus link github saya, butuh support dari kalian! makasih.

*/

exports.textTnC = () => {
    return `
Source code / bot ini merupakan program open-source (gratis) yang ditulis menggunakan Javascript, kamu dapat menggunakan, menyalin, memodifikasi, menggabungkan, menerbitkan, mendistribusikan, mensublisensikan, dan atau menjual salinan dengan tanpa menghapus author utama dari source code / bot ini.

Dengan menggunakan source code / bot ini maka anda setuju dengan Syarat dan Kondisi sebagai berikut:
- Source code / bot tidak menyimpan data anda di server kami.
- Source code / bot tidak bertanggung jawab atas perintah anda kepada bot ini.
- Source code / bot anda bisa lihat di https://github.com/ArugaZ

Copyright By KRIS / SPL-BOT.`
}

/*

Dimohon untuk tidak menghapus link github saya, butuh support dari kalian! makasih.

*/

exports.textMenu = (pushname) => {
    return `
Hello, ${pushname}! 👋️

╔ ═〘 ♥ꜱᴘʟ ʙᴏᴛ♥ 〙══╗
║⚜️Kunjungi Halaman Saya ⚜️
║github.com/TheSploit
║splofficialweb.blogspot.com
║youtube.com/c/TryOne
║pastebin.com/u/TheSploit#
╚ ═════════════╝ 
╔ ═〘 ꜰɪᴛᴜʀᴇ ᴀʟʟ ᴜꜱᴇʀ 〙═╗
🌹 *${prefix}meme*
🌹 *${prefix}nulis*
🌹 *${prefix}sticker*
🌹 *${prefix}stickergif*
🌹 *${prefix}stickergiphy*
🌹 *${prefix}quotemaker*
╚ ═════════════╝
╔ ═〘 ʀᴇʟɪɢɪᴏᴜꜱ ᴄᴏᴍᴍᴀɴᴅ 〙╗
🌹 *${prefix}infosurah*
🌹 *${prefix}surah*
🌹 *${prefix}tafsir*
🌹 *${prefix}ALaudio*
🌹 *${prefix}jsolat*
╚ ═════════════╝

╔ ═〘 ᴅᴏᴡɴʟᴏᴀᴅᴇʀ ᴄᴏᴍᴍᴀɴᴅꜱ 〙╗
🌹 *${prefix}ytmp3*
🌹 *${prefix}ytmp4*
🌹 *${prefix}instagram*
╚ ═════════════╝
╔ ═〘 ᴄᴏᴍᴍᴀɴᴅ ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ 〙╗
🌹 *${prefix}ss*
🌹 *${prefix}play*
🌹 *${prefix}wiki*
🌹 *${prefix}cuaca*
🌹 *${prefix}chord*
🌹 *${prefix}resep*
🌹 *${prefix}images*
🌹 *${prefix}sreddit*
🌹 *${prefix}nekopoi*
🌹 *${prefix}stalkig*
🌹 *${prefix}zodiak*
╚ ═════════════╝
╔〘 ᴇɴᴛᴇʀᴛᴀɪɴᴍᴇɴᴛ ғᴇᴀᴛᴜʀᴇᴤ 〙╗
🌹 *${prefix}quote*
🌹 *${prefix}pantun*
🌹 *${prefix}fakta*
🌹 *${prefix}bucin*
🌹 *${prefix}katabijak*
🌹 *${prefix}lirik*
╚ ═════════════╝
╔ ═〘 ʀᴀɴᴅᴏᴍ ɪᴍᴀɢᴇᴤ 〙═╗
🌹 *${prefix}wanime*
🌹 *${prefix}anime*
🌹 *${prefix}whatanime*
🌹 *${prefix}kpop*
🌹 *${prefix}memes*
🌹 *${prefix}nekoanime*
🌹 *${prefix}animehentai*
🌹 *${prefix}trapanime*
🌹 *${prefix}nsfneko*
🌹 *${prefix}wahorror*
🌹 *${prefix}loli*
🌹 *${prefix}gambar*
╚ ═════════════╝
╔ ═〘 ᴏᴛʜᴇʀᴤ ᴄᴏᴍᴍᴀɴᴅᴤ 〙═╗
🌹 *${prefix}tts*
🌹 *${prefix}translate*
🌹 *${prefix}resi*
🌹 *${prefix}ceklokasi*
🌹 *${prefix}shortlink*
🌹 *${prefix}toimg*
╚ ═════════════╝
╔ ═〘 ᴀʙᴏᴜᴛ ʙᴏᴛ 〙╗
🌹 *${prefix}join*
🌹 *${prefix}tnc*
🌹 *${prefix}donasi*
🌹 *${prefix}ownerbot*
🌹 *${prefix}linkgrup*
🌹 *${prefix}adminlist*
🌹 *${prefix}ownergroup*
🌹 *${prefix}listblock*
╚ ═════════════╝
╔ ═〘 ᴏᴡɴᴇʀ ʙᴏᴛ 〙═╗
🌹 *${prefix}ban* - banned
🌹 *${prefix}bc* - promosi
🌹 *${prefix}leaveall* - keluar semua grup
🌹 *${prefix}clearall* - hapus semua chat
╚ ═════════════╝
Thanks for Using SPL-BOT💕`
}

/*

Dimohon untuk tidak menghapus link github saya, butuh support dari kalian! makasih.

*/

exports.textAdmin = () => {
    return `
⚜️ [ *Owner Group Only* ] ✨
Berikut adalah fitur owner grup yang ada pada bot ini!
. *${prefix}kickall*
-owner adalah pembuat grup.

✨ [ *Admin Group Only* ] ✨ 
Berikut adalah fitur admin grup yang ada pada bot ini!

. *${prefix}add*
. *${prefix}kick* @tag
. *${prefix}promote* @tag
. *${prefix}demote* @tag
. *${prefix}tagall*
. *${prefix}del*
`
}

/*

Dimohon untuk tidak menghapus link github saya, butuh support dari kalian! makasih.

*/

exports.textDonasi = () => {
    return `
I Open the donation, If you want to donate so that 
BOT can run well and
I get more excited xixi.\n\n______________________________________________\nHere my information bellow :\nPULSA : 085754337101\nPaypal : https://www.paypal.com/paypalme/TheSploit\n\nThanks 🧡
    `
}
