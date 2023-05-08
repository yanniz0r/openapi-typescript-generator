import { OpenAPI, OpenAPIV3 } from "openapi-types";
import ts from "typescript";
import { generateResponseType } from "./generateResponseType";

export function generateResponsesType(responses?: OpenAPIV3.ResponsesObject) {
  return ts.factory.createTypeLiteralNode(
    Object.entries(responses ?? {}).map(([status, response]) => {
      return ts.factory.createPropertySignature(
        undefined,
        status,
        undefined,
        generateResponseType(response)
      );
    })
  )
}