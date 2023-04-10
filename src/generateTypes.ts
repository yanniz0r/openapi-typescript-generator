import { OpenAPIV3, OpenAPIV3_1 } from "openapi-types";
import { generateComponentsType } from "./generateComponentsType";
import ts from "typescript";
import { generatePathsType } from "./generatePathsType";

export function generateTypes(openapi: OpenAPIV3.Document) {
  const components = generateComponentsType(openapi.components ?? {});
  const paths = generatePathsType(openapi.paths ?? {});

  return ts.factory.createNodeArray(
    [
      components,
      ts.factory.createIdentifier('\n'), // Add a newline between components and paths
      paths,
    ]
  )
}