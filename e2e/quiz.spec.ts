import { test, expect } from "@playwright/test";

test.describe("Quizmaster App", () => {
  test("displays home page with start button", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Quizmaster" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Start Quiz" })).toBeVisible();
  });

  test("navigates through complete quiz flow", async ({ page }) => {
    await page.goto("/");

    // Start quiz from home page
    await page.getByRole("button", { name: "Start Quiz" }).click();

    // Team Setup page
    await expect(page.getByRole("heading", { name: "Team Setup" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Start Quiz" })).toBeDisabled();

    // Add first team
    await page.getByRole("textbox").fill("Team Alpha");
    await page.getByRole("button", { name: "Add" }).click();
    await expect(page.getByText("Team Alpha")).toBeVisible();

    // Add second team
    await page.getByRole("textbox").fill("Team Beta");
    await page.getByRole("button", { name: "Add" }).click();
    await expect(page.getByText("Team Beta")).toBeVisible();

    // Start Quiz button should now be enabled
    await expect(page.getByRole("button", { name: "Start Quiz" })).toBeEnabled();
    await page.getByRole("button", { name: "Start Quiz" }).click();

    // Quiz page - Question 1
    await expect(page.getByText("Question 1 of 15")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Sports" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Previous/ })).toBeDisabled();

    // Reveal answer
    await page.getByRole("button", { name: /Reveal Answer/ }).click();
    await expect(page.getByRole("button", { name: /Hide Answer/ })).toBeVisible();
    await expect(page.getByRole("button", { name: "Award Points" })).toBeVisible();

    // Award points to Team Alpha
    await page.getByRole("button", { name: "Award Points" }).click();
    await expect(page.getByRole("heading", { name: /Award.*points to/ })).toBeVisible();
    await page.getByRole("button", { name: "Team Alpha" }).click();

    // Check scoreboard
    await page.getByRole("button", { name: /Scoreboard/ }).click();
    await expect(page.getByRole("heading", { name: "Scoreboard" })).toBeVisible();
    await expect(page.getByText("10", { exact: true })).toBeVisible(); // Team Alpha's score
    await page.getByRole("button", { name: "✕" }).click();

    // Navigate to next question
    await page.getByRole("button", { name: /Next/ }).click();
    await expect(page.getByText("Question 2 of 15")).toBeVisible();

    // Previous button should now be enabled
    await expect(page.getByRole("button", { name: /Previous/ })).toBeEnabled();

    // Navigate to end of quiz
    for (let i = 0; i < 14; i++) {
      await page.getByRole("button", { name: /Next/ }).click();
    }

    // Results page
    await expect(page.getByRole("heading", { name: "Quiz Complete!" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Final Standings" })).toBeVisible();
    await expect(page.getByText("Winner")).toBeVisible();
    await expect(page.getByRole("button", { name: "Play Again" })).toBeVisible();

    // Play again returns to home
    await page.getByRole("button", { name: "Play Again" }).click();
    await expect(page.getByRole("heading", { name: "Quizmaster" })).toBeVisible();
  });

  test("keyboard navigation works", async ({ page }) => {
    await page.goto("/");

    // Setup quiz with one team
    await page.getByRole("button", { name: "Start Quiz" }).click();
    await page.getByRole("textbox").fill("Test Team");
    await page.getByRole("button", { name: "Add" }).click();
    await page.getByRole("button", { name: "Start Quiz" }).click();

    // Test spacebar reveals answer
    await page.keyboard.press("Space");
    await expect(page.getByRole("button", { name: /Hide Answer/ })).toBeVisible();

    // Test spacebar hides answer
    await page.keyboard.press("Space");
    await expect(page.getByRole("button", { name: /Reveal Answer/ })).toBeVisible();

    // Test right arrow navigates forward
    await page.keyboard.press("ArrowRight");
    await expect(page.getByText("Question 2 of 15")).toBeVisible();

    // Test left arrow navigates back
    await page.keyboard.press("ArrowLeft");
    await expect(page.getByText("Question 1 of 15")).toBeVisible();

    // Test S key opens scoreboard
    await page.keyboard.press("s");
    await expect(page.getByRole("heading", { name: "Scoreboard" })).toBeVisible();

    // Test S key closes scoreboard
    await page.keyboard.press("s");
    await expect(page.getByRole("heading", { name: "Scoreboard" })).not.toBeVisible();
  });

  test("team management works correctly", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Start Quiz" }).click();

    // Add button should be disabled when input is empty
    await expect(page.getByRole("button", { name: "Add" })).toBeDisabled();

    // Add a team
    await page.getByRole("textbox").fill("My Team");
    await expect(page.getByRole("button", { name: "Add" })).toBeEnabled();
    await page.getByRole("button", { name: "Add" }).click();

    // Team should appear in list
    await expect(page.getByText("My Team")).toBeVisible();

    // Remove team
    await page.getByRole("button", { name: "Remove" }).click();
    await expect(page.getByText("My Team")).not.toBeVisible();

    // Start Quiz should be disabled again
    await expect(page.getByRole("button", { name: "Start Quiz" })).toBeDisabled();
  });

  test("back button returns to home from setup", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Start Quiz" }).click();

    await expect(page.getByRole("heading", { name: "Team Setup" })).toBeVisible();

    await page.getByRole("button", { name: "Back" }).click();

    await expect(page.getByRole("heading", { name: "Quizmaster" })).toBeVisible();
  });
});
