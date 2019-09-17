import parse from 'json-to-ast';
import RequiredValidationError from '../required';
import { getSchemaAndData } from './helpers';

describe('Required', () => {
  it('prints correctly for missing required prop', async () => {
    const [schema, data] = await getSchemaAndData('required', __dirname);
    const jsonRaw = JSON.stringify(data, null, 2);
    const jsonAst = parse(jsonRaw, { loc: true });

    const error = new RequiredValidationError(
      {
        keyword: 'required',
        dataPath: '/nested',
        schemaPath: '#/required',
        params: { missingProperty: 'id' },
        message: `should have required property 'id'`,
      },
      { data, schema, jsonRaw, jsonAst }
    );

    expect(error.print()).toMatchSnapshot();
  });
});
