import {
  html as beautifyHTML,
  css as beautifyCSS,
  js as beautifyJs,
} from "js-beautify";

// Prettier-like settings
const beautifyOptions = {
  indent_size: 2,
  indent_with_tabs: false,
  preserve_newlines: true,
  max_preserve_newlines: 2,
  end_with_newline: true,
  wrap_line_length: 80,
  space_before_conditional: true,
  jslint_happy: false,
  unescape_strings: true,
};

export const isCodeBlock = (text: string) => text.trim().startsWith("```");

export const detectLanguage = (text: string) => {
  const match = text.match(/^```([\w-]+)/);
  return match ? match[1].toLowerCase() : "text";
};

export const extractCode = (text: string) => {
  return text
    .replace(/^```[\w-]*\n?/, "")
    .replace(/```$/, "")
    .trim();
};

export const formatCode = (code: string, lang: string): string => {
  try {
    switch (lang) {
      case "js":
      case "javascript":
      case "ts":
      case "typescript":
        return beautifyJs(code, beautifyOptions);

      case "json":
        try {
          return JSON.stringify(JSON.parse(code), null, 2);
        } catch {
          return code; // fail quietly
        }

      case "html":
        return beautifyHTML(code, beautifyOptions);

      case "css":
        return beautifyCSS(code, beautifyOptions);

      default:
        return code;
    }
  } catch (err) {
    console.warn("Formatting failed:", err);
    return code;
  }
};
