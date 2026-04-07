import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypeScript from 'eslint-config-next/typescript'

const config = [
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    ignores: ['dist/**'],
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@next/next/no-page-custom-font': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
]

export default config
