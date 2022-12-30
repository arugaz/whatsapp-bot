/**
 * WASticker Options
 */
export type StickerOptions = {
  /** Sticker Pack title
   * @default arugaz
   */
  pack?: string
  /** Sticker Pack Author
   * @default whatsapp-bot
   */
  author?: string
  /** Sticker Pack ID
   * @default random string
   */
  id?: string
  /** Sticker Categories
   * @default [] didnt have a category
   */
  categories?: Categories[]
  /** Result Width, since WASticker 1x1 it will set height too
   * @default 256
   */
  width?: number
  /** Result Fps
   * @default 25
   */
  fps?: number
  /**
   * Loop the result ?
   * @default true
   */
  loop?: boolean
  /**
   * Compress the result ? number 0 - 6
   * @default 0
   */
  compress?: number
}

type Love =
  | "❤"
  | "😍"
  | "😘"
  | "💕"
  | "😻"
  | "💑"
  | "👩‍❤‍👩"
  | "👨‍❤‍👨"
  | "💏"
  | "👩‍❤‍💋‍👩"
  | "👨‍❤‍💋‍👨"
  | "🧡"
  | "💛"
  | "💚"
  | "💙"
  | "💜"
  | "🖤"
  | "💔"
  | "❣"
  | "💞"
  | "💓"
  | "💗"
  | "💖"
  | "💘"
  | "💝"
  | "💟"
  | "♥"
  | "💌"
  | "💋"
  | "👩‍❤️‍💋‍👩"
  | "👨‍❤️‍💋‍👨"
  | "👩‍❤️‍👨"
  | "👩‍❤️‍👩"
  | "👨‍❤️‍👨"
  | "👩‍❤️‍💋‍👨"
  | "👬"
  | "👭"
  | "👫"
  | "🥰"
  | "😚"
  | "😙"
  | "👄"
  | "🌹"
  | "😽"
  | "❣️"
  | "❤️"
type Happy =
  | "😀"
  | "😃"
  | "😄"
  | "😁"
  | "😆"
  | "😅"
  | "😂"
  | "🤣"
  | "🙂"
  | "😛"
  | "😝"
  | "😜"
  | "🤪"
  | "🤗"
  | "😺"
  | "😸"
  | "😹"
  | "☺"
  | "😌"
  | "😉"
  | "🤗"
  | "😊"
type Sad =
  | "☹"
  | "😣"
  | "😖"
  | "😫"
  | "😩"
  | "😢"
  | "😭"
  | "😞"
  | "😔"
  | "😟"
  | "😕"
  | "😤"
  | "😠"
  | "😥"
  | "😰"
  | "😨"
  | "😿"
  | "😾"
  | "😓"
  | "🙍‍♂"
  | "🙍‍♀"
  | "💔"
  | "🙁"
  | "🥺"
  | "🤕"
  | "☔️"
  | "⛈"
  | "🌩"
  | "🌧"
type Angry =
  | "😯"
  | "😦"
  | "😧"
  | "😮"
  | "😲"
  | "🙀"
  | "😱"
  | "🤯"
  | "😳"
  | "❗"
  | "❕"
  | "🤬"
  | "😡"
  | "😠"
  | "🙄"
  | "👿"
  | "😾"
  | "😤"
  | "💢"
  | "👺"
  | "🗯️"
  | "😒"
  | "🥵"
type Greet = "👋"
type Celebrate =
  | "🎊"
  | "🎉"
  | "🎁"
  | "🎈"
  | "👯‍♂️"
  | "👯"
  | "👯‍♀️"
  | "💃"
  | "🕺"
  | "🔥"
  | "⭐️"
  | "✨"
  | "💫"
  | "🎇"
  | "🎆"
  | "🍻"
  | "🥂"
  | "🍾"
  | "🎂"
  | "🍰"

/**
 * Whatsapp sticker category
 *
 * refer to: https://github.com/WhatsApp/stickers/wiki/Tag-your-stickers-with-Emojis
 */
export type StickerCategories = Love | Happy | Sad | Angry | Greet | Celebrate
