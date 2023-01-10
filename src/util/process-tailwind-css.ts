import postcss from "postcss";
import postcssVariables from "postcss-css-variables";
import { TailwindConfig } from "tailwindcss/tailwindconfig.faketype";
import { createTailwindcssPlugin, defaultTailwindCSS } from ".";

export const processTailwindCSS = (props: { config?: TailwindConfig; content: string }) => {
  const tailwindcssPlugin = createTailwindcssPlugin({
    config: props.config,
    content: props.content,
  });
  const processor = postcss([tailwindcssPlugin, postcssVariables()]);
  const result = processor.process(defaultTailwindCSS, { from: undefined });
  return result.css;
};
