import chalk from 'chalk';
import BaseValidationError from './base';
import { RequiredError } from '../types';

export default class RequiredValidationError extends BaseValidationError {
  error: RequiredError;

  getLocation(dataPath = this.error.dataPath) {
    const { start } = super.getLocation(dataPath);
    return { start };
  }

  print() {
    const { message, params } = this.error;
    const output = [chalk`{red {bold REQUIRED} ${message}}\n`];

    return output.concat(
      this.getCodeFrame(
        chalk`☹️  {magentaBright ${params.missingProperty}} is missing here!`
      )
    );
  }

  getError() {
    const { message, dataPath } = this.error;

    return {
      ...this.getLocation(),
      error: `${this.getDecoratedPath(dataPath)} ${message}`,
      path: dataPath,
    };
  }
}
