import { defineConfig } from '@playwright/test';
import base from './playwright.config.mjs';

export default defineConfig({
  ...base,
  testDir: './tests/network',
  outputDir: './test-results-online',
  timeout: 90000,
  expect: { timeout: 15000 },
  workers: 1,
});
