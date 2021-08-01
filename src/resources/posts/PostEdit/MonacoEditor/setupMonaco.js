// Recall we are using MonacoWebpackPlugin. According to the
// monaco-editor-webpack-plugin docs, we must use:
//
// import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
//
// instead of
//
// import * as monaco from 'monaco-editor';
//
// because we are shipping only a subset of the languages.
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import {
  createOnigScanner,
  createOnigString,
  loadWASM,
} from 'vscode-oniguruma';
import { SimpleLanguageInfoProvider } from './providers';
import { registerLanguages } from './register';
import { rehydrateRegexps } from './configuration';
import VsCodeDarkTheme from './vs-dark-plus-theme';
import VsCodeLightTheme from './vs-light-theme';

const setupMonaco = async (
  element,
  { language, value = '', readOnly = false, themeKey = 'vs-dark' },
) => {
  const languages = [
    {
      id: 'gherkin',
      extensions: ['.feature'],
      aliases: ['Gherkin', 'feature'],
    },
  ];
  const grammars = {
    'source.gherkin': {
      language: 'gherkin',
      path: 'Gherkin.tmLanguage.json',
    },
  };

  const fetchGrammar = async (scopeName) => {
    const { path } = grammars[scopeName];
    const uri = `grammars/${path}`;
    const response = await fetch(uri);
    const grammar = await response.text();
    const type = path.endsWith('.json') ? 'json' : 'plist';
    return { type, grammar };
  };

  const fetchConfiguration = async (language) => {
    const uri = `configurations/${language}.json`;
    const response = await fetch(uri);
    const rawConfiguration = await response.text();
    return rehydrateRegexps(rawConfiguration);
  };

  try {
    const data = await loadVSCodeOnigurumWASM();
    await loadWASM(data);
  } catch (err) {
    console.log(err);
  }

  const onigLib = Promise.resolve({
    createOnigScanner,
    createOnigString,
  });

  const provider = new SimpleLanguageInfoProvider({
    grammars,
    fetchGrammar,
    configurations: languages.map((language) => language.id),
    fetchConfiguration,
    theme: getTheme(themeKey),
    onigLib,
    monaco,
  });
  registerLanguages(
    languages,
    (language) => provider.fetchLanguageInfo(language),
    monaco,
  );

  const editor = monaco.editor.create(element, {
    value,
    language,
    theme: themeKey,
    minimap: {
      enabled: true,
    },
    readOnly,
    scrollBeyondLastLine: false,
  });
  provider.injectCSS();

  return editor;
};

// Taken from https://github.com/microsoft/vscode/blob/829230a5a83768a3494ebbc61144e7cde9105c73/src/vs/workbench/services/textMate/browser/textMateService.ts#L33-L40
const loadVSCodeOnigurumWASM = async () => {
  const response = await fetch('onig.wasm');
  const contentType = response.headers.get('content-type');
  if (contentType === 'application/wasm') {
    return response;
  }

  // Using the response directly only works if the server sets the MIME type 'application/wasm'.
  // Otherwise, a TypeError is thrown when using the streaming compiler.
  // We therefore use the non-streaming compiler :(.
  return await response.arrayBuffer();
};

const getTheme = (themeKey) =>
  themeKey === 'vs' ? VsCodeLightTheme : VsCodeDarkTheme;

export default setupMonaco;
