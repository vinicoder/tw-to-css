import { CSSProperties } from "react";
import { Config } from "tailwindcss";

export interface TailwindConfig {
  important?: Config["important"];
  prefix?: Config["prefix"];
  separator?: Config["separator"];
  safelist?: Config["safelist"];
  presets?: Config["presets"];
  future?: Config["future"];
  experimental?: Config["experimental"];
  darkMode?: Config["darkMode"];
  theme?: Config["theme"];
  corePlugins?: Config["corePlugins"];
  plugins?: Config["plugins"];
}

type Content = string | string[];

type Options = { merge?: boolean; minify?: boolean };

export function getCSS(content: string, config?: TailwindConfig): string;

export function tailwindToCSS(params: { config?: TailwindConfig; options?: Options }): {
  twi: typeof twi;
  twj: typeof twj;
};

export function twi(content: Content, options?: Options): string;

export function twj(content: Content, options?: Options): CSSProperties;

export function tailwindInlineCSS(
  config?: TailwindConfig,
  options?: Options
): (content: Content, options?: Options) => string;

export function tailwindInlineJson(
  config?: TailwindConfig,
  options?: Options
): (content: Content, options?: Options) => CSSProperties;
