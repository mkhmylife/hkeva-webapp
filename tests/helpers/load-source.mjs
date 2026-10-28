import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Substitute framework request APIs while executing the real application code.
export function loadSource(file, imports, globals = {}) {
  const source = readFileSync(new URL(`../../${file}`, import.meta.url), 'utf8');
  const {outputText} = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
    },
  });
  const sourceModule = {exports: {}};
  vm.runInNewContext(outputText, {
    module: sourceModule,
    exports: sourceModule.exports,
    require: (name) => {
      assert.ok(Object.hasOwn(imports, name), `Unexpected import: ${name}`);
      return imports[name];
    },
    TextEncoder, Date, URL, console,
    process: {env: {SESSION_SECRET: 'test-only-session-secret'}},
    ...globals,
  }, {filename: file});
  return sourceModule.exports;
}
