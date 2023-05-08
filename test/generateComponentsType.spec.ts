import { describe, it, expect } from 'vitest'
import { generateComponentsType } from '../src/generateComponentsType'
import ts from 'typescript';

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

describe('generateSchemasType', () => {
  it('create a correctly named interface', () => {
    const type = generateComponentsType({
      schemas: {
        Cat: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            age: {
              type: 'integer',
            },
          }
        }
      }
    })
    expect(typeToString(type)).toMatchInlineSnapshot(`
      "type Components = {
          Schemas: {
              Cat: {
                  name?: string;
                  age?: number;
              };
          };
          RequestBodies: {};
          Responses: {};
      };"
    `)
  })
  it('works with refs', () => {
    const type = generateComponentsType({
      schemas: {
        Breed: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            }
          }
        },
        Cat: {
          type: 'object',
          properties: {
            breed: {
              $ref: '#/components/schemas/Breed'
            }
          }
        }
      }
    })
    expect(typeToString(type)).toMatchInlineSnapshot(`
      "type Components = {
          Schemas: {
              Breed: {
                  name?: string;
              };
              Cat: {
                  breed?: Components[\\"Schemas\\"][\\"Breed\\"];
              };
          };
          RequestBodies: {};
          Responses: {};
      };"
    `)
  })

  it('works with required properties', () => {
    const type = generateComponentsType({
      schemas: {
        Cat: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            age: {
              type: 'number',
            }
          },
          required: [
            'age'
          ]
        },
      }
    })
    expect(typeToString(type)).toMatchInlineSnapshot(`
      "type Components = {
          Schemas: {
              Cat: {
                  name?: string;
                  age: number;
              };
          };
          RequestBodies: {};
          Responses: {};
      };"
    `)
  })

  it('works with enums', () => {
    const type = generateComponentsType({
      schemas: {
        Breed: {
          type: 'string',
          enum: ['persian', 'siamese']
        },
        Cat: {
          type: 'object',
          properties: {
            breed: {
              $ref: '#/components/schemas/Breed'
            }
          }
        }
      }
    })
    expect(typeToString(type)).toMatchInlineSnapshot(`
      "type Components = {
          Schemas: {
              Breed: \\"persian\\" | \\"siamese\\";
              Cat: {
                  breed?: Components[\\"Schemas\\"][\\"Breed\\"];
              };
          };
          RequestBodies: {};
          Responses: {};
      };"
    `)
  })

  it('works with anyOf', () => {
    const type = generateComponentsType({
      schemas: {
        CatBreed: {
          type: 'string',
          enum: ['persian', 'siamese']
        },
        DogBreed: {
          type: 'string',
          enum: ['labrador', 'poodle']
        },
        Animal: {
          anyOf: [
            {
              type: 'object',
              properties: {
                breed: {
                  $ref: '#/components/schemas/DogBreed'
                }
              }
            },
            {
              type: 'object',
              properties: {
                breed: {
                  $ref: '#/components/schemas/CatBreed'
                }
              }
            }
          ]
        }
      }
    })
    expect(typeToString(type)).toMatchInlineSnapshot(`
      "type Components = {
          Schemas: {
              CatBreed: \\"persian\\" | \\"siamese\\";
              DogBreed: \\"labrador\\" | \\"poodle\\";
              Animal: {
                  breed?: Components[\\"Schemas\\"][\\"DogBreed\\"];
              } | {
                  breed?: Components[\\"Schemas\\"][\\"CatBreed\\"];
              };
          };
          RequestBodies: {};
          Responses: {};
      };"
    `)
  })

  it('works with nullable', () => {
    const type = generateComponentsType({
      schemas: {
        Cat: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              nullable: true,
            }
          }
        }
      }
    })
    expect(typeToString(type)).toMatchInlineSnapshot(`
      "type Components = {
          Schemas: {
              Cat: {
                  name?: string | null;
              };
          };
          RequestBodies: {};
          Responses: {};
      };"
    `)
  })

  it('works with arrays', () => {
    const type = generateComponentsType({
      schemas: {
        Animals: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              }
            },
            required: ['name']
          }
        }
      }
    })
    expect(typeToString(type)).toMatchInlineSnapshot(`
      "type Components = {
          Schemas: {
              Animals: {
                  name: string;
              }[];
          };
          RequestBodies: {};
          Responses: {};
      };"
    `)
  })

  it('works with arrays', () => {
    const type = generateComponentsType({
      schemas: {
        Animals: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              }
            },
            required: ['name']
          }
        }
      }
    })
    expect(typeToString(type)).toMatchInlineSnapshot(`
      "type Components = {
          Schemas: {
              Animals: {
                  name: string;
              }[];
          };
          RequestBodies: {};
          Responses: {};
      };"
    `)
  })

})