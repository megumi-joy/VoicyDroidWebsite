const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  await page.goto('file:///home/yip/Documents/GitHub/lab/%D0%BF%D0%BE%D0%B5%D0%B7%D0%B4%D0%B0/index.html');
  await page.waitForTimeout(2000);
  const type = await page.evaluate(() => typeof window.E);
  console.log('typeof window.E:', type);
  await browser.close();
})();
