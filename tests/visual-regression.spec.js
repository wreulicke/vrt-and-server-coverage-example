const { test: base, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const v8toIstanbul = require('v8-to-istanbul');

const test = base.extend({
  page: async ({ page }, use) => {
    console.log('Starting test...');
    await page.coverage.startJSCoverage();
    await use(page);
    const coverage = await page.coverage.stopJSCoverage();
    for (const entry of coverage) {
      const converter = v8toIstanbul('', 0, { 
        source: entry.source,
      });
      await converter.load();
      converter.applyCoverage(entry.functions);
      
      const cov = converter.toIstanbul()

      // この辺がダメ
      const [p] = Object.keys(cov)
      const e = cov[p]
      delete cov[p]
      cov["test.js"] = e
      e.path = path.resolve(process.cwd(), "src/test.js")

      fs.writeFileSync(`.nyc_output/playwright_coverage_${entry.scriptId}.json`, JSON.stringify(cov));
    }
  }
})

test('Visual Regression Test for Homepage', async ({ page }) => {
  // サーバのルートページに移動
  await page.goto('http://localhost:3000');

  // スクリーンショットを撮影して比較
  expect(await page.screenshot()).toMatchSnapshot('homepage.png');
});

test('Visual Regression Test for API Data Page', async ({ page }) => {
  // JSON APIのページに移動
  await page.goto('http://localhost:3000/api/data');

  // スクリーンショットを撮影して比較
  expect(await page.screenshot()).toMatchSnapshot('api-data.png');
});
