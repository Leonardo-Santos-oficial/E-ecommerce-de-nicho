#!/usr/bin/env node
/**
 * Performance Budget Checker (Refatorado)
 * SRP: funções pequenas e coesas.
 * OCP: novas métricas (ex: imagens) podem ser adicionadas sem alterar núcleo.
 * DIP: budgets e baseline via env/arquivos, não constantes rígidas.
 */
import fs from 'fs'
import path from 'path'

// ---------------- Budgets & Config ----------------
const defaultBudgets = {
  firstLoadJS: 300, // fase inicial: permitir baseline; reduzir gradualmente em etapas (planejado na issue)
  pageMaxKB: 80,
}

function loadBudgets() {
  let budgets = { ...defaultBudgets }
  try {
    if (process.env.PERF_BUDGET_JSON) {
      budgets = { ...budgets, ...JSON.parse(process.env.PERF_BUDGET_JSON) }
    }
  } catch (e) {
    console.warn('Could not parse PERF_BUDGET_JSON:', e.message)
  }
  if (process.env.PERF_FIRST_LOAD_KB) {
    budgets.firstLoadJS = Number(process.env.PERF_FIRST_LOAD_KB)
  }
  return budgets
}

// ---------------- FS Helpers ----------------
function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

function safeExists(p) {
  try { return fs.existsSync(p) } catch { return false }
}

// ---------------- Manifest Collection ----------------
function readBuildManifest() {
  const statsPath = path.join(process.cwd(), '.next', 'build-manifest.json')
  if (!safeExists(statsPath)) throw new Error('build-manifest.json not found – run `next build` first.')
  return readJson(statsPath)
}

// ---------------- Size Measurement ----------------
function fileSizeKB(relPath) {
  const fp = path.join(process.cwd(), '.next', relPath)
  if (!safeExists(fp)) return 0
  return fs.statSync(fp).size / 1024
}

function collectPageSizes(manifest) {
  const out = {}
  for (const [route, files] of Object.entries(manifest.pages)) {
    const totalKB = files
      .filter((f) => f.endsWith('.js'))
      .reduce((sum, f) => sum + fileSizeKB(f), 0)
    out[route] = totalKB
  }
  return out
}

function collectCoreChunks(manifest) {
  // Heurística: framework, main, webpack, app, commons
  const coreRegex = /(framework-|main-|webpack|app-|_buildManifest|_ssgManifest)/
  const seen = new Set()
  const core = []
  for (const files of Object.values(manifest.pages)) {
    for (const f of files) {
      if (coreRegex.test(f) && f.endsWith('.js') && !seen.has(f)) {
        seen.add(f)
        core.push(f)
      }
    }
  }
  return core
}

function computeFirstLoadKB(coreChunks) {
  return coreChunks.reduce((sum, f) => sum + fileSizeKB(f), 0)
}

// Shared chunks = interseção de todos os conjuntos de arquivos JS das páginas "reais"
function collectSharedChunks(manifest) {
  const pageEntries = Object.entries(manifest.pages).filter(([route]) => !route.startsWith('/_'))
  if (pageEntries.length === 0) return []
  let shared = new Set(pageEntries[0][1].filter((f) => f.endsWith('.js')))
  for (let i = 1; i < pageEntries.length; i++) {
    const current = new Set(pageEntries[i][1].filter((f) => f.endsWith('.js')))
    shared = new Set([...shared].filter((f) => current.has(f)))
  }
  return [...shared]
}

// ---------------- Baseline Handling ----------------
function loadBaseline(baselinePath) {
  if (!baselinePath) return null
  if (!safeExists(baselinePath)) return null
  try { return readJson(baselinePath) } catch { return null }
}

function diffValues(curr, prev) {
  if (prev === 0 || prev == null) return { diffKB: 0, diffPct: 0 }
  const diffKB = curr - prev
  const diffPct = (diffKB / prev) * 100
  return { diffKB, diffPct }
}

// ---------------- Severity & Reporting ----------------
function classify(firstLoadKB, budgets) {
  const warnThreshold = budgets.firstLoadJS * 0.9
  if (firstLoadKB > budgets.firstLoadJS) return 'fail'
  if (firstLoadKB > warnThreshold) return 'warn'
  return 'ok'
}

function buildReport({ budgets, firstLoadKB, pageSizes, coreChunks, baseline }) {
  const firstLoadDiff = baseline ? diffValues(firstLoadKB, baseline.firstLoadKB) : null
  return {
    timestamp: new Date().toISOString(),
    budgets,
    firstLoadKB: Number(firstLoadKB.toFixed(2)),
    firstLoadDiff,
    coreChunks,
    pageSizes: Object.fromEntries(
      Object.entries(pageSizes).map(([r, kb]) => [r, Number(kb.toFixed(2))])
    ),
    baselineUsed: !!baseline,
  }
}

function printReport(report, severity, budgets) {
  console.log('Performance Budget Report')
  console.log('Budgets:', budgets)
  console.log('First Load:', report.firstLoadKB + 'kB', report.firstLoadDiff ? `(Δ ${report.firstLoadDiff.diffKB.toFixed(2)}kB ${report.firstLoadDiff.diffPct.toFixed(1)}%)` : '')
  console.log('Core Chunks:', report.coreChunks.length)
  console.log('Per-page sizes:')
  for (const [r, kb] of Object.entries(report.pageSizes)) {
    console.log(`  ${r} -> ${kb}kB`)
  }
  console.log('Severity:', severity)
}

function saveJson(report) {
  const outPath = path.join(process.cwd(), '.next', 'perf-budget.json')
  try {
    fs.writeFileSync(outPath, JSON.stringify(report, null, 2))
    return outPath
  } catch (e) {
    console.warn('Could not write perf-budget.json:', e.message)
    return null
  }
}

// ---------------- Main Flow ----------------
function main() {
  const budgets = loadBudgets()
  const baselinePath = process.env.PERF_BASELINE_PATH || path.join(process.cwd(), 'perf-baseline.json')
  const manifest = readBuildManifest()
  const pageSizes = collectPageSizes(manifest)
  const sharedChunks = collectSharedChunks(manifest)
  const coreChunks = sharedChunks.length ? sharedChunks : collectCoreChunks(manifest)
  const firstLoadKB = computeFirstLoadKB(coreChunks)
  const baseline = loadBaseline(baselinePath)
  const severity = classify(firstLoadKB, budgets)
  const report = buildReport({ budgets, firstLoadKB, pageSizes, coreChunks, baseline })

  printReport(report, severity, budgets)

  if (process.env.PERF_OUTPUT_JSON === '1') {
    const jsonPath = saveJson(report)
    if (jsonPath) console.log('JSON saved at', jsonPath)
  }
  if (!baseline && process.env.PERF_WRITE_BASELINE === '1') {
    fs.writeFileSync(baselinePath, JSON.stringify({ firstLoadKB: report.firstLoadKB }, null, 2))
    console.log('Baseline created at', baselinePath)
  }
  if (severity === 'fail' && process.env.PERF_WARN_ONLY !== '1') {
    console.error('First Load exceeded hard budget. Failing CI.')
    process.exit(1)
  }
  if (severity === 'warn') {
    console.warn('Warning: first load near limit.')
  }
  console.log('Done.')
}

main()
