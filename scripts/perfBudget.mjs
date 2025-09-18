#!/usr/bin/env node
/**
 * Performance Budget Checker
 * Clean Code: small focused script.
 * SRP: Only checks bundle sizes.
 * OCP: Budgets adjustable via JSON or env without code modification.
 */
import fs from 'fs'
import path from 'path'

// Default budgets (in kilobytes) — adjust via PERF_BUDGET_JSON env (JSON string) or PERF_FIRST_LOAD_KB
const defaultBudgets = {
  firstLoadJS: 130, // total first load JS limit
  pageMaxKB: 80, // individual page chunk limit
}

function loadBudgets() {
  try {
    if (process.env.PERF_BUDGET_JSON) {
      return { ...defaultBudgets, ...JSON.parse(process.env.PERF_BUDGET_JSON) }
    }
  } catch (e) {
    console.warn('Could not parse PERF_BUDGET_JSON:', e.message)
  }
  if (process.env.PERF_FIRST_LOAD_KB) {
    defaultBudgets.firstLoadJS = Number(process.env.PERF_FIRST_LOAD_KB)
  }
  return defaultBudgets
}

function parseSizeToKB(sizeStr) {
  if (!sizeStr) return 0
  const trimmed = sizeStr.trim()
  if (/^\d+(\.\d+)?\s*kB$/i.test(trimmed)) return parseFloat(trimmed)
  if (/^\d+(\.\d+)?\s*B$/i.test(trimmed)) return parseFloat(trimmed) / 1024
  if (/^\d+(\.\d+)?\s*MB$/i.test(trimmed)) return parseFloat(trimmed) * 1024
  return 0
}

function readBuildManifest() {
  const buildDir = path.join(process.cwd(), '.next')
  const statsPath = path.join(buildDir, 'build-manifest.json')
  if (!fs.existsSync(statsPath)) throw new Error('build-manifest.json not found – run `next build` first.')
  return JSON.parse(fs.readFileSync(statsPath, 'utf-8'))
}

function extractPageSizes(manifest) {
  const { pages } = manifest
  const result = {}
  for (const [route, files] of Object.entries(pages)) {
    const jsFiles = files.filter((f) => f.endsWith('.js'))
    let totalKB = 0
    for (const f of jsFiles) {
      const fp = path.join('.next', f)
      if (fs.existsSync(fp)) {
        const bytes = fs.statSync(fp).size
        totalKB += bytes / 1024
      }
    }
    result[route] = totalKB
  }
  return result
}

function main() {
  const budgets = loadBudgets()
  const manifest = readBuildManifest()
  const pageSizes = extractPageSizes(manifest)

  // Approximate first load: sum of _app plus main framework chunks
  const coreChunks = Object.keys(manifest.pages['/_app'] || [])
  let firstLoadKB = 0
  for (const route of ['/_app']) {
    const sizeKB = pageSizes[route]
    if (sizeKB) firstLoadKB += sizeKB
  }

  const failures = []
  if (firstLoadKB > budgets.firstLoadJS) {
    failures.push(`First Load JS ${firstLoadKB.toFixed(1)}kB exceeds budget ${budgets.firstLoadJS}kB`)
  }
  for (const [route, kb] of Object.entries(pageSizes)) {
    if (kb > budgets.pageMaxKB) {
      failures.push(`Route ${route} size ${(kb).toFixed(1)}kB exceeds page budget ${budgets.pageMaxKB}kB`)
    }
  }

  console.log('Performance Budget Report')
  console.log('Budgets:', budgets)
  console.log('First Load (approx _app only):', firstLoadKB.toFixed(1) + 'kB')
  console.log('Per-page sizes:')
  Object.entries(pageSizes).forEach(([r, kb]) => console.log(`  ${r} -> ${kb.toFixed(1)}kB`))

  if (failures.length) {
    console.error('\nFAILURES:')
    failures.forEach((f) => console.error(' - ' + f))
    process.exit(1)
  }
  console.log('\nAll budgets within limits ✅')
}

main()
