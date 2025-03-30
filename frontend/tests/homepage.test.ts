import { test, expect } from "@playwright/test";

test("Google Login button is visible (Desktop)", async ({ page }) => {

	await page.setViewportSize({ width: 1280, height: 800 });
	await page.goto("http://localhost:3000");
});

test("Email input box is visible", async ({ page }) => {
	
	await page.goto("http://localhost:3000");
	const emailInput = page.locator("input[type='email']");
	await expect(emailInput).toBeVisible();
});
  
test("Opt-in checkbox is visible", async ({ page }) => {
	
	await page.goto("http://localhost:3000");
	const optInCheckbox = page.locator('input[aria-label="Opt in to receive updates by email about jobba.help"]');
	await expect(optInCheckbox).toBeVisible();
})

test("reCAPTCHA box is visible", async ({ page }) => {

	await page.goto("http://localhost:3000");
	const recaptchaIframe = page.locator("iframe[src*='recaptcha']");
	await expect(recaptchaIframe).toBeVisible();
});
  

test("Subscribe button is visible", async ({ page }) => {
	
	await page.goto("http://localhost:3000");
	const subscribeButton = page.locator("button", { hasText: "Subscribe" });
	await expect(subscribeButton).toBeVisible();
	const button = page.locator('[data-testid="GoogleLogin"]');
	await expect(button).toBeVisible();
});
  
test("Discord card is visible and clickable", async ({ page }) => {
	
	await page.goto("http://localhost:3000");
	const discordCard = page.locator("button:has-text('jobba.help Community on Discord')");
	await expect(discordCard).toBeVisible();
  
	await discordCard.click();
	await expect(page).toHaveURL('https://discord.com/invite/5tTT6WVQyw');
});

test("Never Search Alone card is visible and clickable", async ({ page }) => {
	
	await page.setViewportSize({ width: 1280, height: 800 });
	await page.goto("http://localhost:3000");
	const neverSearchAloneCard = page.locator('button:has-text("Never Search Alone - phyl.org")');
	await expect(neverSearchAloneCard).toBeVisible();

	await neverSearchAloneCard.click();
	await expect(page).toHaveURL(/phyl\.org/);
});