import { describe, it, expect } from 'vitest'
import { generatePathsType } from '../src/generatePathsType'
import ts from 'typescript'

function typeToString(node: ts.Node) {
  const resultFile = ts.createSourceFile(
    "testfile.ts",
    "",
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS
  );
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  return printer.printNode(
    ts.EmitHint.Unspecified,
    node,
    resultFile,
  )
}

describe('generatePathsType', () => {
  it('create a correctly named interface', () => {
    const mutatingMethod = {
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                foo: {
                  type: 'string'
                },
                bar: {
                  $ref: '#/components/schemas/BarType'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'OK',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string'
                  }
                }
              }
            }
          }
        },
        201: {
          description: 'Created',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      }
    } as const
    const type = generatePathsType({
      '/foo/bar': {
        post: mutatingMethod,
        put: mutatingMethod,
        patch: mutatingMethod,
      }
    })
    expect(typeToString(type)).toMatchInlineSnapshot(`
      "type Paths = {
          \\"/foo/bar\\": {
              POST: {
                  Responses: {
                      200: {
                          \\"application/json\\": {
                              name?: string;
                          };
                      };
                      201: {
                          \\"application/json\\": {
                              name?: string;
                          };
                      };
                  };
                  RequestBody: {
                      \\"application/json\\": {
                          foo?: string;
                          bar?: Schemas[\\"BarType\\"];
                      };
                  };
              };
              PUT: {
                  Responses: {
                      200: {
                          \\"application/json\\": {
                              name?: string;
                          };
                      };
                      201: {
                          \\"application/json\\": {
                              name?: string;
                          };
                      };
                  };
                  RequestBody: {
                      \\"application/json\\": {
                          foo?: string;
                          bar?: Schemas[\\"BarType\\"];
                      };
                  };
              };
              PATCH: {
                  Responses: {
                      200: {
                          \\"application/json\\": {
                              name?: string;
                          };
                      };
                      201: {
                          \\"application/json\\": {
                              name?: string;
                          };
                      };
                  };
                  RequestBody: {
                      \\"application/json\\": {
                          foo?: string;
                          bar?: Schemas[\\"BarType\\"];
                      };
                  };
              };
          };
      };"
    `)
  })
})
