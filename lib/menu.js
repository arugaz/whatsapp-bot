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

By using this source code / bot, you agree to the following Terms and Conditions:
- The source code / bot does not store your data on our servers.
- Source code / bot is not responsible for your order to this bot.
- You can see the source code / bot at https://github.com/ArugaZ/whatsapp-bot

Instagram: https://instagram.com/ini.arga/

Best regards, ArugaZ.`
}

/*

Please don't remove my github link, you need your support! thanks.

*/

exports.textMenu = (pushname) => {
    return `
Hi, ${pushname}! 👋️
Here are some of the features of this bot!✨

Creator:

-❥ *${prefix}cooltext*
-❥ *${prefix}logopornhub*
-❥ *${prefix}sticker*
-❥ *${prefix}stickergif*
-❥ *${prefix}stickergiphy*
-❥ *${prefix}meme*
-❥ *${prefix}quotemaker*
-❥ *${prefix}write*

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

Horoscope:
-❥ *${prefix}cekzodiak*
-❥ *${prefix}the meaning of the name*
-❥ *${prefix}matchmaking*

Search Any:
-❥ *${prefix}dewabatch*
-❥ *${prefix}images*
-❥ *${prefix}sreddit*
-❥ *${prefix}recipe*
-❥ *${prefix}stalkig*
-❥ *${prefix}wikipedia*
-❥ *${prefix}weather*
-❥ *${prefix}chord*
-❥ *${prefix}lyrics*
-❥ *${prefix}ss*
-❥ *${prefix}play*
-❥ *${prefix}movie*
-❥ *${prefix}whatanime*

Random Text:
-❥ *${prefix}motivation*
-❥ *${prefix}howgay*
-❥ *${prefix}fact*
-❥ *${prefix}pantun*
-❥ *${prefix}words of wisdom*
-❥ *${prefix}quote*
-❥ *${prefix}short story*
-❥ *${prefix}cersex*
-❥ *${prefix}poetry*

Random Images:
-❥ *${prefix}anime*
-❥ *${prefix}kpop*
-❥ *${prefix}memes*

Extra Features:
-❥ *${prefix}tts*
-❥ *${prefix}translate*
-❥ *${prefix}receipt*
-❥ *${prefix}covidindo*
-❥ *${prefix}check location*
-❥ *${prefix}shortlink*
-❥ *${prefix}bapakfont*
-❥ *${prefix}hilihfont*
-❥ *${prefix}grouplink*
-❥ *${prefix}revoke*

About Bot:
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
-❥ *${prefix}clearall* - delete all chats

Hope you have a great day!✨`
}

/*

Please don't remove my github link, you need your support! thanks.

*/

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
*Owner Group is a group creator.*
`
}

/*

Please don't remove my github link, you need your support! thanks.

*/

exports.textDonasi = () => {
    return `
Hai, terimakasih telah menggunakan bot ini, untuk mendukung bot ini kamu dapat membantu dengan berdonasi dengan cara:

https://trakteer.id/arugabot

Doakan agar project bot ini bisa terus berkembang
Doakan agar author bot ini dapat ide-ide yang kreatif lagi

Donasi akan digunakan untuk pengembangan dan pengoperasian bot ini.

Terimakasih. -ArugaZ`
}
