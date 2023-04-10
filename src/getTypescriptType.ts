import { OpenAPIV3 } from 'openapi-types'
import ts from 'typescript'
import { getTypeNameFromRef } from './getTypeNameFromRef'

function getTypescriptStringType(data: OpenAPIV3.NonArraySchemaObject) {
  if (data.enum) {
    return ts.factory.createUnionTypeNode(
      data.enum.map((value) => {
        return ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(value))
      })
    )
  }
  return ts.factory.createTypeReferenceNode('string')
}

function getTypescriptUnionType(data: Array<OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject>): ts.TypeNode {
  return ts.factory.createUnionTypeNode(
    data.map((value) => {
      return getTypescriptType(value)
    })
  )
}

function getTypescriptObjectType(data: OpenAPIV3.NonArraySchemaObject) {
  return ts.factory.createTypeLiteralNode(
    Object.entries(data.properties ?? {}).map(  ([key, value]) => {
      const questionToken = !data.required || !data.required.includes(key)
        ? ts.factory.createToken(ts.SyntaxKind.QuestionToken)
        : undefined
      return ts.factory.createPropertySignature(undefined, key, questionToken, getTypescriptType(value))
    })
  )
}

function getTypescriptLiteralType(data: OpenAPIV3.NonArraySchemaObject) {
  switch (data.type) {
    case 'object':
      return getTypescriptObjectType(data)
    case 'string':
      return getTypescriptStringType(data)
    case 'boolean':
      return ts.factory.createTypeReferenceNode('boolean')
    case 'number':
    case 'integer':
      return ts.factory.createTypeReferenceNode('number')
    default:
      return ts.factory.createTypeReferenceNode('unknown')
  }
}

export function getTypescriptType(data: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject): ts.TypeNode {
  if ('$ref' in data) {
    return ts.factory.createTypeReferenceNode(getTypeNameFromRef(data.$ref))
  }
  if (data.anyOf) {
    return getTypescriptUnionType(data.anyOf)
  }
  if (data.type === 'array') {
    return ts.factory.createArrayTypeNode(getTypescriptType(data.items!))
  }

  const literalType = getTypescriptLiteralType(data)

  return data.nullable ? ts.factory.createUnionTypeNode([literalType, ts.factory.createTypeReferenceNode('null')]) : literalType
}