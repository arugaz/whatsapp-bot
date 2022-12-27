declare module "cfonts" {
  /**
   * Declares for cfonts modules
   * @param {string} text Text to display
   * @param {any} opts:
   * {
   *
   * font?:'3d'|'block'|'chrome'|'console'|'grid'|'huge'|'pallet'|'shade'|'simple'|'simple3d'|'simpleblock'|'slick'|'tiny';
   *
   * align?:'center'|'right';
   *
   * colors?:Array<|'system'|'black'|'red'|'green'|'yellow'|'blue'|'magenta'|'cyan'|'white'|'gray'|'redBright'|'greenBright'|'yellowBright'|'blueBright'|'magentaBright'|'cyanBright'|'whiteBright'|HexColor>;
   *
   * background?:Array<|'transparent'|'black'|'red'|'green'|'yellow'|'blue'|'magenta'|'cyan'|'white'|'gray'|'redBright'|'greenBright'|'yellowBright'|'blueBright'|'magentaBright'|'cyanBright'|'whiteBright'|HexColor>;
   *
   * letterSpacing?:number;
   *
   * lineHeight?:number;
   *
   * space?:boolean;
   *
   * maxLength?:string;
   *
   * gradient?:Array<|'system'|'black'|'red'|'green'|'yellow'|'blue'|'magenta'|'cyan'|'white'|'gray'|HexColor>;
   *
   * independentGradient?:boolean;
   *
   * transitionGradient?:boolean;
   *
   * env?:string;
   *
   * }
   * @returns {void}
   */
  function say(
    text: string,
    opts: {
      font?: "3d" | "block" | "chrome" | "console" | "grid" | "huge" | "pallet" | "shade" | "simple" | "simple3d" | "simpleblock" | "slick" | "tiny"
      align?: "center" | "right"
      colors?: Array<
        | "system"
        | "black"
        | "red"
        | "green"
        | "yellow"
        | "blue"
        | "magenta"
        | "cyan"
        | "white"
        | "gray"
        | "redBright"
        | "greenBright"
        | "yellowBright"
        | "blueBright"
        | "magentaBright"
        | "cyanBright"
        | "whiteBright"
        | HexColor
      >
      background?: Array<
        | "transparent"
        | "black"
        | "red"
        | "green"
        | "yellow"
        | "blue"
        | "magenta"
        | "cyan"
        | "white"
        | "gray"
        | "redBright"
        | "greenBright"
        | "yellowBright"
        | "blueBright"
        | "magentaBright"
        | "cyanBright"
        | "whiteBright"
        | HexColor
      >
      letterSpacing?: number
      lineHeight?: number
      space?: boolean
      maxLength?: string
      gradient?: Array<"system" | "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "gray" | HexColor>
      independentGradient?: boolean
      transitionGradient?: boolean
      env?: string
    }
  ): void
}
