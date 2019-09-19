import { readFileSync } from 'fs';
import parse from 'json-to-ast';
import { getFixturePath } from 'jest-fixtures';
import { getMetaFromPath } from '..';

async function loadScenario(n: number) {
  const fixturePath = await getFixturePath(__dirname, `scenario-${n}.json`);
  return readFileSync(fixturePath, 'utf8');
}

describe('getMetaFromPath', () => {
  it('can work on simple JSON', async () => {
    const rawJson = await loadScenario(1);
    const jsonAst = parse(rawJson, { loc: true });
    expect(getMetaFromPath(jsonAst, '/foo')).toMatchInlineSnapshot(`
      Object {
        "loc": Object {
          "end": Object {
            "column": 15,
            "line": 2,
            "offset": 16,
          },
          "source": null,
          "start": Object {
            "column": 10,
            "line": 2,
            "offset": 11,
          },
        },
        "raw": "\\"bar\\"",
        "type": "Literal",
        "value": "bar",
      }
    `);
    expect(getMetaFromPath(jsonAst, '/foo', true)).toMatchInlineSnapshot(`
      Object {
        "loc": Object {
          "end": Object {
            "column": 8,
            "line": 2,
            "offset": 9,
          },
          "source": null,
          "start": Object {
            "column": 3,
            "line": 2,
            "offset": 4,
          },
        },
        "raw": "\\"foo\\"",
        "type": "Identifier",
        "value": "foo",
      }
    `);
  });

  it('can work on JSON with a key named value', async () => {
    const rawJson = await loadScenario(2);
    const jsonAst = parse(rawJson, { loc: true });
    expect(getMetaFromPath(jsonAst, '/value')).toMatchInlineSnapshot(`
      Object {
        "loc": Object {
          "end": Object {
            "column": 14,
            "line": 3,
            "offset": 31,
          },
          "source": null,
          "start": Object {
            "column": 12,
            "line": 3,
            "offset": 29,
          },
        },
        "raw": "20",
        "type": "Literal",
        "value": 20,
      }
    `);
    expect(getMetaFromPath(jsonAst, '/value', true)).toMatchInlineSnapshot(`
      Object {
        "loc": Object {
          "end": Object {
            "column": 10,
            "line": 3,
            "offset": 27,
          },
          "source": null,
          "start": Object {
            "column": 3,
            "line": 3,
            "offset": 20,
          },
        },
        "raw": "\\"value\\"",
        "type": "Identifier",
        "value": "value",
      }
    `);
  });

  it('can work on JSON with a key named meta', async () => {
    const rawJson = await loadScenario(3);
    const jsonAst = parse(rawJson, { loc: true });
    expect(getMetaFromPath(jsonAst, '/meta/isMeta')).toMatchInlineSnapshot(`
      Object {
        "loc": Object {
          "end": Object {
            "column": 19,
            "line": 4,
            "offset": 48,
          },
          "source": null,
          "start": Object {
            "column": 15,
            "line": 4,
            "offset": 44,
          },
        },
        "raw": "true",
        "type": "Literal",
        "value": true,
      }
    `);
    expect(getMetaFromPath(jsonAst, '/meta/isMeta', true))
      .toMatchInlineSnapshot(`
      Object {
        "loc": Object {
          "end": Object {
            "column": 13,
            "line": 4,
            "offset": 42,
          },
          "source": null,
          "start": Object {
            "column": 5,
            "line": 4,
            "offset": 34,
          },
        },
        "raw": "\\"isMeta\\"",
        "type": "Identifier",
        "value": "isMeta",
      }
    `);
  });

  it('can work on JSON with Array', async () => {
    const rawJson = await loadScenario(4);
    const jsonAst = parse(rawJson, { loc: true });
    expect(getMetaFromPath(jsonAst, '/arr/1/foo')).toMatchInlineSnapshot(`
      Object {
        "loc": Object {
          "end": Object {
            "column": 19,
            "line": 6,
            "offset": 60,
          },
          "source": null,
          "start": Object {
            "column": 14,
            "line": 6,
            "offset": 55,
          },
        },
        "raw": "\\"bar\\"",
        "type": "Literal",
        "value": "bar",
      }
    `);
    expect(getMetaFromPath(jsonAst, '/arr/1/foo', true)).toMatchInlineSnapshot(`
      Object {
        "loc": Object {
          "end": Object {
            "column": 12,
            "line": 6,
            "offset": 53,
          },
          "source": null,
          "start": Object {
            "column": 7,
            "line": 6,
            "offset": 48,
          },
        },
        "raw": "\\"foo\\"",
        "type": "Identifier",
        "value": "foo",
      }
    `);
  });

  it('can work with unescaped JSON pointers with ~1', async () => {
    const rawJson = await loadScenario(5);
    const jsonAst = parse(rawJson, { loc: true });
    expect(getMetaFromPath(jsonAst, '/foo/~1some~1path/value'))
      .toMatchInlineSnapshot(`
      Object {
        "loc": Object {
          "end": Object {
            "column": 17,
            "line": 4,
            "offset": 49,
          },
          "source": null,
          "start": Object {
            "column": 16,
            "line": 4,
            "offset": 48,
          },
        },
        "raw": "1",
        "type": "Literal",
        "value": 1,
      }
    `);
  });

  it('can work with unescaped JSON pointers with ~0', async () => {
    const rawJson = await loadScenario(5);
    const jsonAst = parse(rawJson, { loc: true });
    expect(getMetaFromPath(jsonAst, '/foo/~0some~0path/value'))
      .toMatchInlineSnapshot(`
      Object {
        "loc": Object {
          "end": Object {
            "column": 17,
            "line": 7,
            "offset": 93,
          },
          "source": null,
          "start": Object {
            "column": 16,
            "line": 7,
            "offset": 92,
          },
        },
        "raw": "2",
        "type": "Literal",
        "value": 2,
      }
    `);
  });
});
