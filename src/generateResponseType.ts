import { OpenAPIV3 } from "openapi-types";
import { getTypeReferenceFromRef } from "./getTypeReferenceFromRef";
import ts from "typescript";
import { getTypescriptType } from "./getTypescriptType";

export function generateResponseType(
  responses: OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject
) {
  if (!responses || "$ref" in responses) {
    throw ts.factory.createTypeReferenceNode(
      getTypeReferenceFromRef(responses.$ref)
    );
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
  );
}