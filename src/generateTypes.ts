import { OpenAPIV3 } from "openapi-types";
import { generateSchemasType } from "./generateSchemasType";
import ts from "typescript";
import { generatePathsType } from "./generatePathsType";
import { generateComponentsType } from "./generateComponentsType";

export function generateTypes(openapi: OpenAPIV3.Document) {
  const components = generateComponentsType(openapi.components ?? {});
  const paths = generatePathsType(openapi.paths ?? {});

  return ts.factory.createNodeArray(
    [
      components,
      ts.factory.createIdentifier('\n'), // Add a newline between schemas and paths
      paths,
    ]
  )
}