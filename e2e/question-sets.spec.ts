import { test, expect } from "@playwright/test";

test.describe("Question Sets", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start fresh
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test.describe("Home Page Selection", () => {
    test("displays default question set on home page", async ({ page }) => {
      await page.goto("/");

      // Default set should be Christmas 2025
      await expect(page.getByText("Christmas 2025")).toBeVisible();
      await expect(page.getByText("3 categories, 15 questions")).toBeVisible();
    });

    test("opens question set selector when clicking on set card", async ({ page }) => {
      await page.goto("/");

      // Click on the question set card
      await page.getByText("Christmas 2025").click();

      // Selector modal should open
      await expect(page.getByRole("heading", { name: "Choose Question Set" })).toBeVisible();
      await expect(page.getByText("Select a question set for your quiz")).toBeVisible();
    });

    test("shows all available question sets in selector", async ({ page }) => {
      await page.goto("/");

      // Open selector
      await page.locator("button").filter({ hasText: "Christmas 2025" }).first().click();

      // Modal should be visible
      await expect(page.getByRole("heading", { name: "Choose Question Set" })).toBeVisible();

      // Both question sets should be visible as buttons (use more specific selectors)
      // Christmas 2025 should show "Selected" badge since it's the current set
      await expect(page.getByRole("button", { name: /Christmas 2025.*Selected/ })).toBeVisible();
      // Football Quiz should be visible without "Selected"
      await expect(page.getByRole("button", { name: /Football Quiz 2025.*Test your knowledge/ })).toBeVisible();
    });

    test("can select a different question set", async ({ page }) => {
      await page.goto("/");

      // Open selector
      await page.getByText("Christmas 2025").click();

      // Select Football Quiz
      await page.getByRole("button", { name: /Football Quiz 2025/ }).click();

      // Modal should close and new set should be selected
      await expect(page.getByRole("heading", { name: "Choose Question Set" })).not.toBeVisible();
      await expect(page.getByText("Football Quiz 2025")).toBeVisible();
    });

    test("shows selected badge on current question set", async ({ page }) => {
      await page.goto("/");

      // Open selector
      await page.getByText("Christmas 2025").click();

      // Christmas 2025 should show as selected
      await expect(page.getByText("Selected")).toBeVisible();
    });

    test("closes selector when clicking close button", async ({ page }) => {
      await page.goto("/");

      // Open selector
      await page.getByText("Christmas 2025").click();
      await expect(page.getByRole("heading", { name: "Choose Question Set" })).toBeVisible();

      // Click close
      await page.getByRole("button", { name: "Close" }).click();

      // Modal should be closed
      await expect(page.getByRole("heading", { name: "Choose Question Set" })).not.toBeVisible();
    });

    test("closes selector when clicking outside", async ({ page }) => {
      await page.goto("/");

      // Open selector
      await page.getByText("Christmas 2025").click();
      await expect(page.getByRole("heading", { name: "Choose Question Set" })).toBeVisible();

      // Click outside the modal
      await page.locator(".fixed.inset-0").first().click({ position: { x: 10, y: 10 } });

      // Modal should be closed
      await expect(page.getByRole("heading", { name: "Choose Question Set" })).not.toBeVisible();
    });
  });

  test.describe("Quiz Content", () => {
    test("quiz loads categories from selected question set", async ({ page }) => {
      await page.goto("/");

      // Start quiz with Christmas 2025 (default)
      await page.getByRole("button", { name: "Start Quiz" }).click();
      await page.getByRole("textbox").fill("Test Team");
      await page.getByRole("button", { name: "Add" }).click();
      await page.getByRole("button", { name: "Start Quiz" }).click();

      // Should show Christmas Movies category
      await expect(page.getByRole("heading", { name: "Christmas Movies" })).toBeVisible();
    });

    test("switching question set changes quiz categories", async ({ page }) => {
      await page.goto("/");

      // Switch to Football Quiz
      await page.getByText("Christmas 2025").click();
      await page.getByRole("button", { name: /Football Quiz 2025/ }).click();

      // Start quiz
      await page.getByRole("button", { name: "Start Quiz" }).click();
      await page.getByRole("textbox").fill("Test Team");
      await page.getByRole("button", { name: "Add" }).click();
      await page.getByRole("button", { name: "Start Quiz" }).click();

      // Should show Premier League category
      await expect(page.getByRole("heading", { name: "Premier League" })).toBeVisible();
    });
  });

  test.describe("Settings Menu", () => {
    test("shows Change Question Set option in settings menu", async ({ page }) => {
      await page.goto("/");

      await page.getByRole("button", { name: "Settings" }).click();

      await expect(page.getByRole("button", { name: "Change Question Set" })).toBeVisible();
    });

    test("opens question set selector from settings menu", async ({ page }) => {
      await page.goto("/");

      await page.getByRole("button", { name: "Settings" }).click();
      await page.getByRole("button", { name: "Change Question Set" }).click();

      await expect(page.getByRole("heading", { name: "Choose Question Set" })).toBeVisible();
    });

    test("changing question set from settings resets quiz and returns to home", async ({ page }) => {
      await page.goto("/");

      // Start a quiz
      await page.getByRole("button", { name: "Start Quiz" }).click();
      await page.getByRole("textbox").fill("Test Team");
      await page.getByRole("button", { name: "Add" }).click();
      await page.getByRole("button", { name: "Start Quiz" }).click();
      await page.getByRole("button", { name: "Start Section" }).click();

      // Verify we're on quiz page
      await expect(page.getByText("Question 1 of 15")).toBeVisible();

      // Change question set via settings
      await page.getByRole("button", { name: "Settings" }).click();
      await page.getByRole("button", { name: "Change Question Set" }).click();
      // Select Football Quiz from the modal
      await page.locator("button").filter({ hasText: /Football Quiz 2025.*3 categories/ }).click();

      // Should be back on home page with new set selected
      await expect(page.getByRole("heading", { name: "Quizmaster" })).toBeVisible();
      // Check that the question set card shows Football Quiz
      await expect(page.locator("button").filter({ hasText: "Football Quiz 2025" }).first()).toBeVisible();
    });

    test("changing question set clears teams and scores", async ({ page }) => {
      await page.goto("/");

      // Setup teams and award points
      await page.getByRole("button", { name: "Start Quiz" }).click();
      await page.getByRole("textbox").fill("Team Alpha");
      await page.getByRole("button", { name: "Add" }).click();
      await page.getByRole("button", { name: "Start Quiz" }).click();
      await page.getByRole("button", { name: "Start Section" }).click();

      // Award points
      await page.getByRole("button", { name: /Reveal Answer/ }).click();
      await page.getByRole("button", { name: "Team Alpha" }).click();

      // Change question set
      await page.getByRole("button", { name: "Settings" }).click();
      await page.getByRole("button", { name: "Change Question Set" }).click();
      await page.getByRole("button", { name: /Football Quiz 2025/ }).click();

      // Start new quiz and verify teams are cleared
      await page.getByRole("button", { name: "Start Quiz" }).click();
      await expect(page.getByText("Team Alpha")).not.toBeVisible();
      await expect(page.getByRole("button", { name: "Start Quiz" })).toBeDisabled();
    });
  });

  test.describe("State Persistence", () => {
    test("selected question set persists after page reload", async ({ page }) => {
      await page.goto("/");

      // Switch to Football Quiz
      await page.getByText("Christmas 2025").click();
      await page.getByRole("button", { name: /Football Quiz 2025/ }).click();

      // Reload page
      await page.reload();

      // Football Quiz should still be selected
      await expect(page.getByText("Football Quiz 2025")).toBeVisible();
    });

    test("quiz progress restores with correct question set after reload", async ({ page }) => {
      await page.goto("/");

      // Switch to Football Quiz and start quiz
      await page.locator("button").filter({ hasText: "Christmas 2025" }).first().click();
      await page.locator("button").filter({ hasText: /Football Quiz 2025.*3 categories/ }).click();

      await page.getByRole("button", { name: "Start Quiz" }).click();
      await page.getByRole("textbox").fill("Test Team");
      await page.getByRole("button", { name: "Add" }).click();
      await page.getByRole("button", { name: "Start Quiz" }).click();
      await page.getByRole("button", { name: "Start Section" }).click();

      // Navigate to question 2
      await page.getByRole("button", { name: /Next/ }).click();
      await expect(page.getByText("Question 2 of 15")).toBeVisible();

      // Reload page
      await page.reload();

      // Should be on question 2 with Football Quiz categories
      await expect(page.getByText("Question 2 of 15")).toBeVisible();
      await expect(page.getByRole("heading", { name: "Premier League", exact: true })).toBeVisible();
    });
  });
});
