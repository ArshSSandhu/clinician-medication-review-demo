// Node strips plain TypeScript but cannot parse JSX. Use our existing TypeScript
// dev dependency to load the real React components in the built-in test runner.
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

export async function load(url, context, nextLoad) {
  if (!new URL(url).pathname.endsWith('.tsx')) return nextLoad(url, context);
  const source = await readFile(new URL(url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });
  return { format: 'module', source: outputText, shortCircuit: true };
}
