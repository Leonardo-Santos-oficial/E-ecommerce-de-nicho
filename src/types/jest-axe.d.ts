// Minimal declaration for jest-axe in Vitest context
declare module 'jest-axe' {
  export interface AxeResults {
    violations: any[]
  }
  export const axe: (container: HTMLElement) => Promise<AxeResults>
  // Matcher factory signature compatible with expect.extend
  export const toHaveNoViolations: (results: AxeResults) => { pass: boolean; message: () => string }
}

// Vitest global augmentation
declare module 'vitest' {
  interface Assertion<T = any> {
    toHaveNoViolations(): T
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void
  }
}

export {} // ensure this file is treated as a module
