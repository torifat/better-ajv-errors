import { codeFrameColumns, SourceLocation } from '@babel/code-frame';
import { getMetaFromPath } from '../json';
import { Error, Options } from '../types';

export interface ErrorOutput extends SourceLocation {
  error: string;
  path: string;
  suggestion?: string;
}

export default class ValidationError {
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

  getLocation(dataPath = this.error.dataPath): SourceLocation {
    const { isIdentifierLocation, shouldSkipEndLocation } = this.error;
    const { loc } = getMetaFromPath(
      this.jsonAst,
      dataPath,
      isIdentifierLocation
    );

    if (!loc) {
      throw new Error(`Location not found for path: ${dataPath}`);
    }

    return {
      start: loc.start,
      end: shouldSkipEndLocation ? undefined : loc.end,
    };
  }

  getCodeFrame(message: string, dataPath = this.error.dataPath) {
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
