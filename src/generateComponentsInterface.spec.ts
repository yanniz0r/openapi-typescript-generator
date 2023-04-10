import { describe, it, expect } from 'vitest'
import { generateComponentsInterfaces } from './generateComponentsInterface'

describe('generateComponentsInterface', () => {
  it('create a correctly named interface', () => {
    const a = generateComponentsInterfaces({
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
    expect(a).toMatchInlineSnapshot(`
      "type Cat = {
          name?: string;
          age?: number;
      };"
    `)
  })
  it('works with refs', () => {
    const a = generateComponentsInterfaces({
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
    expect(a).toMatchInlineSnapshot(`
      "type Breed = {
          name?: string;
      };

      type Cat = {
          breed?: Breed;
      };"
    `)
  })

  it('works with required properties', () => {
    const a = generateComponentsInterfaces({
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
    expect(a).toMatchInlineSnapshot(`
      "type Cat = {
          name?: string;
          age: number;
      };"
    `)
  })

  it('works with enums', () => {
    const a = generateComponentsInterfaces({
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
    expect(a).toMatchInlineSnapshot(`
      "type Breed = \\"persian\\" | \\"siamese\\";

      type Cat = {
          breed?: Breed;
      };"
    `)
  })

  it('works with anyOf', () => {
    const a = generateComponentsInterfaces({
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
    expect(a).toMatchInlineSnapshot(`
      "type CatBreed = \\"persian\\" | \\"siamese\\";

      type DogBreed = \\"labrador\\" | \\"poodle\\";

      type Animal = {
          breed?: DogBreed;
      } | {
          breed?: CatBreed;
      };"
    `)
  })

  it('works with nullable', () => {
    const a = generateComponentsInterfaces({
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
    expect(a).toMatchInlineSnapshot(`
      "type Cat = {
          name?: string | null;
      };"
    `)
  })

  it('works with arrays', () => {
    const a = generateComponentsInterfaces({
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
    expect(a).toMatchInlineSnapshot(`
      "type Animals = {
          name: string;
      }[];"
    `)
  })

  it('works with lugas', () => {
    const a = generateComponentsInterfaces({
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
    expect(a).toMatchInlineSnapshot(`
      "type Animals = {
          name: string;
      }[];"
    `)
  })

})