import { TailwindConfig } from "tailwindcss/tailwindconfig.faketype";
import { processTailwindCSS, formatCSS } from "./util";

class TailwindInlineCSS {
  tailwindConfig: TailwindConfig = {
    corePlugins: { preflight: false },
  };

  setConfig(config: TailwindConfig) {
    this.tailwindConfig = {
      ...this.tailwindConfig,
      ...config,
    };
  }

  private getCSS(content: string) {
    return processTailwindCSS({ config: this.tailwindConfig, content });
  }

  getStyles(content: string) {
    return formatCSS(this.getCSS(content)).minify().get();
  }

  getInline(content: string) {
    return formatCSS(this.getCSS(content)).merge().minify().get();
  }

  private parseHTML(html: string) {
    const sanatizedHTML = html.replace(/classname=/gim, "class=");
    const parser = new DOMParser();
    const doc = parser.parseFromString(sanatizedHTML, "text/html");
    return doc;
  }

  parseHTMLInline(html: string) {
    const firstTagRegex = /<([^>\s]+)[^>]*>/;
    const [, firstTag] = html.match(firstTagRegex) || [];

    const doc = this.parseHTML(html);
    const elements = doc.querySelectorAll("*");

    elements.forEach((element: Element) => {
      const classList = element.classList;
      if (classList.length === 0) {
        return;
      }

      let style = element.getAttribute("style") || "";
      const tailwindCSS = this.getInline(`font-sans ${classList.value}`);
      style = formatCSS(`${style} ${tailwindCSS}`).merge().minify().get();

      element.setAttribute("style", style);
      element.removeAttribute("class");
    });

    const initialElement = doc.querySelector(firstTag);

    return initialElement?.outerHTML;
  }

  parseHTMLStyles(html: string) {
    const doc = this.parseHTML(html);

    this.setConfig({ corePlugins: { preflight: true } });
    const allStyles = this.getStyles(doc.documentElement.outerHTML);

    const styleEl = document.createElement("style");
    styleEl.innerHTML = allStyles;
    doc.querySelector("head")?.append(styleEl);

    return doc.documentElement.outerHTML;
  }
}

export const twi = new TailwindInlineCSS();
