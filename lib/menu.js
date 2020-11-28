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

Instagram: https://instagram.com/ini.arga/

Best regards, ArugaZ.`
}

/*

Dimohon untuk tidak menghapus link github saya, butuh support dari kalian! makasih.

*/

exports.textMenu = (pushname) => {
    return `
Hola, ${pushname}! 👋️
¡Estas son algunas de las características de este bot!✨

Creador:
-❥ *${prefix}sticker*
-❥ *${prefix}stickergif*
-❥ *${prefix}stickergiphy*
-❥ *${prefix}meme*
-❥ *${prefix}nulis*

18+:
-❥ *${prefix}nekopoi*

Descargas:
-❥ *${prefix}instagram*
-❥ *${prefix}ytmp3*
-❥ *${prefix}ytmp4*
-❥ *${prefix}facebook*

Busqueda:
-❥ *${prefix}images*
-❥ *${prefix}sreddit*
-❥ *${prefix}resep*
-❥ *${prefix}stalkig*
-❥ *${prefix}chord*
-❥ *${prefix}lirik*
-❥ *${prefix}play*
-❥ *${prefix}whatanime*

Imagenes:
-❥ *${prefix}anime*
-❥ *${prefix}memes*

Acerca del Bot:
-❥ *${prefix}donacion*
-❥ *${prefix}botstat*
-❥ *${prefix}propietario*

_-_-_-_-_-_-_-_-_-_-_-_-_-_

Admin:
-❥ *${prefix}ban* - baneo
-❥ *${prefix}leaveall* - salir de todos los grupos
-❥ *${prefix}clearall* - eliminar todos los chats

¡Espero que tengas un gran día! ✨`
}

/*

Dimohon untuk tidak menghapus link github saya, butuh support dari kalian! makasih.

*/

exports.textAdmin = () => {
    return `
⚠ [ *Solo Admins* ] ⚠ 
¡Aquí están las funciones de administración de grupo de este bot!
-❥ *${prefix}add*
-❥ *${prefix}kick* @tag
-❥ *${prefix}promote* @tag
-❥ *${prefix}demote* @tag
-❥ *${prefix}tagall*
-❥ *${prefix}del*

_-_-_-_-_-_-_-_-_-_-_-_-_-_

⚠ [ *Solo grupo de propietarios* ] ⚠
Ber¡Aquí están las características del propietario del grupo en este bot!
-❥ *${prefix}kickall*
*El grupo propietario es un creador de grupo.*
`
}

/*

Dimohon untuk tidak menghapus link github saya, butuh support dari kalian! makasih.

*/

exports.textDonasi = () => {
    return `
Hola, gracias por usar este bot, para apoyar este bot puedes ayudar donando:

https://www.paypal.me/lucasalchapar

Ore para que el proyecto de bot siga creciendo xD

Gracias. -NACOWON`
}
