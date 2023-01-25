import { CSSProperties } from "react";

export function cssToJson(css: string): CSSProperties {
  const styles = css.split(";").filter((style) => style.trim() !== "");
  const reactStyles: { [key: string]: string } = {};

  styles.forEach((style) => {
    const [property, value] = style.split(":");
    const camelCasedProperty = property
      .trim()
      .replace(/-([a-z])/g, (match) => match[1].toUpperCase());
    reactStyles[camelCasedProperty] = value.trim();
  });

  return reactStyles;
}
