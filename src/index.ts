import { ErrorObject } from 'ajv';
import parse from 'json-to-ast';
import prettify from './helpers';
import { ValidationError } from './validation-errors';

interface InputOptions {
  format?: 'cli' | 'js';
  indent?: number;
}

const customErrorToText = (error: ValidationError) => error.print().join('\n');
const customErrorToStructure = (error: ValidationError) => error.getError();

export default (
  schema: object,
  data: object,
  errors: Array<ErrorObject>,
  options: InputOptions = {}
) => {
  const { format = 'cli', indent } = options;

  const jsonRaw = JSON.stringify(data, null, indent);
  const jsonAst = parse(jsonRaw, { loc: true });
  const customErrors = prettify(errors, {
    data,
    schema,
    jsonAst,
    jsonRaw,
  });

  if (format === 'cli') {
    return customErrors.map(customErrorToText).join('\n\n');
  } else {
    return customErrors.map(customErrorToStructure);
  }
};
