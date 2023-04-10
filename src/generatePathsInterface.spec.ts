import { describe, it, expect } from 'vitest'
import { generatePathsInterface } from './generatePathsInterface'

describe('generateComponentsInterface', () => {
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
    const a = generatePathsInterface({
      '/foo/bar': {
        post: mutatingMethod,
        put: mutatingMethod,
        patch: mutatingMethod,
      }
    })
    expect(a).toMatchInlineSnapshot(`
      "import type foo from \\"bar\\";
      type Paths = {
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
                      };
                  };
              };
          };
      };"
    `)
  })
})
