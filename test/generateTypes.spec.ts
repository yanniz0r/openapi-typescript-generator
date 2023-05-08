import { describe, expect, it } from "vitest";
import petstoreOpenapi from './__fixtures__/petstore.json';
import { generateTypes } from "../src/generateTypes";
import { OpenAPIV3, OpenAPIV3_1 } from "openapi-types";
import ts from "typescript";

function typesToString(types: ts.NodeArray<any>) {
  const resultFile = ts.createSourceFile(
    "someFileName.ts",
    "",
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS
  );
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  return printer.printList(
    ts.ListFormat.AllowTrailingComma,
    types,
    resultFile,
  )
}

describe('generateTypes', () => {
  it('generates correct types petstore example', () => {
    const types = generateTypes(petstoreOpenapi as any);
    expect(typesToString(types)).toMatchInlineSnapshot(`
      "type Components = {
          Schemas: {
              Order: {
                  id?: number;
                  petId?: number;
                  quantity?: number;
                  shipDate?: string;
                  status?: \\"placed\\" | \\"approved\\" | \\"delivered\\";
                  complete?: boolean;
              };
              Customer: {
                  id?: number;
                  username?: string;
                  address?: Components[\\"Schemas\\"][\\"Address\\"][];
              };
              Address: {
                  street?: string;
                  city?: string;
                  state?: string;
                  zip?: string;
              };
              Category: {
                  id?: number;
                  name?: string;
              };
              User: {
                  id?: number;
                  username?: string;
                  firstName?: string;
                  lastName?: string;
                  email?: string;
                  password?: string;
                  phone?: string;
                  userStatus?: number;
              };
              Tag: {
                  id?: number;
                  name?: string;
              };
              Pet: {
                  id?: number;
                  name: string;
                  category?: Components[\\"Schemas\\"][\\"Category\\"];
                  photoUrls: string[];
                  tags?: Components[\\"Schemas\\"][\\"Tag\\"][];
                  status?: \\"available\\" | \\"pending\\" | \\"sold\\";
              };
              ApiResponse: {
                  code?: number;
                  type?: string;
                  message?: string;
              };
          };
          RequestBodies: {
              Pet: {
                  \\"application/json\\": Components[\\"Schemas\\"][\\"Pet\\"];
                  \\"application/xml\\": Components[\\"Schemas\\"][\\"Pet\\"];
              };
              UserArray: {
                  \\"application/json\\": Components[\\"Schemas\\"][\\"User\\"][];
              };
          };
          Responses: {};
      };
      type Paths = {
          \\"/pet\\": {
              POST: {
                  Responses: {
                      200: {
                          \\"application/xml\\": Components[\\"Schemas\\"][\\"Pet\\"];
                          \\"application/json\\": Components[\\"Schemas\\"][\\"Pet\\"];
                      };
                      405: {};
                  };
                  Parameters: {};
                  RequestBody: {
                      \\"application/json\\": Components[\\"Schemas\\"][\\"Pet\\"];
                      \\"application/xml\\": Components[\\"Schemas\\"][\\"Pet\\"];
                      \\"application/x-www-form-urlencoded\\": Components[\\"Schemas\\"][\\"Pet\\"];
                  };
              };
              PUT: {
                  Responses: {
                      200: {
                          \\"application/xml\\": Components[\\"Schemas\\"][\\"Pet\\"];
                          \\"application/json\\": Components[\\"Schemas\\"][\\"Pet\\"];
                      };
                      400: {};
                      404: {};
                      405: {};
                  };
                  Parameters: {};
                  RequestBody: {
                      \\"application/json\\": Components[\\"Schemas\\"][\\"Pet\\"];
                      \\"application/xml\\": Components[\\"Schemas\\"][\\"Pet\\"];
                      \\"application/x-www-form-urlencoded\\": Components[\\"Schemas\\"][\\"Pet\\"];
                  };
              };
          };
          \\"/pet/findByStatus\\": {
              GET: {
                  Responses: {
                      200: {
                          \\"application/xml\\": Components[\\"Schemas\\"][\\"Pet\\"][];
                          \\"application/json\\": Components[\\"Schemas\\"][\\"Pet\\"][];
                      };
                      400: {};
                  };
                  Parameters: {
                      Query: {
                          status: \\"available\\" | \\"pending\\" | \\"sold\\";
                      };
                  };
                  RequestBody: {};
              };
          };
          \\"/pet/findByTags\\": {
              GET: {
                  Responses: {
                      200: {
                          \\"application/xml\\": Components[\\"Schemas\\"][\\"Pet\\"][];
                          \\"application/json\\": Components[\\"Schemas\\"][\\"Pet\\"][];
                      };
                      400: {};
                  };
                  Parameters: {
                      Query: {
                          tags: string[];
                      };
                  };
                  RequestBody: {};
              };
          };
          \\"/pet/{petId}\\": {
              GET: {
                  Responses: {
                      200: {
                          \\"application/xml\\": Components[\\"Schemas\\"][\\"Pet\\"];
                          \\"application/json\\": Components[\\"Schemas\\"][\\"Pet\\"];
                      };
                      400: {};
                      404: {};
                  };
                  Parameters: {
                      Path: {
                          petId: number;
                      };
                  };
                  RequestBody: {};
              };
              POST: {
                  Responses: {
                      405: {};
                  };
                  Parameters: {
                      Path: {
                          petId: number;
                      };
                      Query: {
                          name: string;
                          status: string;
                      };
                  };
                  RequestBody: {};
              };
              DELETE: {
                  Responses: {
                      400: {};
                  };
                  Parameters: {
                      Header: {
                          api_key: string;
                      };
                      Path: {
                          petId: number;
                      };
                  };
                  RequestBody: {};
              };
          };
          \\"/pet/{petId}/uploadImage\\": {
              POST: {
                  Responses: {
                      200: {
                          \\"application/json\\": Components[\\"Schemas\\"][\\"ApiResponse\\"];
                      };
                  };
                  Parameters: {
                      Path: {
                          petId: number;
                      };
                      Query: {
                          additionalMetadata: string;
                      };
                  };
                  RequestBody: {
                      \\"application/octet-stream\\": string;
                  };
              };
          };
          \\"/store/inventory\\": {
              GET: {
                  Responses: {
                      200: {
                          \\"application/json\\": {};
                      };
                  };
                  Parameters: {};
                  RequestBody: {};
              };
          };
          \\"/store/order\\": {
              POST: {
                  Responses: {
                      200: {
                          \\"application/json\\": Components[\\"Schemas\\"][\\"Order\\"];
                      };
                      405: {};
                  };
                  Parameters: {};
                  RequestBody: {
                      \\"application/json\\": Components[\\"Schemas\\"][\\"Order\\"];
                      \\"application/xml\\": Components[\\"Schemas\\"][\\"Order\\"];
                      \\"application/x-www-form-urlencoded\\": Components[\\"Schemas\\"][\\"Order\\"];
                  };
              };
          };
          \\"/store/order/{orderId}\\": {
              GET: {
                  Responses: {
                      200: {
                          \\"application/xml\\": Components[\\"Schemas\\"][\\"Order\\"];
                          \\"application/json\\": Components[\\"Schemas\\"][\\"Order\\"];
                      };
                      400: {};
                      404: {};
                  };
                  Parameters: {
                      Path: {
                          orderId: number;
                      };
                  };
                  RequestBody: {};
              };
              DELETE: {
                  Responses: {
                      400: {};
                      404: {};
                  };
                  Parameters: {
                      Path: {
                          orderId: number;
                      };
                  };
                  RequestBody: {};
              };
          };
          \\"/user\\": {
              POST: {
                  Responses: {
                      default: {
                          \\"application/json\\": Components[\\"Schemas\\"][\\"User\\"];
                          \\"application/xml\\": Components[\\"Schemas\\"][\\"User\\"];
                      };
                  };
                  Parameters: {};
                  RequestBody: {
                      \\"application/json\\": Components[\\"Schemas\\"][\\"User\\"];
                      \\"application/xml\\": Components[\\"Schemas\\"][\\"User\\"];
                      \\"application/x-www-form-urlencoded\\": Components[\\"Schemas\\"][\\"User\\"];
                  };
              };
          };
          \\"/user/createWithList\\": {
              POST: {
                  Responses: {
                      200: {
                          \\"application/xml\\": Components[\\"Schemas\\"][\\"User\\"];
                          \\"application/json\\": Components[\\"Schemas\\"][\\"User\\"];
                      };
                      default: {};
                  };
                  Parameters: {};
                  RequestBody: {
                      \\"application/json\\": Components[\\"Schemas\\"][\\"User\\"][];
                  };
              };
          };
          \\"/user/login\\": {
              GET: {
                  Responses: {
                      200: {
                          \\"application/xml\\": string;
                          \\"application/json\\": string;
                      };
                      400: {};
                  };
                  Parameters: {
                      Query: {
                          username: string;
                          password: string;
                      };
                  };
                  RequestBody: {};
              };
          };
          \\"/user/logout\\": {
              GET: {
                  Responses: {
                      default: {};
                  };
                  Parameters: {};
                  RequestBody: {};
              };
          };
          \\"/user/{username}\\": {
              GET: {
                  Responses: {
                      200: {
                          \\"application/xml\\": Components[\\"Schemas\\"][\\"User\\"];
                          \\"application/json\\": Components[\\"Schemas\\"][\\"User\\"];
                      };
                      400: {};
                      404: {};
                  };
                  Parameters: {
                      Path: {
                          username: string;
                      };
                  };
                  RequestBody: {};
              };
              DELETE: {
                  Responses: {
                      400: {};
                      404: {};
                  };
                  Parameters: {
                      Path: {
                          username: string;
                      };
                  };
                  RequestBody: {};
              };
              PUT: {
                  Responses: {
                      default: {};
                  };
                  Parameters: {
                      Path: {
                          username: string;
                      };
                  };
                  RequestBody: {
                      \\"application/json\\": Components[\\"Schemas\\"][\\"User\\"];
                      \\"application/xml\\": Components[\\"Schemas\\"][\\"User\\"];
                      \\"application/x-www-form-urlencoded\\": Components[\\"Schemas\\"][\\"User\\"];
                  };
              };
          };
      };"
    `)
  });
})