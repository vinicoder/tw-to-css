declare module "tailwindcss/tailwindconfig.faketype" {
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
}

declare module "tailwindcss/src/lib/expandApplyAtRules.js" {
  export default function expandApplyAtRules(): void;
}

declare module "tailwindcss/src/lib/generateRules.js" {
  export function generateRules(): void;
}

declare module "tailwindcss/src/lib/setupContextUtils.js" {
  import { Container } from "postcss";
  import { TailwindConfig } from "tailwindcss/tailwindconfig.faketype";

  interface ChangedContent {
    content: string;
    extension?: string;
  }

  interface Api {
    container: Container;
    separator: string;
    format: (def: string) => void;
    wrap: (rule: Container) => void;
  }

  type VariantPreview = string;

  type VariantFn = [number, (api: Api) => VariantPreview | undefined];

  type VariantName = string;

  export interface JitContext {
    changedContent: ChangedContent[];
    getClassList: () => string[];
    tailwindConfig: TailwindConfig;
    variantMap: Map<VariantName, VariantFn[]>;
  }

  export function createContext(
    config: TailwindConfig,
    changedContent?: ChangedContent[]
  ): JitContext;
}

declare module "tailwindcss/src/processTailwindFeatures.js" {
  import { AtRule, Plugin, Result, Root } from "postcss";
  import { ChangedContent, JitContext } from "tailwindcss/src/lib/setupContextUtils.js";
  import { TailwindConfig } from "tailwindcss/tailwindconfig.faketype";

  type SetupContext = (root: Root, result: Result) => JitContext;

  interface ProcessTailwindFeaturesCallbackOptions {
    applyDirectives: Set<AtRule>;
    createContext: (config: TailwindConfig, changedContent: ChangedContent[]) => JitContext;
    registerDependency: () => unknown;
    tailwindDirectives: Set<string>;
  }

  export default function processTailwindFeatures(
    callback: (options: ProcessTailwindFeaturesCallbackOptions) => SetupContext
  ): Plugin;
}

declare module "tailwindcss/src/public/resolve-config.js" {
  import { TailwindConfig } from "tailwindcss/tailwindconfig.faketype";

  export default function resolveConfig(tailwindConfig: TailwindConfig): TailwindConfig;
}
