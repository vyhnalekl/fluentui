import { SourceFile } from 'ts-morph';

export interface CodeModResult {
  success?: boolean;
}

export interface CodeMod<T = SourceFile> {
  /**
   * Each type of codemod can have multiple versions which work on different versions of its targeted package.
   * Must be valid semver.
   * TODO: Currently version is not being checked. Implement this fully or remove.
   */
  version?: string;
  /**
   * A string to help identify the codemod.
   */
  name: string;
  /**
   * The actual function that should be run on any given file.
   * TODO, is there a possibility of codemods that would need to execute over mutiple files?
   */
  run: (file: T) => CodeModResult;
  /**
   * If not enabled, then this mod will not be conisdered to run. Only enable it once it's ready
   * to be applied in real world scenarios
   */
  enabled?: boolean;
}

export type EnumMap<T> = {
  [key: string]: T;
};

/**
 * Generic function provided by the utility caller that executes a
 * transform for a prop's value.
 * This function takes in an enum type, and returns a transformed version of the enum in string form.
 * ex. SpinnerType.normal
 * might return the string
 * 'SpinnerSize.medium'
 */
export type PropTransform<T = string> = (enumType: T) => string;
