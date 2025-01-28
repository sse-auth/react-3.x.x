"use strict";

const replace = String.prototype.replace;
const percentTwenties = /%20/g;

enum Format {
  RFC1738 = "RFC1738",
  RFC3986 = "RFC3986",
}

type FormatterFunction = (value: string) => string;

interface Formatters {
  RFC1738: FormatterFunction;
  RFC3986: FormatterFunction;
}

interface FormatterModule {
  default: Format;
  formatters: Formatters;
  RFC1738: Format;
  RFC3986: Format;
}

const formatterModule: FormatterModule = {
  default: Format.RFC3986,
  formatters: {
    RFC1738: (value: string): string => {
      return replace.call(value, percentTwenties, "+");
    },
    RFC3986: (value: string): string => {
      return String(value);
    },
  },
  RFC1738: Format.RFC1738,
  RFC3986: Format.RFC3986,
};

export { formatterModule, formatterModule as default };
