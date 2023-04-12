import path from "path";
import { SchemaLoader } from "./SchemaLoader";
import { readFile } from "fs";

const ALLOWED_EXTENSIONS = [".json", ".yaml", ".yml"];

export class FileLoader extends SchemaLoader {

  constructor(private cwd: string) {
    super()
  }

  canHandle(input: string): boolean {
    return ALLOWED_EXTENSIONS.some(ext => input.endsWith(ext))
  }

  load(input: string): Promise<any> {
    const inputPath = path.join(this.cwd, input)
    return new Promise((resolve, reject) => {
      readFile(inputPath, 'utf-8', (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(JSON.parse(data))
        }
      })
    })
  }
}