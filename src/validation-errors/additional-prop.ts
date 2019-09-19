import chalk from 'chalk';
import ValidationError from './base';
import { AdditionalPropError, Options } from '../types';

export default class AdditionalPropValidationError extends ValidationError {
  error: AdditionalPropError;

  constructor(error: AdditionalPropError, options: Options) {
    super(error, options);
    this.error = error;
    this.error.isIdentifierLocation = true;
  }

  print() {
    const { message, dataPath, params } = this.error;
    const output = [chalk`{red {bold ADDTIONAL PROPERTY} ${message}}\n`];

    return output.concat(
      this.getCodeFrame(
        chalk`😲  {magentaBright ${params.additionalProperty}} is not expected to be here!`,
        `${dataPath}/${params.additionalProperty}`
      )
    );
  }

  getError() {
    const { params, dataPath } = this.error;

    return {
      ...this.getLocation(`${dataPath}/${params.additionalProperty}`),
      error: `${dataPath} Property ${params.additionalProperty} is not expected to be here`,
      path: dataPath,
    };
  }
}
