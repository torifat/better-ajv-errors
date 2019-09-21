import { readFileSync } from 'fs';
import { getFixturePath } from 'jest-fixtures';

export async function getSchemaAndData(name: string, dirPath: string) {
  const schemaPath = await getFixturePath(dirPath, name, 'schema.json');
  const schema: object = JSON.parse(readFileSync(schemaPath, 'utf8'));
  const dataPath = await getFixturePath(dirPath, name, 'data.json');
  const data: object = JSON.parse(readFileSync(dataPath, 'utf8'));

  return [schema, data];
}
