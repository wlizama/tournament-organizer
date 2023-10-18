module.exports = {
    env: {
      browser: true,
      es2021: true,
    },
    extends: [
      'plugin:react/recommended',
      'plugin:react/jsx-runtime',
      'standard-with-typescript',
      'eslint-config-prettier',
    ],
    settings: {
      react: {
        version: 'detect',
      },
    },
    overrides: [
      {
        env: {
          node: true,
        },
        files: ['.eslintrc.{js,cjs}'],
        parserOptions: {
          sourceType: 'script',
        },
      },
    ],
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: ['react'],
    rules: {
      'react/jsx-no-target-blank': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'import/order': ['error', {
        'newlines-between': 'never',
        alphabetize: {
          order: 'asc'
        },
        groups: ['external', 'builtin', 'internal', 'index', 'parent', 'sibling', 'object', 'type']
      }],
      'import/no-duplicates': 'error',
      'import/no-useless-path-segments': ['error', {
        noUselessIndex: true,
        commonjs: true
      }],
      'import/newline-after-import': 'error',
  
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: {
            regex: '^I[A-Z]',
            match: false
          }
        }
      ],
    },
  }
  