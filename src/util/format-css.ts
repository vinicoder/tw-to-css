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
  sanatize() {
    const sanatized = css.replace(/\s+|\\+/gm, "");
    return formatCSS(sanatized);
  },
  get() {
    return css;
  },
});
