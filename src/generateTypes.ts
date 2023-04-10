import { OpenAPIV3 } from "openapi-types";
import { generateSchemasType } from "./generateSchemasType";
import ts from "typescript";
import { generatePathsType } from "./generatePathsType";

export function generateTypes(openapi: OpenAPIV3.Document) {
  const schemas = generateSchemasType(openapi.components ?? {});
  const paths = generatePathsType(openapi.paths ?? {});

  return ts.factory.createNodeArray(
    [
      schemas,
      ts.factory.createIdentifier('\n'), // Add a newline between schemas and paths
      paths,
    ]
  )
}