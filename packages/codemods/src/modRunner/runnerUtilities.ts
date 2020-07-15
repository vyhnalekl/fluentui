import { CodeMod } from '../codeMods/types';
import { Glob } from 'glob';
import { Range } from 'semver';
import { Maybe, Nothing, Just } from '../maybe';

// TODO ensure that async for all these utilities works
export function runMods<T>(
  codeMods: CodeMod<T>[],
  sources: T[],
  loggingCallback: (result: { mod: CodeMod<T>; file: T; error?: Error }) => void,
) {
  for (const file of sources) {
    // Run every mod on each file?
    // I like that
    for (const mod of codeMods) {
      try {
        mod.run(file);
        loggingCallback({ mod, file });
      } catch (e) {
        loggingCallback({ mod, file, error: e });
      }
    }
  }
}

export function getModsRootPath() {
  // This function always needs to be in a folder that is a sibling
  // of codeMods.
  return `${__dirname}/../codeMods/mods`;
}

export function getModsPattern(includeTs: boolean = false) {
  // For testing
  if (includeTs) {
    return '/**/*.@(js|ts)';
  }

  return '/**/*.mod.js';
}

export function getModsPaths(root: string = getModsRootPath(), modsPath: string = getModsPattern()) {
  const glob = new Glob(modsPath, {
    absolute: false,
    root: root,
    sync: true,
  });
  return glob.found;
}

// Note, this root will be wherever the npx command is run from.
// For now it will need to be run at the root of the project/monorepo

export function getTsConfigs(root: string = process.cwd()) {
  const glob = new Glob('/**/tsconfig.json', {
    absolute: false,
    ignore: ['**/node_modules/**'],
    root: root,
    sync: true,
  });

  return glob.found;
}

export function loadMod(path: string, errorCallback: (e: Error) => void): Maybe<CodeMod> {
  try {
    const mod = require(path).default;
    return Maybe<CodeMod>(mod);
  } catch (e) {
    errorCallback(e);
  }

  return Nothing();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function filterMods(codeMods: CodeMod<any>[], semverRange: Range) {
  return codeMods.filter(mod => shouldRunMod(mod, semverRange));
}

// Defaults to allowing almost any version to run.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function shouldRunMod(mod: CodeMod<any>, semverRange: Range = new Range('>0 <1000')) {
  return mod.enabled && semverRange.test(mod.version || '*');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function modEnabled(mod: Maybe<CodeMod<any>>): mod is Just<CodeMod<any>> {
  return mod.then(v => !!v.enabled).orElse(false);
}
