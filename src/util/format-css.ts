export const formatCSS = (css: string) => ({
  extractCSS(content: string, nested: boolean = false) {
    const propValueRegex = /(?:[\s\r\n]*)?(?<prop>[\w-]+)\s*:\s*(?<value>[^;\r\n]+)/gm;
    let match: RegExpExecArray | null;
    const props: { [key: string]: string | undefined } = {};

    while ((match = propValueRegex.exec(content)) !== null) {
      const { prop, value } = match.groups!;
      props[prop] = value;
    }

    return Object.entries(props).reduce(
      (acc, [prop, value]) => acc + `${nested ? "\t" : ""}${prop}: ${value}; \n\r`,
      ""
    );
  },
  merge() {
    const blockContentRegex =
      /(?<=\.)[\w\d\\[\]-]+\s*\{(?<content>[^{}]*(?:(?<=;)\s*\n\r?[^{}]*)*)\s*\}/gm;
    let matchBlock: RegExpExecArray | null;
    let blockContent = "";

    while ((matchBlock = blockContentRegex.exec(css)) !== null) {
      const { content } = matchBlock.groups!;
      blockContent += content;
    }

    let mergedCSS = this.extractCSS(blockContent);

    const mediaRegex = /(?<media>@media\s*\([^\)]*\))\s*\{(?<content>[^\}]*)\}/gm;
    let matchMedia: RegExpExecArray | null;
    while ((matchMedia = mediaRegex.exec(css)) !== null) {
      const { media, content } = matchMedia.groups!;
      mergedCSS += `\n\r${media} {\n\r${this.extractCSS(content, true)}}\n\r`;
    }

    css = mergedCSS;

    return this;
  },
  minify() {
    css = css

      // Remove comments
      .replace(/\/\*[\s\S]*?\*\//gm, "")

      // Remove extra spaces after semicolons and colons
      .replace(/;\s+/gm, ";")
      .replace(/:\s+/gm, ":")

      // Remove extra spaces before and after brackets
      .replace(/\)\s*{/gm, "){") // Remove spaces before opening curly brace after closing parenthesis
      .replace(/\s+\(/gm, "(") // Remove spaces before opening parenthesis
      .replace(/{\s+/gm, "{") // Remove spaces after opening curly brace
      .replace(/}\s+/gm, "}") // Remove spaces before closing curly brace
      .replace(/\s*{/gm, "{") // Remove spaces after opening curly brace
      .replace(/;?\s*}/gm, "}"); // Remove extra spaces and semicolons before closing curly braces

    return this;
  },
  fixRGB() {
    const regex =
      /rgb\(\s*(?<red>\d+)\s*(?<green>\d+)\s*(?<blue>\d+)(?:\s*\/\s*(?<alpha>[\d%.]+))?\s*\)/gm;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(css)) !== null) {
      const [matchString] = match;
      let { red, green, blue, alpha = 1 } = match.groups!;
      css = css.replace(
        matchString,
        `rgb(${red},${green},${blue}${alpha === "1" ? "" : `,${alpha}`})`
      );
    }

    return this;
  },
  get() {
    return css;
  },
});
