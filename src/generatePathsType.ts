import { OpenAPIV3 } from "openapi-types";
import ts from "typescript";
import { getTypescriptType } from "./getTypescriptType";
import { getTypeReferenceFromRef } from "./getTypeReferenceFromRef";

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
    throw ts.factory.createTypeReferenceNode(getTypeReferenceFromRef(responses.$ref))
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

export function generatePathsType(data: OpenAPIV3.PathsObject) {
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
            value?.delete &&
              getMethodType(
                "delete",
                value.delete.responses,
                value.delete.requestBody
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

    return pathsTypeAlias;
}
