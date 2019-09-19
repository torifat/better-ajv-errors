import { Error, Node, EnumError, RequiredError } from './types';

// Basic
const eq = <T>(x: T) => (y: T) => x === y;
const not = <T>(fn: (x: T) => boolean) => (x: T) => !fn(x);

export const notUndefined = <T>(x: T) => x !== undefined;

// Error
const isXError = <T extends Error>(x: string) => (error: Error): error is T =>
  error.keyword === x;
export const isRequiredError = isXError<RequiredError>('required');
export const isAnyOfError = isXError('anyOf');
export const isEnumError = isXError<EnumError>('enum');
export const areEnumErrors = (
  errors: Array<Error>
): errors is Array<EnumError> => !!(errors.length && errors.every(isEnumError));
export const getErrors = (node: Node) => (node && node.errors) || [];

// Node
export const getChildren = (node: Node): Array<Node> =>
  (node && Object.values<Node>(node.children)) || [];

export const getSiblings = (parent: Node) => (node: Node): Array<Node> =>
  getChildren(parent).filter(not(eq(node)));

export const concatAll = <T>(xs: Array<T>) => (ys: Array<T | Array<T>>) =>
  ys.reduce((zs: Array<T>, z) => zs.concat(z), xs);
