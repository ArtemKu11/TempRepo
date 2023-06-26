import Consola, { LogLevel } from 'consola'

// Configure Consola
Consola.wrapAll()
Consola.level = 1

if (true) Consola.level = LogLevel.Verbose
