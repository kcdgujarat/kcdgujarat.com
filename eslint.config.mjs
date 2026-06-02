import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

export default [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'next-env.d.ts',
      'kcd_kochi_website/**',
    ],
  },
  ...nextCoreWebVitals,
  {
    rules: {
      '@next/next/no-img-element': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      'react/no-unescaped-entities': 'off',
    },
  },
];
