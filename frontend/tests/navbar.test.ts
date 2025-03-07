import { test, expect } from "@playwright/test";

test.describe("Navbar Tests", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:3000");
	});

	test("should render navbar properly", async ({ page }) => {
		const navbar = await page.locator("nav");
		await expect(navbar).toBeVisible();
	});

	test("should navigate to home when clicking the brand logo", async ({ page }) => {
		const brandLogo = page.locator('[data-testid="Logo"]');
		await expect(brandLogo).toBeVisible();
		await brandLogo.click();
		await expect(page).toHaveURL("http://localhost:3000");
	});

	test("should contain GitHub link", async ({ page }) => {
		const githubLink = page.locator('a[aria-label="Github"]').first();
		await expect(githubLink).toHaveAttribute("href", /github\.com/);
		await expect(githubLink).toHaveAttribute("target", "_blank");
	});

	test("should have a theme switch button", async ({ page }) => {
		const themeSwitch = page.locator('[data-testid="theme-switch-button"] >> nth=0');
		await expect(themeSwitch).toBeVisible();
	});

	test("should contain Sponsor button with correct link", async ({ page }) => {
		const sponsorButton = await page.locator('[data-testid="Sponsor"]');
		await expect(sponsorButton).toBeVisible();
		await expect(sponsorButton).toHaveAttribute("href", "https://buymeacoffee.com/liano");
	});

	test("should show Login button on the home page", async ({ page }) => {
		const loginButton = page.locator('[data-testid="GoogleLogin"]');
		await expect(loginButton).toBeVisible();
		await loginButton.click();
		await expect(page).toHaveURL(/\/login$/);
	});

	test("should show Logout button on success page", async ({ page }) => {
		await page.goto("http://localhost:3000/success");
		const logoutButton = page.locator('[data-testid="GoogleLogout"]');
		await expect(logoutButton).toBeVisible();
		await logoutButton.click();
		await expect(page).toHaveURL(/\/logout$/);
	});

	test("should open mobile menu when menu toggle is clicked", async ({ page }) => {
		const menuToggle = page.locator("button[aria-label='Toggle navigation']");
		await expect(menuToggle).toBeVisible();
		await menuToggle.click();

		const menu = page.locator("nav [role='menu']");
		await expect(menu).toBeVisible();

		// Check if menu contains necessary items
		await expect(menu.locator('a[aria-label="Github"]')).toBeVisible();
		await expect(menu.locator("button:text('Change theme')")).toBeVisible();
		await expect(menu.locator('[data-testid="Sponsor"]')).toBeVisible();
	});
});