import ts from 'typescript'
import { OpenAPIV3 } from 'openapi-types'
import { getTypescriptType } from './getTypescriptType';


export function generateComponentsInterfaces(data: OpenAPIV3.ComponentsObject) {
  const resultFile = ts.createSourceFile("someFileName.ts", "", ts.ScriptTarget.Latest, /*setParentNodes*/ false, ts.ScriptKind.TS);
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  
  return Object.entries(data.schemas!).map(([key, value]) => {
    const createdInterface = ts.factory.createTypeAliasDeclaration(
      undefined,
      key,
      undefined,
      getTypescriptType(value)
    )

    return printer.printNode(ts.EmitHint.Unspecified, createdInterface, resultFile)
  }).join('\n\n')
}