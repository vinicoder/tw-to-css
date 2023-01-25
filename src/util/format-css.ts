export const formatCSS = (css: string) => ({
  merge() {
    const propRegex = /([\w-]+)\s*:\s*([^;\}]+)(?:\s*;|\s*(?=\}))/gm;
    const props: { [key: string]: string } = {};
    let match: RegExpExecArray | null;
    while ((match = propRegex.exec(css))) {
      const { 1: prop, 2: value } = match;
      props[prop] = value;
    }

    let cssString = "";
    for (const prop in props) {
      cssString += `${prop}:${props[prop]};`;
    }

    return formatCSS(cssString);
  },
  minify() {
    return formatCSS(
      css
        .replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "")
        .replace(/\s*([{}:;,])\s*/g, "$1")
        .replace(/\s+/g, " ")
    );
  },
  fixRGB() {
    let match;
    const regex = /rgb\((\d+)[\s,]+(\d+)[\s,]+(\d+)(?:[\s,\/]+([\d.]+))?\)/g;
    while ((match = regex.exec(css)) !== null) {
      let [, r, g, b, a = "1"] = match;
      css = css.replace(match[0], `rgb(${r}, ${g}, ${b}${a === "1" ? "" : `, ${a}`})`);
    }
    return formatCSS(css);
  },
  get() {
    return css;
  },
});
