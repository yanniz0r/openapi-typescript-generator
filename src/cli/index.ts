import { GenerateCommand } from "./generateCommand";
import { Command } from 'commander'

const program = new Command()

program.addCommand(new GenerateCommand(process.cwd()))

program.parse(process.argv)

console.log(process.argv)

