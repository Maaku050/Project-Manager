declare module "js-beautify" {
  export function js(code: string, options?: { indent_size?: number }): string;
  export function html(code: string, options?: { indent_size?: number }): string;
  export function css(code: string, options?: { indent_size?: number }): string;
}
