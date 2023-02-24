import { twi } from "..";

export function classToCSS(HTML: string, inline: boolean = false) {
  const classRegex = /class="(.*?)"/g;

  let CSS = twi(HTML);
  let styleTag = "";
  if (!inline) {
    let head = HTML.match(/<head.*<\/head>/gs);
    if (!head) {
      inline = true;
    } else {
      let headElement = head[0];

      styleTag = `<style>${CSS}</style>`;
      const styleTagExists = headElement.match(/<style.*<\/style>/gs);
      if (styleTagExists) {
        styleTag = styleTagExists[0].replace("</style>", `${CSS}</style>`);
        headElement = headElement.replace(styleTagExists[0], styleTag);
      } else {
        headElement = headElement.replace("</head>", `${styleTag}</head>`);
      }
      HTML = HTML.replace(/<head.*<\/head>/gs, headElement);
    }
  }
  if (inline) {
    const elementRegex = /<.*?>/g;
    const elements = HTML.match(elementRegex);
    elements?.forEach((element) => {
      const elClasses = element.match(classRegex);
      if (elClasses) {
        let elCSS = twi(elClasses[0]);
        const styleAttrRegex = /style=".*?"/g;
        const styleAttrMatches = element.match(styleAttrRegex);
        if (styleAttrMatches) {
          elCSS = styleAttrMatches[0].replace('style="', `style="${elCSS}`);
          HTML = HTML.replace(element, element.replace(styleAttrMatches[0], elCSS));
        } else {
          const styleAttr = ` style="${elCSS}"`;
          HTML = HTML.replace(element, element.replace(">", `${styleAttr}>`));
        }
      }
    });
  }

  return HTML;
}
