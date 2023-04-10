import { describe, it, expect } from 'vitest'
import { generateSchemasType } from '../src/generateSchemasType'
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
    const type = generateSchemasType({
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
      "type Schemas = {
          Cat: {
              name?: string;
              age?: number;
          };
      };"
    `)
  })
  it('works with refs', () => {
    const type = generateSchemasType({
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
      "type Schemas = {
          Breed: {
              name?: string;
          };
          Cat: {
              breed?: Schemas[\\"Breed\\"];
          };
      };"
    `)
  })

  it('works with required properties', () => {
    const type = generateSchemasType({
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
      "type Schemas = {
          Cat: {
              name?: string;
              age: number;
          };
      };"
    `)
  })

  it('works with enums', () => {
    const type = generateSchemasType({
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
      "type Schemas = {
          Breed: \\"persian\\" | \\"siamese\\";
          Cat: {
              breed?: Schemas[\\"Breed\\"];
          };
      };"
    `)
  })

  it('works with anyOf', () => {
    const type = generateSchemasType({
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
      "type Schemas = {
          CatBreed: \\"persian\\" | \\"siamese\\";
          DogBreed: \\"labrador\\" | \\"poodle\\";
          Animal: {
              breed?: Schemas[\\"DogBreed\\"];
          } | {
              breed?: Schemas[\\"CatBreed\\"];
          };
      };"
    `)
  })

  it('works with nullable', () => {
    const type = generateSchemasType({
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
      "type Schemas = {
          Cat: {
              name?: string | null;
          };
      };"
    `)
  })

  it('works with arrays', () => {
    const type = generateSchemasType({
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
      "type Schemas = {
          Animals: {
              name: string;
          }[];
      };"
    `)
  })

  it('works with arrays', () => {
    const type = generateSchemasType({
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
      "type Schemas = {
          Animals: {
              name: string;
          }[];
      };"
    `)
  })

})