const fs = require('fs-extra')
const { 
    prefix
} = JSON.parse(fs.readFileSync('./settings/setting.json'))

/*


Please don't remove my github link, you need your support! thanks.

*/

exports.textTnC = () => {
    return `
Source code / bot is an open-source program (free) written using Javascript, you can use, copy, modify, combine, publish, distribute, sublicense, and or sell copies without removing the main author of this source code / bot.

By using this source code / bot, you agree to the following Terms and Condition:
- Source code / bot tidak menyimpan data anda di server kami.
- Source code / bot tidak bertanggung jawab atas perintah anda kepada bot ini.
- Source code / bot anda bisa lihat di https://github.com/ArugaZ/whatsapp-bot

Instagram: https://instagram.com/ini.arga/

Best regards, ArugaZ.`
}

/*


Please don't remove my github link, you need your support! thanks.

*/

exports.textMenu = (pushname) => {
    return `
Hi, ${pushname}! 👋️
I Am Official Bot Of Zain Jutt!✨

Creator:

-❥ *${prefix}cooltext*
-❥ *${prefix}logopornhub*
-❥ *${prefix}sticker*
-❥ *${prefix}stickergif*
-❥ *${prefix}stickergiphy*
-❥ *${prefix}meme*
-❥ *${prefix}quotemaker*
-❥ *${prefix}nulis*

Islam:
-❥ *${prefix}infosurah*
-❥ *${prefix}surah*
-❥ *${prefix}tafsir*
-❥ *${prefix}ALaudio*
-❥ *${prefix}jsolat*

Fun Menu (Group):
-❥ *${prefix}simisimi*
-❥ *${prefix}katakasar*
	┷-❥ *${prefix}classification*

Download:
-❥ *${prefix}ytmp3*
-❥ *${prefix}ytmp4*
-❥ *${prefix}facebook*

Primbon:
-❥ *${prefix}cekzodiak*
-❥ *${prefix}artinama*
-❥ *${prefix}cekjodoh*

Search Any:
-❥ *${prefix}dewabatch*
-❥ *${prefix}images*
-❥ *${prefix}sreddit*
-❥ *${prefix}recipe*
-❥ *${prefix}stalkig*
-❥ *${prefix}wikipidea*
-❥ *${prefix}weather*
-❥ *${prefix}chord*
-❥ *${prefix}lyrics*
-❥ *${prefix}ss*
-❥ *${prefix}play*
-❥ *${prefix}movie*
-❥ *${prefix}whatanime*


Random Text:
-❥ *${prefix}
motivation*
-❥ *${prefix}howgay*
-❥ *${prefix}fact*
-❥ *${prefix}pantun*
-❥ *${prefix}katabijak*
-❥ *${prefix}quote*
-❥ *${prefix}short story*
-❥ *${prefix}cersex*
-❥ *${prefix}poetry*

Random Images:
-❥ *${prefix}anime*
-❥ *${prefix}kpop*
-❥ *${prefix}memes*


Others:
-❥ *${prefix}tts*
-❥ *${prefix}translate*
-❥ *${prefix}resi*
-❥ *${prefix}covidindo*
-❥ *${prefix}check location*
-❥ *${prefix}shortlink*
-❥ *${prefix}bapakfont*
-❥ *${prefix}hilihfont*
-❥ *${prefix}grouplink*
-❥ *${prefix}revoke*


About Boats:
-❥ *${prefix}tnc*
-❥ *${prefix}donation*
-❥ *${prefix}botstat*
-❥ *${prefix}ownerbot*
-❥ *${prefix}join*

_-_-_-_-_-_-_-_-_-_-_-_-_-_

Owner Bot:
-❥ *${prefix}ban* - banned
-❥ *${prefix}bc* - promotion
-❥ *${prefix}leaveall* - exit all groups
-❥ *${prefix}clearall* - 
delete all chats

Hope you have a great day!✨`



exports.textAdmin = () => {
    return `
⚠ [ *Admin Group Only* ] ⚠ 

Following are the group admin features available on this bot!

-❥ *${prefix}add*
-❥ *${prefix}kick* @tag
-❥ *${prefix}promote* @tag
-❥ *${prefix}demote* @tag
-❥ *${prefix}mutegrup*
-❥ *${prefix}tagall*
-❥ *${prefix}setprofile*
-❥ *${prefix}delete*
-❥ *${prefix}welcome*

_-_-_-_-_-_-_-_-_-_-_-_-_-_

⚠ [ *Owner Group Only* ] ⚠

The following is the group owner feature available on this bot!
-❥ *${prefix}kickall*
*
Owner Group is a group creator.*
`
}

/*

Please don't remove my github link, we need your support! thanks.

*/

exports.textDonasi = () => {
    return `

Hi, thanks for using this bot, to support this bot you can help by donating in a way:

https://trakteer.id/arugabot


Pray that the bot project will continue to grow
Pray for more creative ideas for the bot author

The donation will be used for the development and operation of this bot.

Thanks. -ArugaZ`
}
