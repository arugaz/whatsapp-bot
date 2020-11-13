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


Best regards, Riintan.`
}

/*

Dimohon untuk tidak menghapus link github saya, butuh support dari kalian! makasih.

*/

exports.textMenu = (pushname) => {
    return `
Hi, ${pushname}! 👋️Me Riintan Bot
Berikut adalah beberapa fitur yang ada pada bot ini!✨

Creator:
 â”œ *${prefix}sticker*
 â”œ *${prefix}stickergif*
 â”œ *${prefix}stickergiphy*
 â”œ *${prefix}meme*
 â”œ *${prefix}quotemaker*
 â”œ *${prefix}nulis*

Islam:
 â”œ *${prefix}infosurah*
 â”œ *${prefix}surah*
 â”œ *${prefix}tafsir*
 â”œ *${prefix}ALaudio*
 â”œ *${prefix}jsolat*

18+:
 â”œ *${prefix}nekopoi*

Download:
 â”œ *${prefix}instagram*
 â”œ *${prefix}ytmp3*
 â”œ *${prefix}ytmp4*

Primbon:
 â”œ *${prefix}artinama*
 â”œ *${prefix}cekjodoh*

Search Any:
 â”œ *${prefix}images*
 â”œ *${prefix}sreddit*
 â”œ *${prefix}resep*
 â”œ *${prefix}stalkig*
 â”œ *${prefix}wiki*
 â”œ *${prefix}cuaca*
 â”œ *${prefix}chord*
 â”œ *${prefix}lirik*
 â”œ *${prefix}ss*
 â”œ *${prefix}play*
 â”œ *${prefix}whatanime*

Random Teks:
 â”œ *${prefix}fakta*
 â”œ *${prefix}pantun*
 â”œ *${prefix}katabijak*
 â”œ *${prefix}quote*

Random Images:
 â”œ *${prefix}anime*
 â”œ *${prefix}kpop*
 â”œ *${prefix}memes*

Lain-lain:
 â”œ *${prefix}tts*
 â”œ *${prefix}translate*
 â”œ *${prefix}resi*
 â”œ *${prefix}covidindo*
 â”œ *${prefix}ceklokasi*
 â”œ *${prefix}shortlink*
 â”œ *${prefix}bapakfont*

Fun Menu:
 â”œ *${prefix}simisimi*

Tentang Bot:
 â”œ *${prefix}tnc*
 â”œ *${prefix}donasi*
 â”œ *${prefix}botstat*
 â”œ *${prefix}ownerbot*
 â”œ *${prefix}join*
 â”œ *${prefix}speed*

_-_-_-_-_-_-_-_-_-_-_-_-_-_

Owner Bot:
 â”œ *${prefix}ban* - banned
 â”œ *${prefix}bc* - promosi
 â”œ *${prefix}leaveall* - keluar semua grup
 â”œ *${prefix}clearall* - hapus semua chat

Serah lu pada Riintan gak capek Kok :D`
}

/*

Dimohon untuk tidak menghapus link github saya, butuh support dari kalian! makasih.

*/

exports.textAdmin = () => {
    return `
⚠ [ *Owner Group Only* ] ⚠
Berikut adalah fitur owner grup yang ada pada bot ini!
. *${prefix}kickall*
-owner adalah pembuat grup.

⚠ [ *Admin Group Only* ] ⚠ 
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
Hai, terimakasih telah menggunakan bot ini, untuk mendukung bot ini kamu dapat membantu dengan berdonasi dengan cara:

https://saweria.co/donate/riintam

Doakan agar project bot ini bisa terus berkembang
Doakan agar author bot ini dapat ide-ide yang kreatif lagi

Donasi akan digunakan untuk pengembangan dan pengoperasian bot ini.

Terimakasih.`
}
