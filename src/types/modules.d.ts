// Stub genérico para módulos sem @types
// Garante supressão do aviso de declaração ausente do jest-axe
declare module 'jest-axe' {
  export interface AxeResults {
    violations: any[]
  }
  export const axe: (container: HTMLElement) => Promise<AxeResults>
  export const toHaveNoViolations: (results: AxeResults) => { pass: boolean; message: () => string }
}
