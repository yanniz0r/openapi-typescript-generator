import { Command } from 'commander'
import path from 'path'
import { readFileSync, writeFileSync } from 'fs'
import { generateTypes } from '../generateTypes'
import { printNodes } from '../printNodes'

export class GenerateCommand extends Command {
  constructor(private cwd: string) {
    super('generate')
    this
      .option('--input <path>', 'Location of the openapi file')
      .option('--output <path>', 'Location of the generated output file')
    this.action(() => {
      console.log("FOO")
      const { input, output } = this.opts<{ input: string, output: string }>()
  
      const inputPath = path.join(this.cwd, input)
      const outputPath = path.join(this.cwd, output)
    
      const openapiSpec = readFileSync(inputPath, 'utf-8')
    
      const types = generateTypes(JSON.parse(openapiSpec))
      const typesString = printNodes(types)
      
      writeFileSync(outputPath, typesString)
    })
  }
}