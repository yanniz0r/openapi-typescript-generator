import { OpenAPIV3 } from "openapi-types";
import ts from "typescript";
import { getTypescriptType } from "./getTypescriptType";

function getRequestBody(requestBody?: OpenAPIV3.RequestBodyObject | OpenAPIV3.ReferenceObject) {
  if (!requestBody || "$ref" in requestBody) {
    return ts.factory.createTypeLiteralNode([])
  }

  return ts.factory.createTypeLiteralNode(
    Object.entries(requestBody.content).map(([contentType, type]) => {
      return ts.factory.createPropertySignature(
        undefined,
        ts.factory.createIdentifier(`"${contentType}"`),
        undefined,
        getTypescriptType(type.schema!)
      );
    })
  )
}

function getResponseType(
  responses: OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject,
) {
  if (!responses || "$ref" in responses) {
    throw Error("Not supported yet");
  }
  const content = responses.content || {};

  return ts.factory.createTypeLiteralNode(
    Object.entries(content).map(([contentType, type]) => {
      return ts.factory.createPropertySignature(
        undefined,
        ts.factory.createIdentifier(`"${contentType}"`),
        undefined,
        getTypescriptType(type.schema!)
      );
    })
  )
}

function getMethodType(
  method: string,
  responses: OpenAPIV3.ResponsesObject,
  requestBody?: OpenAPIV3.RequestBodyObject | OpenAPIV3.ReferenceObject
) {
  return ts.factory.createPropertySignature(
    undefined,
    method.toUpperCase(),
    undefined,
    ts.factory.createTypeLiteralNode([
      ts.factory.createPropertySignature(
        undefined,
        "Responses",
        undefined,
        ts.factory.createTypeLiteralNode(
          Object.entries(responses).map(([status, response]) => {
            return ts.factory.createPropertySignature(
              undefined,
              status,
              undefined,
              getResponseType(response)
            );
          })
        )
      ),
      ts.factory.createPropertySignature(
        undefined,
        "RequestBody",
        undefined,
        getRequestBody(requestBody)
      ),
    ])
  )
}

export function generatePathsInterface(data: OpenAPIV3.PathsObject) {
  const pathsType = ts.factory.createTypeLiteralNode(
    Object.entries(data).map(([path, value]) => {
      return ts.factory.createPropertySignature(
        undefined,
        `"${path}"`,
        undefined,
        ts.factory.createTypeLiteralNode(
          [
            value?.get && getMethodType("get", value.get.responses),
            value?.post &&
              getMethodType(
                "post",
                value.post.responses,
                value.post.requestBody
              ),
            value?.put &&
              getMethodType("put", value.put.responses, value.put.requestBody),
            value?.patch &&
              getMethodType(
                "patch",
                value.patch.responses,
                value.patch.requestBody
              ),
          ].filter(Boolean) as ts.TypeElement[],
        )
      );
    })
  );

  const pathsTypeAlias = ts.factory.createTypeAliasDeclaration(
    undefined,
    'Paths',
    undefined,
    pathsType,
  )

  const resultFile = ts.createSourceFile(
    "someFileName.ts",
    "",
    ts.ScriptTarget.Latest,
    /*setParentNodes*/ false,
    ts.ScriptKind.TS
  );
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  return printer.printList(
    ts.ListFormat.AllowTrailingComma,
    ts.factory.createNodeArray([
      ts.factory.createImportDeclaration(
        undefined,
        ts.factory.createImportClause(
          true,
          ts.factory.createIdentifier('foo'),
          undefined
        ),
        ts.factory.createStringLiteral('bar')
      ),
      ts.factory.createIdentifier('\n'),
      pathsTypeAlias,
    ]),
    resultFile,
  )
}
