import { readFileSync, existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const script = process.argv[2]

if (!script) {
  console.error('Usage: node scripts/run-with-tsx.mjs <script.ts>')
  process.exit(1)
}

function resolveTsxCli() {
  const candidates = ['tsx', 'payload/node_modules/tsx', '@payloadcms/graphql/node_modules/tsx']

  for (const candidate of candidates) {
    try {
      const packageJson = require.resolve(`${candidate}/package.json`)
      const { bin } = JSON.parse(readFileSync(packageJson, 'utf8'))
      const cliPath = path.join(path.dirname(packageJson), String(bin).replace(/^\.\//, ''))

      if (existsSync(cliPath)) {
        return cliPath
      }
    } catch {
      // try next candidate
    }
  }

  throw new Error('tsx is not available in node_modules')
}

const tsxCli = resolveTsxCli()
const result = spawnSync(process.execPath, ['--no-deprecation', tsxCli, script], {
  cwd: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'),
  stdio: 'inherit',
  env: process.env,
})

process.exit(result.status ?? 1)