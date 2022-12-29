// cfonts declare
declare type HexDigit =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"

declare type Hex<T extends string> = T extends `#${HexDigit}${HexDigit}${HexDigit}${infer ColorHex}`
  ? ColorHex extends ``
    ? T
    : ColorHex extends `${HexDigit}${HexDigit}${HexDigit}`
    ? T
    : never
  : never

declare type HexColor = string & { __type: "Hex" }
