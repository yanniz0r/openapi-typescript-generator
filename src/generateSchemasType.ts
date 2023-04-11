import ts from 'typescript'
import { OpenAPIV3 } from 'openapi-types'
import { getTypescriptType } from './getTypescriptType';

export function generateSchemasType(data: OpenAPIV3.ComponentsObject['schemas']) {
  return ts.factory.createTypeLiteralNode(
    Object.entries(data ?? {}).map(([key, value]) => {
      return ts.factory.createPropertySignature(
        undefined,
        key,
        undefined,
        getTypescriptType(value)
      )
    })
  )
}
