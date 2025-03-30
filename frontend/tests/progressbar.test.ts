import { test, expect } from "@playwright/test";

test("Progress bar is visible", async ({ page }) => {

	await page.goto("http://localhost:3000/processing");
	const progressBar = await page.locator('[role="progressbar"]');
	await expect(progressBar).toBeVisible();
});

test("Progress bar goes from 0 to 100 and remains in the range of 0-100", async ({ page }) => {

	await page.goto("http://localhost:3000/processing");
	const progressBar = page.locator('[role="progressbar"]');
	
	let previousValue = await progressBar.getAttribute('aria-valuenow');
	console.log("Initial progress value:", previousValue);
	await expect(previousValue).toBe('0');
  
	for (let i = 0; i < 10; i++) {
	  await page.waitForTimeout(500); 
	  const currentValue = await progressBar.getAttribute('aria-valuenow');
	  console.log(`Progress value at step ${i}:`, currentValue);
 
	  expect(Number(currentValue)).toBeGreaterThanOrEqual(0);
	  expect(Number(currentValue)).toBeLessThanOrEqual(100);
  
	  if (i > 0) {
		expect(Number(currentValue)).toBeGreaterThan(Number(previousValue));
	  }
  
	  previousValue = currentValue;
	}
  
	const finalValue = await progressBar.getAttribute('aria-valuenow');
	console.log("Final progress value:", finalValue);
	await expect(finalValue).toBe('100');
  });