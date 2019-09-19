import chalk from 'chalk';
import ValidationError from './base';
import { RequiredError, Options } from '../types';

export default class RequiredValidationError extends ValidationError {
  constructor(public error: RequiredError, options: Options) {
    super(error, options);
  }

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
      error: `${dataPath} ${message}`,
      path: dataPath,
    };
  }
}
