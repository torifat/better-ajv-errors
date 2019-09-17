import { codeFrameColumns } from '@babel/code-frame';
import { getMetaFromPath, getDecoratedDataPath } from '../json';
import { Error, Options } from '../types';

interface Location {
  start: number;
  end?: number;
}

export interface ErrorOutput extends Location {
  error: string;
  path: string;
  suggestion?: string;
}

export default class BaseValidationError {
  protected error: Error;
  protected data: Options['data'];
  protected schema: Options['schema'];
  protected jsonAst: Options['jsonAst'];
  protected jsonRaw: Options['jsonRaw'];

  constructor(error: Error, { data, schema, jsonAst, jsonRaw }: Options) {
    this.error = error;
    this.data = data;
    this.schema = schema;
    this.jsonAst = jsonAst;
    this.jsonRaw = jsonRaw;
  }

  getLocation(dataPath = this.error.dataPath): Location {
    const { isIdentifierLocation, shouldSkipEndLocation } = this.error;
    const { loc } = getMetaFromPath(
      this.jsonAst,
      dataPath,
      isIdentifierLocation
    );
    return {
      start: loc.start,
      end: shouldSkipEndLocation ? undefined : loc.end,
    };
  }

  getDecoratedPath(dataPath = this.error.dataPath) {
    const decoratedPath = getDecoratedDataPath(this.jsonAst, dataPath);
    return decoratedPath;
  }

  getCodeFrame(message, dataPath = this.error.dataPath) {
    return codeFrameColumns(this.jsonRaw, this.getLocation(dataPath), {
      highlightCode: true,
      message,
    });
  }

  print() {
    throw new Error(
      `Implement the 'print' method inside ${this.constructor.name}!`
    );
  }

  getError(): ErrorOutput {
    throw new Error(
      `Implement the 'getError' method inside ${this.constructor.name}!`
    );
  }
}
