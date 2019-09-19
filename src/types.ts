import { ValueNode } from 'json-to-ast';
import {
  ErrorObject,
  RequiredParams,
  EnumParams,
  AdditionalPropertiesParams,
} from 'ajv';

type CutomErrorObject = ErrorObject & {
  isIdentifierLocation?: boolean;
  shouldSkipEndLocation?: boolean;
  // FIXME: Assuming there's no point of using this libray
  // if your error messages are turned off ¯\_(ツ)_/¯
  message: string;
};

type ErrorBuilder<T, U> = CutomErrorObject & {
  keyword: T;
  params: U;
};

export type RequiredError = ErrorBuilder<'required', RequiredParams>;
export type EnumError = ErrorBuilder<'enum', EnumParams>;
export type AdditionalPropError = ErrorBuilder<
  'additionalProperties',
  AdditionalPropertiesParams
>;

export type Error = RequiredError | EnumError | AdditionalPropError;

export interface Node {
  children: { [key: string]: Node };
  errors: Array<Error>;
}

export interface Options {
  data: object;
  schema: string;
  jsonAst: ValueNode;
  jsonRaw: string;
}
