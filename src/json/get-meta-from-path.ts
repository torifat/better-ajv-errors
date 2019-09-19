import { ValueNode, IdentifierNode } from 'json-to-ast';
import { getPointers } from './utils';

export default function getMetaFromPath(
  jsonAst: ValueNode,
  dataPath: string,
  isIdentifierLocation: boolean = false
) {
  const pointers = getPointers(dataPath);
  const lastPointerIndex = pointers.length - 1;
  return pointers.reduce<ValueNode | IdentifierNode>((obj, pointer, idx) => {
    switch (obj.type) {
      case 'Object': {
        const filtered = obj.children.filter(
          child => child.key.value === pointer
        );
        if (filtered.length !== 1) {
          throw new Error(`Couldn't find property ${pointer} of ${dataPath}`);
        }
        const { key, value } = filtered[0];
        return isIdentifierLocation && idx === lastPointerIndex ? key : value;
      }
      case 'Array':
        return obj.children[+pointer];
      default:
        // eslint-disable-next-line no-console
        console.log(obj);
        return obj;
    }
  }, jsonAst);
}
