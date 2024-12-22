import { FlatCompat } from '@eslint/eslintrc'
import path from 'path'
import { fileURLToPath } from 'url'
import globals from 'globals'
import astroPlugin from 'eslint-plugin-astro'
import tsParser from '@typescript-eslint/parser'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import reactPlugin from 'eslint-plugin-react'
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort'
import regexpPlugin from 'eslint-plugin-regexp'
import tailwindPlugin from 'eslint-plugin-tailwindcss'
import eslintCommentsPlugin from 'eslint-plugin-eslint-comments'
import tsEslintPlugin from '@typescript-eslint/eslint-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
	baseDirectory: __dirname,
})

// Get configs
const airbnbConfig = compat.extends('eslint-config-airbnb-typescript')[0]

const astroRecommended = compat.extends('plugin:astro/recommended')[0]
const astroJsxA11y = compat.extends('plugin:astro/jsx-a11y-recommended')[0]

const tsStrict = compat.extends('plugin:@typescript-eslint/strict')[0]
const tsStylistic = compat.extends('plugin:@typescript-eslint/stylistic-type-checked')[0]

export default [
	{
		ignores: ['dist/*', 'node_modules/*', '.astro/*'],
	},
	{
		// JavaScript & TypeScript files
		files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
		...airbnbConfig,
		...tsStrict,
		...tsStylistic,

		// Any custom JS/TS plugins you want
		plugins: {
			react: reactPlugin,
			'react-hooks': reactHooksPlugin,
			'jsx-a11y': jsxA11yPlugin,
			regexp: regexpPlugin,
			tailwindcss: tailwindPlugin,
			'eslint-comments': eslintCommentsPlugin,
			'simple-import-sort': simpleImportSortPlugin,
			'@typescript-eslint': tsEslintPlugin,
		},
		languageOptions: {
			parser: tsParser,
			globals: {
				...globals.browser,
				...globals.node,
			},
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				project: './tsconfig.json',
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		settings: {
			react: {
				version: 'detect',
			},
			'import/resolver': {
				typescript: true,
			},
		},
		rules: {
			// (custom JavaScript/TypeScript rules)
			'@typescript-eslint/no-unused-vars': 'off',
		},
	},
	{
		// Astro files
		files: ['**/*.astro'],
		...astroRecommended,
		...astroJsxA11y,

		plugins: {
			astro: astroPlugin,
			react: reactPlugin,
		},
		languageOptions: {
			parser: await import('astro-eslint-parser'),
			parserOptions: {
				parser: '@typescript-eslint/parser',
				extraFileExtensions: ['.astro'],
			},
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
		rules: {
			'astro/no-conflict-set-directives': 'error',
			'astro/no-unused-define-vars-in-style': 'error',
			'react/jsx-filename-extension': 'off',
			'react/react-in-jsx-scope': 'off',
			'react/no-unknown-property': [
				'error',
				{
					ignore: [
						'class',
						'set:html',
						'set:text',
						'is:global',
						'is:inline',
						'is:raw',
						'define:vars',
						'transition:animate',
						'transition:name',
						'transition:persist',
						'client:load',
						'client:idle',
						'client:visible',
						'client:media',
						'client:only',
					],
				},
			],
		},
	},
]
