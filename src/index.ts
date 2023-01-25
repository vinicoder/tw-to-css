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

const tailwindInlineCSS: typeof types.tailwindInlineCSS =
  (config, mainOptions) => (content, options) => {
    const defaultOptions = { merge: true, minify: true };
    const twiOptions = { ...defaultOptions, ...mainOptions, ...options };

    const cssContent = typeof content === "string" ? content : content.join(" ");

    let css = formatCSS(getCSS(cssContent, config));
    if (twiOptions?.minify) css = css.minify();
    if (twiOptions?.merge) css = css.merge();

    css.fixRGB();

    return css.get();
  };

const tailwindInlineJson: typeof types.tailwindInlineJson =
  (config, mainOptions) => (content, options) => {
    return cssToJson(tailwindInlineCSS(config, mainOptions)(content, options));
  };

const twi: typeof types.twi = tailwindInlineCSS();
const twj: typeof types.twj = tailwindInlineJson();

export { twi, twj, tailwindToCSS };
