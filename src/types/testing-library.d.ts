/// <reference types="@testing-library/jest-dom" />
// Central declaration so TS language server loads matcher augmentations.
// Vitest runtime already imports '@testing-library/jest-dom' in vitest.setup.tsx,
// but the editor needs a .d.ts included via tsconfig to know about custom matchers.
export {}
