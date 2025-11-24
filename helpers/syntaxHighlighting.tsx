import { TextStyle } from "react-native";

// Define color tokens for different syntax elements
export const syntaxColors = {
  keyword: "#569cd6",
  string: "#ce9178",
  comment: "#6a9955",
  number: "#b5cea8",
  function: "#dcdcaa",
  operator: "#d4d4d4",
  punctuation: "#d4d4d4",
  boolean: "#569cd6",
  class: "#4ec9b0",
  property: "#9cdcfe",
  text: "#d4d4d4",
};

// Token type definition
export type TokenType = keyof typeof syntaxColors;

export interface Token {
  type: TokenType;
  text: string;
}

// Language-specific patterns
const patterns = {
  javascript: {
    keyword:
      /\b(const|let|var|function|return|if|else|for|while|class|extends|import|export|from|default|async|await|new|this|try|catch|throw|switch|case|break|continue|do|typeof|instanceof|delete|void|yield|in|of|static|super|with|debugger|finally)\b/g,
    boolean: /\b(true|false|null|undefined|NaN|Infinity)\b/g,
    string: /(["'`])(?:(?=(\\?))\2.)*?\1/g,
    comment: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
    number: /\b(0x[0-9a-fA-F]+|0b[01]+|0o[0-7]+|\d+\.?\d*([eE][+-]?\d+)?)\b/g,
    function: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g,
    class: /\b([A-Z][a-zA-Z0-9_$]*)\b/g,
    property: /\.([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g,
    operator: /([+\-*/%=<>!&|?:~^])/g,
    punctuation: /([{}[\]();,.])/g,
  },
  html: {
    comment: /(<!--[\s\S]*?-->)/g,
    string: /(["'])(?:(?=(\\?))\2.)*?\1/g,
    keyword: /(<\/?[a-zA-Z][\w-]*|\/?>)/g,
    property: /\b([a-zA-Z-]+)(?==)/g,
    operator: /=/g,
    punctuation: /[<>\/]/g,
  },
  css: {
    comment: /(\/\*[\s\S]*?\*\/)/g,
    string: /(["'])(?:(?=(\\?))\2.)*?\1/g,
    keyword: /([.#]?[a-zA-Z][\w-]*)\s*(?={)/g,
    property: /\b([a-zA-Z-]+)\s*(?=:)/g,
    number:
      /\b(\d+\.?\d*(px|em|rem|%|vh|vw|pt|cm|mm|in|pc|ex|ch|vmin|vmax)?)\b/g,
    operator: /[:;]/g,
    punctuation: /[{}()]/g,
  },
  json: {
    string: /(")(?:(?=(\\?))\2.)*?\1/g,
    number: /\b(-?\d+\.?\d*([eE][+-]?\d+)?)\b/g,
    boolean: /\b(true|false|null)\b/g,
    punctuation: /[{}[\]:,]/g,
  },
};

/**
 * Tokenize code into syntax-highlighted segments
 * @param code - The code string to tokenize
 * @param language - The programming language
 * @returns Array of tokens with type and text
 */
export const tokenizeCode = (code: string, language: string): Token[] => {
  // Map language aliases
  const langMap: Record<string, keyof typeof patterns> = {
    js: "javascript",
    jsx: "javascript",
    ts: "javascript",
    tsx: "javascript",
    typescript: "javascript",
    htm: "html",
  };

  const lang = langMap[language] || language;
  const langPatterns =
    patterns[lang as keyof typeof patterns] || patterns.javascript;

  const tokens: Token[] = [];
  let lastIndex = 0;
  const matches: Array<{
    type: TokenType;
    text: string;
    index: number;
    length: number;
  }> = [];

  // Collect all matches with their positions
  for (const [type, pattern] of Object.entries(langPatterns)) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;

    while ((match = regex.exec(code)) !== null) {
      const matchText = match[0];
      // For property matches that include the dot, extract just the property name
      const text =
        type === "property" && matchText.startsWith(".")
          ? matchText.slice(1)
          : matchText;

      matches.push({
        type: type as TokenType,
        text,
        index:
          type === "property" && matchText.startsWith(".")
            ? match.index + 1
            : match.index,
        length: text.length,
      });
    }
  }

  // Sort matches by position
  matches.sort((a, b) => a.index - b.index);

  // Remove overlapping matches (keep first one)
  const filtered: typeof matches = [];
  let lastEnd = -1;

  for (const m of matches) {
    if (m.index >= lastEnd) {
      filtered.push(m);
      lastEnd = m.index + m.length;
    }
  }

  // Build token array with plain text between matches
  for (const m of filtered) {
    if (m.index > lastIndex) {
      tokens.push({
        type: "text",
        text: code.slice(lastIndex, m.index),
      });
    }
    tokens.push({ type: m.type, text: m.text });
    lastIndex = m.index + m.length;
  }

  // Add remaining text
  if (lastIndex < code.length) {
    tokens.push({
      type: "text",
      text: code.slice(lastIndex),
    });
  }

  return tokens;
};

/**
 * Get the style for a token type
 * @param type - The token type
 * @returns TextStyle object with color
 */
export const getTokenStyle = (type: TokenType): TextStyle => ({
  color: syntaxColors[type],
  ...(type === "keyword" || type === "boolean"
    ? { fontWeight: "600" as const }
    : {}),
  ...(type === "comment" ? { fontStyle: "italic" as const } : {}),
});

/**
 * Convert tokens to React Native Text components
 * Example usage in your component:
 *
 * const tokens = tokenizeCode(code, language);
 * <Text>
 *   {tokens.map((token, i) => (
 *     <Text key={i} style={getTokenStyle(token.type)}>
 *       {token.text}
 *     </Text>
 *   ))}
 * </Text>
 */
