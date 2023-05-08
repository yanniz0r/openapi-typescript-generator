import { OpenAPIV3 } from "openapi-types";
import ts from "typescript";
import { getTypescriptType } from "./getTypescriptType";
import { getTypeReferenceFromRef } from "./getTypeReferenceFromRef";
import { uppercaseFirstCharacter } from "./helpers/uppercaseFirstCharacter";
import { generateRequestBodyType } from "./generateRequestBodyType";
import { generateResponsesType } from "./generateResponsesType";

function groupParametersByLocation(
  parameters: Array<OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject>
) {
  const groupedParameters: Record<
    OpenAPIV3.ParameterObject["in"],
    Array<OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject>
  > = {};

  parameters.forEach((parameter) => {
    if ("$ref" in parameter) {
      throw new Error("$ref not implemented yet");
    }
    if (!groupedParameters[parameter.in]) {
      groupedParameters[parameter.in] = [];
    }
    groupedParameters[parameter.in].push(parameter);
  });

  return groupedParameters;
}

function getParameters(parameters: Array<OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject>) {
  const groupedParameters = groupParametersByLocation(parameters)
  return ts.factory.createTypeLiteralNode(
    Object.entries(groupedParameters).map(([location, parameters]) => {
      return ts.factory.createPropertySignature(
        undefined,
        uppercaseFirstCharacter(location),
        undefined,
        ts.factory.createTypeLiteralNode(
          parameters.map((parameter) => {
            if ('$ref' in parameter) {
              throw new Error('$ref not implemented yet')
            }
            return ts.factory.createPropertySignature(
              undefined,
              parameter.name,
              undefined,
              getTypescriptType(parameter.schema ?? {})
            )
          })
        )
      )
    })
  )
}

function getMethodType(
  method: string,
  responses: OpenAPIV3.ResponsesObject,
  parameters?: Array<OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject>,
  requestBody?: OpenAPIV3.RequestBodyObject | OpenAPIV3.ReferenceObject
) {
  return ts.factory.createPropertySignature(
    undefined,
    method.toUpperCase(),
    undefined,
    ts.factory.createTypeLiteralNode([
      ts.factory.createPropertySignature(
        undefined,
        "Responses",
        undefined,
        generateResponsesType(responses)
      ),
      ts.factory.createPropertySignature(
        undefined,
        'Parameters',
        undefined,
        getParameters(parameters ?? []),
      ),
      ts.factory.createPropertySignature(
        undefined,
        "RequestBody",
        undefined,
        generateRequestBodyType(requestBody)
      ),
    ])
  );
}

export function generatePathsType(data: OpenAPIV3.PathsObject) {
  const pathsType = ts.factory.createTypeLiteralNode(
    Object.entries(data).map(([path, value]) => {
      return ts.factory.createPropertySignature(
        undefined,
        `"${path}"`,
        undefined,
        ts.factory.createTypeLiteralNode(
          [
            value?.get &&
              getMethodType("get", value.get.responses, value.get.parameters),
            value?.post &&
              getMethodType(
                "post",
                value.post.responses,
                value.post.parameters,
                value.post.requestBody
              ),
            value?.delete &&
              getMethodType(
                "delete",
                value.delete.responses,
                value.delete.parameters,
                value.delete.requestBody
              ),
            value?.put &&
              getMethodType(
                "put",
                value.put.responses,
                value.put.parameters,
                value.put.requestBody
              ),
            value?.patch &&
              getMethodType(
                "patch",
                value.patch.responses,
                value.patch.parameters,
                value.patch.requestBody
              ),
          ].filter(Boolean) as ts.TypeElement[]
        )
      );
    })
  );

  const pathsTypeAlias = ts.factory.createTypeAliasDeclaration(
    undefined,
    "Paths",
    undefined,
    pathsType
  );

  return pathsTypeAlias;
}
