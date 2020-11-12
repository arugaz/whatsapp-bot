const { create, Client } = require('@open-wa/wa-automate')
const figlet = require('figlet')
const options = require('./utils/options')
const { color, messageLog } = require('./utils')
const HandleMsg = require('./HandleMsg')

const start = (kris = new Client()) => {
    console.log(color(figlet.textSync('----------------', { horizontalLayout: 'default' })))
    console.log(color(figlet.textSync('SPL BOT', { font: 'Ghost', horizontalLayout: 'default' })))
    console.log(color(figlet.textSync('----------------', { horizontalLayout: 'default' })))
    console.log(color('[DEV]'), color('Kris', 'yellow'))
    console.log(color('[~>>]'), color('BOT Started!', 'green'))

    // Mempertahankan sesi agar tetap nyala
    kris.onStateChanged((state) => {
        console.log(color('[~>>]', 'red'), state)
        if (state === 'CONFLICT' || state === 'UNLAUNCHED') kris.forceRefocus()
    })

    // ketika bot diinvite ke dalam group
    kris.onAddedToGroup(async (chat) => {
	const groups = await kris.getAllGroups()
	// kondisi ketika batas group bot telah tercapai,ubah di file settings/setting.json
	if (groups.length > groupLimit) {
	await kris.sendText(chat.id, `Sorry, the group on this bot is full\nMax Group is: ${groupLimit}`).then(() => {
	      kris.leaveGroup(chat.id)
	      kris.deleteChat(chat.id)
	  }) 
	} else {
	// kondisi ketika batas member group belum tercapai, ubah di file settings/setting.json
	    if (chat.groupMetadata.participants.length < memberLimit) {
	    await kris.sendText(chat.id, `Sorry, BOT comes out if the group members do not exceed ${memberLimit} people`).then(() => {
	      kris.leaveGroup(chat.id)
	      kris.deleteChat(chat.id)
	    })
	    } else {
        await kris.simulateTyping(chat.id, true).then(async () => {
          await kris.sendText(chat.id, `Hai semuanya salam kenal, saya adalah SPL-BOT. Untuk mengetahui command dari Bot silahkan kirim ${prefix}menu`)
        })
	    }
	}
    })

    

    kris.onIncomingCall(async (callData) => {
        // ketika seseorang menelpon nomor bot akan mengirim pesan
        await kris.sendText(callData.peerJid, 'Maaf karena kamu telah melanggar Rule\n--------------------------------\nPelanggaran Anda : Menelfon/MenVideo Call BOT\n--------------------------------\nmaka kamu akan di Banned, dan tidak bisa menggunakan Fitur dari BOT lagi, silahkan hubungi creator BOT untuk meminta Unban.\n\nSPL-BOT')
        .then(async () => {
            // bot akan memblock nomor itu
            await kris.contactBlock(callData.peerJid)
        })
    })

    // ketika seseorang mengirim pesan
    kris.onMessage(async (message) => {
        kris.getAmountOfLoadedMessages() // menghapus pesan cache jika sudah 3000 pesan.
            .then((msg) => {
                if (msg >= 3000) {
                    console.log('[kris]', color(`Loaded Message Reach ${msg}, cuting message cache...`, 'yellow'))
                    kris.cutMsgCache()
                }
            })
        HandleMsg(kris, message)    
    
    })
	
    // Message log for analytic
    kris.onAnyMessage((anal) => { 
        messageLog(anal.fromMe, anal.type)
    })
}

//create session
create(options(true, start))
    .then((kris) => start(kris))
    .catch((err) => new Error(err))
