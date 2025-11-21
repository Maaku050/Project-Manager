import React from "react";
import {
  html as beautifyHTML,
  css as beautifyCSS,
  js as beautifyJs,
} from "js-beautify";

// Prettier-like options for js-beautify
const beautifyOptions = {
  indent_size: 2,
  space_in_empty_paren: false,
  jslint_happy: true,
  end_with_newline: true,
  preserve_newlines: true,
  max_preserve_newlines: 2,
  wrap_line_length: 80,
  indent_with_tabs: false,
  space_before_conditional: true,
  unescape_strings: true,
  break_chained_methods: false,
};

// --- Update helpers ---
export const isCodeBlock = (text: string) => text.trim().startsWith("```");

export const detectLanguage = (text: string) => {
  const match = text.match(/^```(\w+)/);
  return match ? match[1].toLowerCase() : "text";
};

export const extractCode = (text: string) => {
  const cleaned = text
    .replace(/^```[\w]*\n?/, "")
    .replace(/```$/, "")
    .trim();
  return cleaned;
};

export const formatCode = (code: string, lang: string) => {
  try {
    switch (lang) {
      case "js":
      case "javascript":
      case "ts":
      case "typescript":
        return beautifyJs(code, beautifyOptions);
      case "json":
        return JSON.stringify(JSON.parse(code), null, 2);
      case "html":
        return beautifyHTML(code, beautifyOptions);
      case "css":
        return beautifyCSS(code, beautifyOptions);
      default:
        return code;
    }
  } catch (err) {
    console.warn("Format failed:", err);
    return code;
  }
};
