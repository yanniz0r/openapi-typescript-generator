import ts from "typescript";

export function printNodes(types: ts.NodeArray<any>) {
  const resultFile = ts.createSourceFile(
    "someFileName.ts",
    "",
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS
  );
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  return printer.printList(
    ts.ListFormat.AllowTrailingComma,
    types,
    resultFile,
  )
}