import fs from "fs";

import { test, expect } from "@playwright/test";

test("Download Sankey button is rendered", async ({ page }) => {
	await page.goto("http://localhost:3000/preview/dashboard");
	const downloadSankeyButton = await page.locator("button", { hasText: "Download Sankey" });
	await expect(downloadSankeyButton).toBeVisible();
});

test("Sankey button triggers file download", async ({ page }) => {
	await page.goto("http://localhost:3000/preview/dashboard");
	const [download] = await Promise.all([
		page.waitForEvent("download"),
		page.locator('button:has-text("Sankey")').click()
	]);

	const downloadPath = await download.path();
	console.log("Sankey file download path:", downloadPath);
	expect(downloadPath).toBeDefined();

	const fileExists = fs.existsSync(downloadPath);
	console.log("File exists:", fileExists);
	expect(fileExists).toBe(true);
});

test("Download CSV button is rendered", async ({ page }) => {
	await page.goto("http://localhost:3000/preview/dashboard");
	const downloadCsvButton = await page.locator("button", { hasText: "Download CSV" });
	await expect(downloadCsvButton).toBeVisible();
});

test("CSV button triggers file download", async ({ page }) => {
	await page.goto("http://localhost:3000/preview/dashboard");
	const [download] = await Promise.all([
		page.waitForEvent("download"),
		page.locator('button:has-text("Download CSV")').click()
	]);

	const downloadPath = await download.path();
	console.log("CSV file download path:", downloadPath);
	expect(downloadPath).toBeDefined();

	const fileExists = fs.existsSync(downloadPath);
	console.log("File exists:", fileExists);
	expect(fileExists).toBe(true);
});
