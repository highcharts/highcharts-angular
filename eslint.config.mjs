// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';

function tsFiles(files, extraRules = {}) {
  return {
    files: [files],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      ...angular.configs.tsAll,
    ],
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/explicit-member-accessibility': 'error',
      '@typescript-eslint/no-confusing-void-expression': 'off', // We prefer code tersity
      '@typescript-eslint/no-extraneous-class': 'off', // We have component without any logic in TS
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off', // This is very unfortunate, but there are too many dangerous false-positive, see https://github.com/typescript-eslint/typescript-eslint/issues/1798
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: true,
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': [
        'error',
        {
          allowArgumentsExplicitlyTypedAsAny: true,
        },
      ],
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            // We want to use promise in Rxjs subscribes without caring about the promise result
            arguments: false,
            properties: false,
          },
        },
      ],
      '@typescript-eslint/restrict-plus-operands': [
        'error',
        {
          // Allow some flexibility
          allowAny: true,
          allowBoolean: true,
          allowNullish: true,
          allowNumberAndString: true,
        },
      ],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          // Allow some flexibility
          allowAny: true,
          allowBoolean: true,
          allowNullish: true,
          allowNumber: true,
        },
      ],
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowTernary: true,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          caughtErrors: 'none',
        },
      ],
      'no-restricted-globals': [
        'error',
        'atob',
        'bota',
        'document',
        'event',
        'history',
        'length',
        'localStorage',
        'location',
        'name',
        'navigator',
        'sessionStorage',
        'window',
      ],
      ...extraRules,
    },
  };
}

export default tseslint.config(
  tsFiles('src/**/*.ts'),
  tsFiles('highcharts-angular/src/**/*.ts', {
    '@angular-eslint/directive-selector': [
      'error',
      {
        type: 'attribute',
        prefix: 'highcharts',
        style: 'camelCase',
      },
    ],
    '@angular-eslint/component-selector': [
      'error',
      {
        type: 'element',
        prefix: 'highcharts',
        style: 'kebab-case',
      },
    ],
  }),
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateAll],
    rules: {
      '@angular-eslint/template/no-any': 'off',
      '@angular-eslint/template/alt-text': 'off', // We don't care as much as we should about a11y
      '@angular-eslint/template/button-has-type': 'off',
      '@angular-eslint/template/click-events-have-key-events': 'off', // We don't care as much as we should about a11y
      '@angular-eslint/template/i18n': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off', // We don't care as much as we should about a11y
      '@angular-eslint/template/label-has-associated-control': 'off', // We don't care as much as we should about a11y
      '@angular-eslint/template/no-call-expression': 'off',
      '@angular-eslint/template/no-inline-styles': 'off', // We sometimes use short inlie styles
      '@angular-eslint/template/eqeqeq': [
        'error',
        {
          allowNullOrUndefined: true,
        },
      ],
    },
  },
);
