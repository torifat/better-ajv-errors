import chalk from 'chalk';
import BaseValidationError from './base';
import { AdditionalPropError, Error } from '../types';

export default class AdditionalPropValidationError extends BaseValidationError {
  error: AdditionalPropError;

  constructor(error: Error, options) {
    super(error, options);
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
      error: `${this.getDecoratedPath(dataPath)} Property ${
        params.additionalProperty
      } is not expected to be here`,
      path: dataPath,
    };
  }
}
