       case 'profile':
       case 'me' :
            if (isBanned) return false
            if (isGroupMsg) {
                if (!quotedMsg) {
                var pic = await aruga.getProfilePicFromServer(author)
                var namae = pushname
                var sts = await aruga.getStatus(author)
                var adm = isGroupAdmins
                const { status } = sts
                if (pic == undefined) {
                    var pfp = errorurl 
                } else {
                    var pfp = pic
                } 
                await aruga.sendFileFromUrl(from, pfp, 'pfp.jpg', `*User Profile* ✨️ \n\n➸ *Username: ${namae}*\n\n➸ *User Info: ${status}*\n\n➸ *Admin Group: ${adm}*\n\n`)
             } else if (quotedMsg) {
             var qmid = quotedMsgObj.sender.id
             var pic = await aruga.getProfilePicFromServer(qmid)
             var namae = quotedMsgObj.sender.name
             var sts = await aruga.getStatus(qmid)
             var adm = isGroupAdmins
             var donate = isAdmin
             const { status } = sts
              if (pic == undefined) {
              var pfp = errorurl 
              } else {
              var pfp = pic
              } 
              await aruga.sendFileFromUrl(from, pfp, 'pfp.jpg', `*User Profile* ✨️ \n\n➸ *Username: ${namae}*\n\n➸ *User Info: ${status}*\n\n➸ *Admin Group: ${adm}*\n\n`)
             }
            }
            break
