import format from 'string-template';

export interface IL10n {
  [key: string]: string;
}

export interface IParams {
  [key: string]: string | number;
}

const l10ns = new Map<string, IL10n>();

export const addL10n = (code: string, l10n: IL10n) => {
  const existingL10n = l10ns.get(code);
  if (existingL10n) {
    Object.assign(existingL10n, l10n);
  } else {
    l10ns.set(code, l10n);
  }
};

let defaultCodes: readonly string[] = ['en'];

export const setDefaultLanguages = (codes: readonly string[]) => {
  defaultCodes = codes;
};

export function i18n(key: string, params?: IParams): string;
export function i18n(code: string | string[], key: string, params?: IParams): string;
export function i18n(...args: any[]): string {
  let codes: readonly string[];
  let key: string;
  let params: IParams;

  if (typeof args[0] === 'string' && typeof args[1] === 'string') {
    let code: string;
    [code, key, params] = args;
    codes = [code];
  } else if (args[0] instanceof Array && typeof args[1] === 'string') {
    [codes, key, params] = args;
  } else {
    [key, params] = args;
    codes = defaultCodes;
  }

  for (const code of codes) {
    const l10n = l10ns.get(code);
    if (l10n) {
      return subParams(l10n[key], params) || `[I18N-MISSING(${code}):${key}]`;
    }
  }

  return `[I18N-MISSING(${codes.join(',')}):${key}]`;
}

const subParams = (text?: string, params?: IParams) => {
  if (!text) {
    return undefined;
  }

  if (params) {
    return format(text, params);
  }
  return text;
};
