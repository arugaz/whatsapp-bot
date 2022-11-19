import P from 'pino';
import cfonts from 'cfonts';
import { Boom } from '@hapi/boom';
import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  FullJid,
  generateWAMessageFromContent,
  jidDecode,
  makeCacheableSignalKeyStore,
  MessageGenerationOptionsFromContent,
  proto,
} from '@adiwajshing/baileys';

import Auth from '../libs/auth.libs';
import Database from '../libs/database.libs';
import color from '../utils/color.utils';
import { aruga, arugaConfig } from '../types/client.types';

export default class Client implements aruga {
  private aruga!: aruga;
  constructor(private config: arugaConfig) {}

  public startClient = async (): Promise<aruga> => {
    const logger = this.config.logger || P({ level: 'silent' });
    const { useDatabaseAuth } = new Auth(this.config.sessionName);
    const { saveState, state, clearState } = await useDatabaseAuth();
    const cacheState = makeCacheableSignalKeyStore(state.keys, logger);
    const { version, isLatest } = await fetchLatestBaileysVersion();

    this.aruga = makeWASocket({
      ...this.config,
      auth: {
        creds: state.creds,
        keys: cacheState,
      },
      version,
      logger,
      printQRInTerminal: true,
    });

    for (const method of Object.keys(this.aruga))
      this[method as keyof Client] = this.aruga[method as keyof aruga];

    this.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
      if (connection === 'close') {
        const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
        if (
          reason !==
          (DisconnectReason.loggedOut || DisconnectReason.badSession || DisconnectReason.connectionReplaced)
        ) {
          this.log('Reconnecting...', 'warning');
          setTimeout(() => this.startClient(), 3000);
        } else {
          this.log('Disconnected.', 'error');
          this.log('Deleting session and restarting', 'error');
          await clearState();
          cacheState.clear && (await cacheState.clear());
          this.log('Session deleted', 'error');
          this.log('Starting...', 'warning');
          setTimeout(() => this.startClient(), 3000);
        }
      }

      if (connection === 'connecting') {
        this.log('Connecting...', 'warning');
      }

      if (connection === 'open') {
        console.clear();
        cfonts.say(this.user?.name || 'whatsapp-bot', {
          align: 'center',
          colors: [color.cfonts('#8cf57b')],
          font: 'block',
          space: false,
        });
        cfonts.say(`'whatsapp-bot' By @arugaz`, {
          align: 'center',
          font: 'console',
          gradient: ['red', color.cfonts('#ee82f8')],
        });
        this.log(' Success Connected! ');
        this.log(' Name    : ' + this.user?.name || 'arugaz');
        this.log(' Number  : ' + this.user?.id.split(':')[0] || '6969');
        this.log(' Version : ' + version.join('.'));
        this.log(' Latest  : ' + `${isLatest ? 'yes' : 'nah'}`);
      }
    });

    this.ev.on('creds.update', async () => await saveState());
    return this.aruga;
  };

  public decodeJid = (jid: string): string => {
    if (/:\d+@/gi.test(jid)) {
      const decode = jidDecode(jid) as FullJid;
      return (decode.user && decode.server && decode.user + '@' + decode.server) || jid;
    } else return jid;
  };

  public sendContact = async (
    jid: string,
    contacts: {
      name: string;
      number: string;
    }[],
    name = 'Whatsapp',
    opts = {},
  ): Promise<proto.WebMessageInfo> => {
    if (!Array.isArray(contacts) || contacts.length === 0) {
      throw new Error('Invalid contacts array');
    }
    const contactList = [];
    for (const contact of contacts) {
      if (!(contact instanceof Object) || !contact.name || !contact.number) {
        throw new Error('Invalid contact object');
      }
      const number = contact.number.split('@')[0];
      const onWA = (await this.onWhatsApp(number)).length >= 1;
      contactList.push({
        displayName: contact.name,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;${contact.name};;;\nFN:${contact.name}\n${
          onWA ? 'ORG:' + contact.name + '\n' : ''
        }item1.TEL${onWA ? ';waid=' + number + ':' + number : ':+' + number}\nitem1.X-ABLabel:Mobile${
          onWA
            ? (await this.getBusinessProfile(number + '@s.whatsapp.net'))
              ? '\nX-WA-BIZ-NAME:' + contact.name
              : ''
            : ''
        }\nEND:VCARD`,
      });
    }
    const waMessage = generateWAMessageFromContent(
      jid,
      proto.Message.fromObject({
        [contactList.length === 1 ? 'contactMessage' : 'contactsArrayMessage']: {
          ...(contactList.length === 1
            ? {
                displayName: contactList[0].displayName || name,
                vcard: contactList[0].vcard,
              }
            : {
                displayName: name,
                contacts: contactList,
              }),
        },
        ...opts,
      }),
      { ...(opts as MessageGenerationOptionsFromContent) },
    );
    waMessage.message &&
      (await this.relayMessage(jid, waMessage.message, {
        messageId: waMessage.key.id || '',
      }));
    return waMessage;
  };

  public DB = new Database();

  public log = (text: string, type: 'error' | 'warning' | 'success' = 'success'): void => {
    console.log(
      color[type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'green'](
        `[ ${type === 'error' ? 'X' : type === 'warning' ? '!' : 'V'} ]`,
      ),
      text,
    );
  };

  public getOrderDetails!: aruga['getOrderDetails'];
  public getCatalog!: aruga['getCatalog'];
  public getCollections!: aruga['getCollections'];
  public productCreate!: aruga['productCreate'];
  public productDelete!: aruga['productDelete'];
  public productUpdate!: aruga['productUpdate'];
  public sendMessageAck!: aruga['sendMessageAck'];
  public sendRetryRequest!: aruga['sendRetryRequest'];
  public rejectCall!: aruga['rejectCall'];
  public getPrivacyTokens!: aruga['getPrivacyTokens'];
  public assertSessions!: aruga['assertSessions'];
  public relayMessage!: aruga['relayMessage'];
  public sendReceipt!: aruga['sendReceipt'];
  public sendReceipts!: aruga['sendReceipts'];
  public readMessages!: aruga['readMessages'];
  public refreshMediaConn!: aruga['refreshMediaConn'];
  public waUploadToServer!: aruga['waUploadToServer'];
  public fetchPrivacySettings!: aruga['fetchPrivacySettings'];
  public updateMediaMessage!: aruga['updateMediaMessage'];
  public sendMessage!: aruga['sendMessage'];
  public groupMetadata!: aruga['groupMetadata'];
  public groupCreate!: aruga['groupCreate'];
  public groupLeave!: aruga['groupLeave'];
  public groupUpdateSubject!: aruga['groupUpdateSubject'];
  public groupParticipantsUpdate!: aruga['groupParticipantsUpdate'];
  public groupUpdateDescription!: aruga['groupUpdateDescription'];
  public groupInviteCode!: aruga['groupInviteCode'];
  public groupRevokeInvite!: aruga['groupRevokeInvite'];
  public groupAcceptInvite!: aruga['groupAcceptInvite'];
  public groupAcceptInviteV4!: aruga['groupAcceptInviteV4'];
  public groupGetInviteInfo!: aruga['groupGetInviteInfo'];
  public groupToggleEphemeral!: aruga['groupToggleEphemeral'];
  public groupSettingUpdate!: aruga['groupSettingUpdate'];
  public groupFetchAllParticipating!: aruga['groupFetchAllParticipating'];
  public processingMutex!: aruga['processingMutex'];
  public upsertMessage!: aruga['upsertMessage'];
  public appPatch!: aruga['appPatch'];
  public sendPresenceUpdate!: aruga['sendPresenceUpdate'];
  public presenceSubscribe!: aruga['presenceSubscribe'];
  public profilePictureUrl!: aruga['profilePictureUrl'];
  public onWhatsApp!: aruga['onWhatsApp'];
  public fetchBlocklist!: aruga['fetchBlocklist'];
  public fetchStatus!: aruga['fetchStatus'];
  public updateProfilePicture!: aruga['updateProfilePicture'];
  public updateProfileStatus!: aruga['updateProfileStatus'];
  public updateProfileName!: aruga['updateProfileName'];
  public updateBlockStatus!: aruga['updateBlockStatus'];
  public getBusinessProfile!: aruga['getBusinessProfile'];
  public resyncAppState!: aruga['resyncAppState'];
  public chatModify!: aruga['chatModify'];
  public type!: aruga['type'];
  public ws!: aruga['ws'];
  public ev!: aruga['ev'];
  public authState!: aruga['authState'];
  public user!: aruga['user'];
  public generateMessageTag!: aruga['generateMessageTag'];
  public query!: aruga['query'];
  public waitForMessage!: aruga['waitForMessage'];
  public waitForSocketOpen!: aruga['waitForSocketOpen'];
  public sendRawMessage!: aruga['sendRawMessage'];
  public sendNode!: aruga['sendNode'];
  public logout!: aruga['logout'];
  public end!: aruga['end'];
  public onUnexpectedError!: aruga['onUnexpectedError'];
  public uploadPreKeys!: aruga['uploadPreKeys'];
  public uploadPreKeysToServerIfRequired!: aruga['uploadPreKeysToServerIfRequired'];
  public waitForConnectionUpdate!: aruga['waitForConnectionUpdate'];
}
