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

describe('generateComponentsInterface', () => {
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
          Cat: {
              name?: string;
              age?: number;
          };
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
          Breed: {
              name?: string;
          };
          Cat: {
              breed?: Breed;
          };
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
          Cat: {
              name?: string;
              age: number;
          };
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
          Breed: \\"persian\\" | \\"siamese\\";
          Cat: {
              breed?: Breed;
          };
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
          CatBreed: \\"persian\\" | \\"siamese\\";
          DogBreed: \\"labrador\\" | \\"poodle\\";
          Animal: {
              breed?: DogBreed;
          } | {
              breed?: CatBreed;
          };
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
          Cat: {
              name?: string | null;
          };
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
          Animals: {
              name: string;
          }[];
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
          Animals: {
              name: string;
          }[];
      };"
    `)
  })

})