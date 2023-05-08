import { OpenAPIV3 } from "openapi-types";
import ts from "typescript";
import { generateSchemasType } from "./generateSchemasType";
import { generateRequestBodiesType } from "./generateRequestBodiesType";
import { generateResponsesType } from "./generateResponsesType";

export function generateComponentsType(components: OpenAPIV3.ComponentsObject) {
  return ts.factory.createTypeAliasDeclaration(
    undefined,
    'Components',
    undefined,
    ts.factory.createTypeLiteralNode(
      [
        ts.factory.createPropertySignature(
          undefined,
          'Schemas',
          undefined,
          generateSchemasType(components.schemas)
        ),
        ts.factory.createPropertySignature(
          undefined,
          'RequestBodies',
          undefined,
          generateRequestBodiesType(components.requestBodies)
        ),
        ts.factory.createPropertySignature(
          undefined,
          'Responses',
          undefined,
          generateResponsesType(components.responses)
        )
        // TODO other members of the components object
      ]
    )
  )
}
