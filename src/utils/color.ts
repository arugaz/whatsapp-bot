const color = {
  black: (text: string): string => `\x1B[30m${text}\x1B[39m`,

  red: (text: string): string => `\x1B[31m${text}\x1B[39m`,

  green: (text: string): string => `\x1B[32m${text}\x1B[39m`,

  yellow: (text: string): string => `\x1B[33m${text}\x1B[39m`,

  blue: (text: string): string => `\x1B[34m${text}\x1B[39m`,

  purple: (text: string): string => `\x1B[35m${text}\x1B[39m`,

  cyan: (text: string): string => `\x1B[36m${text}\x1B[39m`,

  hex:
    (hex: string) =>
    (text: string): string =>
      `\x1B[38;2;${hex.replace(
        /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
        (m, r, g, b) => `${m ? m : '#'}` + r + r + g + g + b + b,
      )}m${text}\x1B[39m`,

  /** @type {(string) => HexColor} */
  cfonts<T extends string>(s: Hex<T>): HexColor {
    return s;
  },
};

export default color;
