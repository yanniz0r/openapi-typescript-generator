export abstract class SchemaLoader {
  abstract canHandle(input: string): boolean
  abstract load(input: string): Promise<any>
}