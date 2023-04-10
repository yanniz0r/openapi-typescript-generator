import ts from 'typescript'


const createdInterface = ts.factory.createInterfaceDeclaration(
  undefined,
  'Test',
  undefined,
  undefined,
  []
)

const resultFile = ts.createSourceFile("someFileName.ts", "", ts.ScriptTarget.Latest, /*setParentNodes*/ false, ts.ScriptKind.TS);
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

const result = printer.printNode(ts.EmitHint.Unspecified, createdInterface, resultFile);

console.log(result)
