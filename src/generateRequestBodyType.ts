import { OpenAPIV3 } from "openapi-types";
import ts from "typescript";
import { getTypescriptType } from "./getTypescriptType";

export function generateRequestBodyType(
  requestBody?: OpenAPIV3.RequestBodyObject | OpenAPIV3.ReferenceObject
) {
  if (!requestBody || "$ref" in requestBody) {
    return ts.factory.createTypeLiteralNode([]);
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
  );
}