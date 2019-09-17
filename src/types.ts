import {
  ErrorObject,
  RequiredParams,
  EnumParams,
  AdditionalPropertiesParams,
} from 'ajv';

export type Error = ErrorObject & {
  isIdentifierLocation?: boolean;
  shouldSkipEndLocation?: boolean;
};

type XError<T> = Error & {
  params: T;
};

export type RequiredError = XError<RequiredParams>;

export interface EnumError extends Error {
  params: EnumParams;
}

export interface AdditionalPropError extends Error {
  params: AdditionalPropertiesParams;
}

export interface Node {
  children: { [key: string]: Node };
  errors?: Array<Error>;
}

export interface Options {
  data: string;
  schema: string;
  jsonAst: object;
  jsonRaw: string;
}
