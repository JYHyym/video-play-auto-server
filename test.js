const { chromium } = require('playwright');

// (async () => {
//   const browser = await chromium.launch();
//   // Create pages, interact with UI elements, assert values
//   await browser.close();
// })();

const testFun = async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  // Create pages, interact with UI elements, assert values
  const page = await browser.newPage();
  await page.goto('https://playwright.dev/');
  await page.screenshot({ path: `example.png` });

  // await browser.close();
}

testFun()