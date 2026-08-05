import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      defaultViewport: { width: 1280, height: 800 }
    });
    const page = await browser.newPage();
    
    // Go to the React app
    await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle0' });
    
    // Give it a second to render CSS gradients and fonts completely
    await new Promise(r => setTimeout(r, 1000));
    
    // Take dashboard overview screenshot
    const dashboardPath = resolve(__dirname, '../assets/dashboard_overview.jpg');
    await page.screenshot({ path: dashboardPath, type: 'jpeg', quality: 90 });
    console.log('Dashboard overview screenshot saved to', dashboardPath);
    
    // Click the predict button
    await page.click('button.btn-submit');
    
    // Wait for the result panel to appear (class .result-panel)
    await page.waitForSelector('.result-panel', { visible: true, timeout: 5000 });
    
    // Wait for the CSS slideUp animation to finish (0.4s)
    await new Promise(r => setTimeout(r, 600));
    
    // Take prediction results screenshot
    const predictionPath = resolve(__dirname, '../assets/prediction_results.jpg');
    // Scroll down to make sure result is visible or take full page
    await page.screenshot({ path: predictionPath, type: 'jpeg', quality: 90, fullPage: true });
    console.log('Prediction results screenshot saved to', predictionPath);
    
    await browser.close();
  } catch (err) {
    console.error('Error capturing screenshots:', err);
    process.exit(1);
  }
})();
