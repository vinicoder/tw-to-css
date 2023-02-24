import { CSSProperties } from "react";
import postcss from "postcss";
import postcssJs from "postcss-js";

export function cssToJson(css: string): CSSProperties {
  const root = postcss.parse(css);
  return postcssJs.objectify(root);
}
