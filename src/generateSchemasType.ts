import ts from 'typescript'
import { OpenAPIV3 } from 'openapi-types'
import { getTypescriptType } from './getTypescriptType';

export function generateSchemasType(data: OpenAPIV3.ComponentsObject) {
  return ts.factory.createTypeAliasDeclaration(
    undefined,
    'Schemas',
    undefined,
    ts.factory.createTypeLiteralNode(
      Object.entries(data.schemas ?? {}).map(([key, value]) => {
        return ts.factory.createPropertySignature(
          undefined,
          key,
          undefined,
          getTypescriptType(value)
        )
      })
    )
  )
}
