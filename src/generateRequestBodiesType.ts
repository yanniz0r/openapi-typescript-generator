import ts from 'typescript'
import { OpenAPIV3 } from 'openapi-types'
import { getTypescriptType } from './getTypescriptType';
import { generateRequestBodyType } from './generateRequestBodyType';

export function generateRequestBodiesType(data: OpenAPIV3.ComponentsObject['requestBodies']) {
  return ts.factory.createTypeLiteralNode(
    Object.entries(data ?? {}).map(([key, value]) => {
      return ts.factory.createPropertySignature(
        undefined,
        key,
        undefined,
        generateRequestBodyType(value)
      )
    })
  )
}
