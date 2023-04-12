import path from "path";
import { SchemaLoader } from "./SchemaLoader";
import { readFile } from "fs";

const ALLOWED_PROTOCOLS = ["https://", "http://"];

export class FetchLoader extends SchemaLoader {
  canHandle(input: string): boolean {
    return ALLOWED_PROTOCOLS.some(protocol => input.startsWith(protocol))
  }

  async load(input: string): Promise<any> {
    const response = await fetch(input)
    return response.json()
  }
}