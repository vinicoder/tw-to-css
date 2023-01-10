import { TailwindConfig } from "tailwindcss/tailwindconfig.faketype";
import { processTailwindCSS, formatCSS } from "./util";

class TailwindInlineCSS {
  tailwindConfig: TailwindConfig = {
    corePlugins: { preflight: false },
  };

  setConfig(config: TailwindConfig) {
    this.tailwindConfig = {
      ...config,
      ...this.tailwindConfig,
    };
  }

  private getCSS(content: string) {
    return processTailwindCSS({ config: this.tailwindConfig, content });
  }

  getStyles(content: string) {
    return formatCSS(this.getCSS(content)).sanatize().get();
  }

  getInline(content: string) {
    return formatCSS(this.getCSS(content)).sanatize().merge().get();
  }
}

export const twi = new TailwindInlineCSS();
