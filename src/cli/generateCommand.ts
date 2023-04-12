import { Command } from 'commander'
import path from 'path'
import { writeFileSync } from 'fs'
import { generateTypes } from '../generateTypes'
import { printNodes } from '../printNodes'
import { FileLoader } from './FileLoader'
import { SchemaLoader } from './SchemaLoader'
import { FetchLoader } from './FetchLoader'

export class GenerateCommand extends Command {

  loaders: SchemaLoader[]

  constructor(private cwd: string) {
    super('generate')

    this.loaders = [
      new FetchLoader(),
      new FileLoader(cwd),
    ]

    this
      .option('--input <path>', 'Location of the openapi file')
      .option('--output <path>', 'Location of the generated output file')
    this.action(async () => {
      const { input, output } = this.opts<{ input: string, output: string }>()
  
      const outputPath = path.join(this.cwd, output)
    
      const openapiSpec = await this.loadSchema(input)
    
      const types = generateTypes(openapiSpec)
      const typesString = printNodes(types)
      
      writeFileSync(outputPath, typesString)
    })
  }

  private loadSchema(input: string) {
    const responsibleLoader = this.loaders.find(loader => loader.canHandle(input))
    if (!responsibleLoader) {
      throw new Error('Unable to load schema')
    }
    return responsibleLoader.load(input)
  }
}