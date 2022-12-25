import Format from "@arugaz/formatter";

export const sizeFormat = (number: number): string => Format.sizeFormatter()(number) as string;

export const timeFormat = (number: number): string => Format.durationFormatter()(number) as string;

export const upperFormat = (string: string): string =>
  string
    .split(" ")
    .reduce((prev, curr) =>
      (
        prev.charAt(0).toLocaleUpperCase() +
        prev.slice(1) +
        " " +
        curr.charAt(0).toLocaleUpperCase() +
        curr.slice(1)
      ).trim(),
    );

export const lowerFormat = (string: string): string =>
  string
    .split(" ")
    .reduce((prev, curr) =>
      (
        prev.charAt(0).toLocaleLowerCase() +
        prev.slice(1) +
        " " +
        curr.charAt(0).toLocaleLowerCase() +
        curr.slice(1)
      ).trim(),
    );
