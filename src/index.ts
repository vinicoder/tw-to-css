import types from "..";
import { processTailwindCSS, formatCSS } from "./util";
import { cssToJson } from "./util/css-to-json";

const getCSS: typeof types.getCSS = (content, config) =>
  processTailwindCSS({
    config: {
      corePlugins: { preflight: false },
      ...config,
    },
    content,
  });

const tailwindToCSS: typeof types.tailwindToCSS = ({ config, options }) => ({
  twi: tailwindInlineCSS(config, options),
  twj: tailwindInlineJson(config, options),
});

const classListFormatter: typeof types.classListFormatter = (...params) => {
  let classList = "";

  if (typeof params[0] === "string") {
    classList = params[0];
  } else if (Array.isArray(params[0])) {
    classList = (params as any[])
      .flat(Infinity)
      .map((styles) => classListFormatter(styles))
      .join(" ");
  } else if (typeof params[0] === "object") {
    classList = Object.entries(params[0])
      .filter((entry) => !!entry[1])
      .map((entry) => entry[0])
      .join(" ");
  }

  classList = classList.replaceAll(/\s+/g, " ");

  return classList;
};

const tailwindInlineCSS: typeof types.tailwindInlineCSS =
  (config, mainOptions) =>
  (...params: any) => {
    const content = classListFormatter(params);

    const options = (!Array.isArray(params[0]) && (params[1] as object)) || {};

    const defaultOptions = { merge: true, minify: true };
    const twiOptions = { ...defaultOptions, ...mainOptions, ...options };

    let css = formatCSS(getCSS(content, config));
    if (twiOptions?.merge) css.merge();
    if (twiOptions?.minify) css.minify();

    css.fixRGB();

    return css.get();
  };

const tailwindInlineJson: typeof types.tailwindInlineJson =
  (config, mainOptions) =>
  (...params: any) => {
    return cssToJson(tailwindInlineCSS(config, mainOptions)(params));
  };

const twi: typeof types.twi = tailwindInlineCSS();
const twj: typeof types.twj = tailwindInlineJson();

const twToCSS = tailwindToCSS;

export { twi, twj, tailwindToCSS, twToCSS };
