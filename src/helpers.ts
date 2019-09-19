import { Error, Node, Options } from './types';
import {
  getChildren,
  getErrors,
  getSiblings,
  isAnyOfError,
  isEnumError,
  isRequiredError,
  concatAll,
  notUndefined,
  areEnumErrors,
} from './utils';
import {
  AdditionalPropValidationError,
  RequiredValidationError,
  DefaultValidationError,
  EnumValidationError,
  BaseValidationError,
} from './validation-errors';

const JSON_POINTERS_REGEX = /\/[\w_-]+(\/\d+)?/g;

// Make a tree of errors from ajv errors array
export function makeTree(ajvErrors: Array<Error> = []) {
  const root: Node = { children: {}, errors: [] };
  ajvErrors.forEach(ajvError => {
    const { dataPath } = ajvError;

    // `dataPath === ''` is root
    const paths = dataPath === '' ? [''] : dataPath.match(JSON_POINTERS_REGEX);
    paths &&
      paths.reduce((obj, path, i) => {
        obj.children[path] = obj.children[path] || { children: {}, errors: [] };
        if (i === paths.length - 1) {
          obj.children[path].errors.push(ajvError);
        }
        return obj.children[path];
      }, root);
  });
  return root;
}

export function filterRedundantErrors(root: Node, parent?: Node, key?: string) {
  /**
   * If there is a `required` error then we can just skip everythig else.
   * And, also `required` should have more priority than `anyOf`. @see #8
   */
  getErrors(root).forEach(error => {
    if (isRequiredError(error)) {
      root.errors = [error];
      root.children = {};
    }
  });

  /**
   * If there is an `anyOf` error that means we have more meaningful errors
   * inside children. So we will just remove all errors from this level.
   *
   * If there are no children, then we don't delete the errors since we should
   * have at least one error to report.
   */
  if (getErrors(root).some(isAnyOfError)) {
    if (Object.keys(root.children).length > 0) {
      delete root.errors;
    }
  }

  /**
   * If all errors are `enum` and siblings have any error then we can safely
   * ignore the node.
   *
   * **CAUTION**
   * Need explicit `root.errors` check because `[].every(fn) === true`
   * https://en.wikipedia.org/wiki/Vacuous_truth#Vacuous_truths_in_mathematics
   */
  if (
    key &&
    parent &&
    root.errors &&
    root.errors.length &&
    getErrors(root).every(isEnumError)
  ) {
    if (
      getSiblings(parent)(root)
        // Remove any reference which becomes `undefined` later
        .filter(notUndefined)
        .some(getErrors)
    ) {
      delete parent.children[key];
    }
  }

  Object.entries(root.children).forEach(([key, child]) =>
    filterRedundantErrors(child, root, key)
  );
}

export function createErrorInstances(
  root: Node,
  options: Options
): Array<BaseValidationError> {
  const errors = getErrors(root);
  if (areEnumErrors(errors)) {
    const uniqueValues = new Set(
      concatAll<string>([])(errors.map(e => e.params.allowedValues))
    );
    const allowedValues = [...uniqueValues];
    const error = errors[0];
    return [
      new EnumValidationError(
        {
          ...error,
          params: { allowedValues },
        },
        options
      ),
    ];
  } else {
    return concatAll(
      errors.reduce<Array<BaseValidationError>>((ret, error) => {
        switch (error.keyword) {
          case 'additionalProperties':
            return ret.concat(
              new AdditionalPropValidationError(error, options)
            );
          case 'required':
            return ret.concat(new RequiredValidationError(error, options));
          default:
            return ret.concat(new DefaultValidationError(error, options));
        }
      }, [])
    )(getChildren(root).map(child => createErrorInstances(child, options)));
  }
}

// FIXME: Remove any
export default (ajvErrors: any, options: any) => {
  const tree = makeTree(ajvErrors || []);
  filterRedundantErrors(tree);
  return createErrorInstances(tree, options);
};
