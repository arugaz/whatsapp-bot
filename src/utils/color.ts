const color = {
  /**
   * Coloring string to black color
   * @param {string} text - Text to colored
   * @returns {string} color string
   */
  black: (text: string): string => `\x1B[30m${text}\x1B[39m`,

  /**
   * Coloring string to red color
   * @param {string} text - Text to colored
   * @returns {string} color string
   */
  red: (text: string): string => `\x1B[31m${text}\x1B[39m`,

  /**
   * Coloring string to green color
   * @param {string} text - Text to colored
   * @returns {string} color string
   */
  green: (text: string): string => `\x1B[32m${text}\x1B[39m`,

  /**
   * Coloring string to yellow color
   * @param {string} text - Text to colored
   * @returns {string} color string
   */
  yellow: (text: string): string => `\x1B[33m${text}\x1B[39m`,

  /**
   * Coloring string to blue color
   * @param {string} text - Text to colored
   * @returns {string} color string
   */
  blue: (text: string): string => `\x1B[34m${text}\x1B[39m`,

  /**
   * Coloring string to purple color
   * @param {string} text - Text to colored
   * @returns {string} color string
   */
  purple: (text: string): string => `\x1B[35m${text}\x1B[39m`,

  /**
   * Coloring string to cyan color
   * @param {string} text - Text to colored
   * @returns {string} color string
   */
  cyan: (text: string): string => `\x1B[36m${text}\x1B[39m`,

  /**
   * Coloring string to hex color
   * @param {string} hex:string - Hex color
   */
  hex:
    (hex: HexColor) =>
    /**
     * @param {string} text:string - Text to colored
     * @returns {string}
     */
    (text: string): string =>
      `\x1B[38;2;${hex
        .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => `${m ? m : "#"}` + r + r + g + g + b + b)
        .substring(1)
        .match(/.{2}/g)
        .map((x) => parseInt(x, 16))
        .join(";")}m${text}\x1B[39m`
}

export default color
