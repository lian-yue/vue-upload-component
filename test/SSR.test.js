import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')

describe('SSR bundles', () => {
  it.each(['development', 'production'])('renders slots in %s', environment => {
    // Native Node loading keeps the test runner from rewriting Vue's build flags.
    const script = resolve(rootDir, 'test/fixtures/ssr.mjs')
    const result = spawnSync(process.execPath, [script], {
      cwd: rootDir,
      env: { ...process.env, NODE_ENV: environment },
      encoding: 'utf8',
      timeout: 10000,
    })

    expect(result.error).toBeUndefined()
    expect(result.status, result.stderr || result.stdout).toBe(0)
  })
})
