import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/**', 'coverage/**', '.claude/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // TypeScript already reports use of undeclared variables; the core rule
    // only produces false positives on typed code.
    rules: { 'no-undef': 'off' },
  },
);
