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

    // Section intro page should show first
    await expect(page.getByText("Coming Up")).toBeVisible();
    await expect(page.getByRole("heading", { name: "General Knowledge" })).toBeVisible();
    await page.getByRole("button", { name: "Start Section" }).click();

    // Quiz page - Question 1
    await expect(page.getByText("Question 1 of 5")).toBeVisible();
    await expect(page.getByRole("heading", { name: "General Knowledge" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Previous/ })).toBeDisabled();

    // Reveal answer
    await page.getByRole("button", { name: /Reveal Answer/ }).click();
    await expect(page.getByRole("button", { name: /Hide Answer/ })).toBeVisible();

    // Award points to Team Alpha using inline scoring buttons
    await expect(page.getByText("Award 10 points:")).toBeVisible();
    await page.getByRole("button", { name: "Team Alpha" }).click();

    // Check scoreboard
    await page.getByRole("button", { name: /Scoreboard/ }).click();
    await expect(page.getByRole("heading", { name: "Scoreboard" })).toBeVisible();
    await expect(page.getByText("10", { exact: true })).toBeVisible(); // Team Alpha's score
    await page.getByRole("button", { name: "✕" }).click();

    // Navigate to next question
    await page.getByRole("button", { name: /Next/ }).click();
    await expect(page.getByText("Question 2 of 5")).toBeVisible();

    // Previous button should now be enabled
    await expect(page.getByRole("button", { name: /Previous/ })).toBeEnabled();

    // Navigate to end of first category (General Knowledge has 3 questions, we're on Q2, so 1 more)
    await page.getByRole("button", { name: /Next/ }).click();

    // Next click goes to Science section intro
    await page.getByRole("button", { name: /Next/ }).click();
    await expect(page.getByText("Coming Up")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Science" })).toBeVisible();
    await page.getByRole("button", { name: "Start Section" }).click();

    // Navigate through Science (2 questions) to finish the quiz
    for (let i = 0; i < 2; i++) {
      await page.getByRole("button", { name: /Next/ }).click();
    }

    // Pre-results page
    await expect(page.getByText("That's a wrap!")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Quiz Complete" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Reveal Scores" })).toBeVisible();

    // Navigate to results
    await page.getByRole("button", { name: "Reveal Scores" }).click();

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

    // Dismiss section intro with Space
    await expect(page.getByText("Coming Up")).toBeVisible();
    await page.keyboard.press("Space");

    // Test spacebar reveals answer
    await page.keyboard.press("Space");
    await expect(page.getByRole("button", { name: /Hide Answer/ })).toBeVisible();

    // Test spacebar hides answer
    await page.keyboard.press("Space");
    await expect(page.getByRole("button", { name: /Reveal Answer/ })).toBeVisible();

    // Test right arrow navigates forward
    await page.keyboard.press("ArrowRight");
    await expect(page.getByText("Question 2 of 5")).toBeVisible();

    // Test left arrow navigates back
    await page.keyboard.press("ArrowLeft");
    await expect(page.getByText("Question 1 of 5")).toBeVisible();

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

  test("displays source link when answer is revealed for questions with sourceUrl", async ({ page }) => {
    await page.goto("/");

    // Setup quiz with one team
    await page.getByRole("button", { name: "Start Quiz" }).click();
    await page.getByRole("textbox").fill("Test Team");
    await page.getByRole("button", { name: "Add" }).click();
    await page.getByRole("button", { name: "Start Quiz" }).click();

    // Dismiss section intro
    await page.getByRole("button", { name: "Start Section" }).click();

    // Navigate to question 2 (gk-2 has sourceUrl for Mars)
    await page.getByRole("button", { name: /Next/ }).click();
    await expect(page.getByText("Question 2 of 5")).toBeVisible();

    // Source link should not be visible before reveal
    await expect(page.getByRole("link", { name: "Source" })).not.toBeVisible();

    // Reveal answer
    await page.getByRole("button", { name: /Reveal Answer/ }).click();

    // Source link should now be visible
    const sourceLink = page.getByRole("link", { name: "Source" });
    await expect(sourceLink).toBeVisible();
    await expect(sourceLink).toHaveAttribute("href", "https://en.wikipedia.org/wiki/Mars");
    await expect(sourceLink).toHaveAttribute("target", "_blank");
    await expect(sourceLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("does not display source link for questions without sourceUrl", async ({ page }) => {
    await page.goto("/");

    // Setup quiz with one team
    await page.getByRole("button", { name: "Start Quiz" }).click();
    await page.getByRole("textbox").fill("Test Team");
    await page.getByRole("button", { name: "Add" }).click();
    await page.getByRole("button", { name: "Start Quiz" }).click();

    // Dismiss section intro
    await page.getByRole("button", { name: "Start Section" }).click();

    // Question 1 (gk-1) does not have sourceUrl
    await expect(page.getByText("Question 1 of 5")).toBeVisible();

    // Reveal answer
    await page.getByRole("button", { name: /Reveal Answer/ }).click();

    // Source link should not be visible
    await expect(page.getByRole("link", { name: "Source" })).not.toBeVisible();
  });

  test.describe("Settings Menu", () => {
    test("settings button is visible on home page", async ({ page }) => {
      await page.goto("/");

      await expect(page.getByRole("button", { name: "Settings" })).toBeVisible();
    });

    test("settings button opens dropdown menu", async ({ page }) => {
      await page.goto("/");

      await page.getByRole("button", { name: "Settings" }).click();

      await expect(page.getByRole("button", { name: "Reset Game" })).toBeVisible();
    });

    test("clicking outside closes settings dropdown", async ({ page }) => {
      await page.goto("/");

      await page.getByRole("button", { name: "Settings" }).click();
      await expect(page.getByRole("button", { name: "Reset Game" })).toBeVisible();

      // Click outside the dropdown
      await page.locator("body").click({ position: { x: 100, y: 300 } });

      await expect(page.getByRole("button", { name: "Reset Game" })).not.toBeVisible();
    });

    test("reset game shows confirmation modal", async ({ page }) => {
      await page.goto("/");

      await page.getByRole("button", { name: "Settings" }).click();
      await page.getByRole("button", { name: "Reset Game" }).click();

      await expect(page.getByRole("heading", { name: "Reset Game?" })).toBeVisible();
      await expect(page.getByText("This will clear all teams, scores, and progress")).toBeVisible();
      await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Reset", exact: true })).toBeVisible();
    });

    test("cancel button closes confirmation modal without resetting", async ({ page }) => {
      await page.goto("/");

      // Setup a team first
      await page.getByRole("button", { name: "Start Quiz" }).click();
      await page.getByRole("textbox").fill("Test Team");
      await page.getByRole("button", { name: "Add" }).click();

      // Open settings and show confirmation
      await page.getByRole("button", { name: "Settings" }).click();
      await page.getByRole("button", { name: "Reset Game" }).click();

      // Cancel
      await page.getByRole("button", { name: "Cancel" }).click();

      // Modal should be closed
      await expect(page.getByRole("heading", { name: "Reset Game?" })).not.toBeVisible();

      // Team should still exist
      await expect(page.getByText("Test Team")).toBeVisible();
    });

    test("reset game clears teams and returns to home", async ({ page }) => {
      await page.goto("/");

      // Setup teams and start quiz
      await page.getByRole("button", { name: "Start Quiz" }).click();
      await page.getByRole("textbox").fill("Team Alpha");
      await page.getByRole("button", { name: "Add" }).click();
      await page.getByRole("textbox").fill("Team Beta");
      await page.getByRole("button", { name: "Add" }).click();
      await page.getByRole("button", { name: "Start Quiz" }).click();

      // Dismiss section intro
      await page.getByRole("button", { name: "Start Section" }).click();

      // Verify we're on quiz page
      await expect(page.getByText("Question 1 of 5")).toBeVisible();

      // Reset game
      await page.getByRole("button", { name: "Settings" }).click();
      await page.getByRole("button", { name: "Reset Game" }).click();
      await page.getByRole("button", { name: "Reset", exact: true }).click();

      // Should be back on home page
      await expect(page.getByRole("heading", { name: "Quizmaster" })).toBeVisible();

      // Go to setup and verify teams are cleared
      await page.getByRole("button", { name: "Start Quiz" }).click();
      await expect(page.getByRole("heading", { name: "Team Setup" })).toBeVisible();
      await expect(page.getByText("Team Alpha")).not.toBeVisible();
      await expect(page.getByText("Team Beta")).not.toBeVisible();

      // Start Quiz button should be disabled (no teams)
      await expect(page.getByRole("button", { name: "Start Quiz" })).toBeDisabled();
    });

    test("reset game clears scores", async ({ page }) => {
      await page.goto("/");

      // Setup team and award points
      await page.getByRole("button", { name: "Start Quiz" }).click();
      await page.getByRole("textbox").fill("Scoring Team");
      await page.getByRole("button", { name: "Add" }).click();
      await page.getByRole("button", { name: "Start Quiz" }).click();

      // Dismiss section intro
      await page.getByRole("button", { name: "Start Section" }).click();

      // Reveal answer and award points
      await page.getByRole("button", { name: /Reveal Answer/ }).click();
      await page.getByRole("button", { name: "Scoring Team" }).click();

      // Verify points were awarded
      await page.getByRole("button", { name: /Scoreboard/ }).click();
      await expect(page.getByText("10", { exact: true })).toBeVisible();
      await page.getByRole("button", { name: "✕" }).click();

      // Reset game
      await page.getByRole("button", { name: "Settings" }).click();
      await page.getByRole("button", { name: "Reset Game" }).click();
      await page.getByRole("button", { name: "Reset", exact: true }).click();

      // Setup new team and check scoreboard
      await page.getByRole("button", { name: "Start Quiz" }).click();
      await page.getByRole("textbox").fill("New Team");
      await page.getByRole("button", { name: "Add" }).click();
      await page.getByRole("button", { name: "Start Quiz" }).click();

      // Dismiss section intro
      await page.getByRole("button", { name: "Start Section" }).click();

      // Check scoreboard shows no scores
      await page.getByRole("button", { name: /Scoreboard/ }).click();
      await expect(page.getByText("0", { exact: true })).toBeVisible();
    });

    test("settings is accessible from quiz page", async ({ page }) => {
      await page.goto("/");

      // Setup and start quiz
      await page.getByRole("button", { name: "Start Quiz" }).click();
      await page.getByRole("textbox").fill("Test Team");
      await page.getByRole("button", { name: "Add" }).click();
      await page.getByRole("button", { name: "Start Quiz" }).click();

      // Dismiss section intro
      await page.getByRole("button", { name: "Start Section" }).click();

      // Settings should be visible on quiz page
      await expect(page.getByRole("button", { name: "Settings" })).toBeVisible();
    });
  });

  test.describe("Section Intro", () => {
    test("displays section intro when starting quiz", async ({ page }) => {
      await page.goto("/");

      // Setup quiz with one team
      await page.getByRole("button", { name: "Start Quiz" }).click();
      await page.getByRole("textbox").fill("Test Team");
      await page.getByRole("button", { name: "Add" }).click();
      await page.getByRole("button", { name: "Start Quiz" }).click();

      // Section intro should be visible
      await expect(page.getByText("Coming Up")).toBeVisible();
      await expect(page.getByRole("heading", { name: "General Knowledge" })).toBeVisible();
      await expect(page.getByText("3 questions")).toBeVisible();
      await expect(page.getByRole("button", { name: "Start Section" })).toBeVisible();
      await expect(page.getByRole("button", { name: /Leaderboard/ })).toBeVisible();
    });

    test("dismisses section intro with Start Section button", async ({ page }) => {
      await page.goto("/");

      // Setup quiz
      await page.getByRole("button", { name: "Start Quiz" }).click();
      await page.getByRole("textbox").fill("Test Team");
      await page.getByRole("button", { name: "Add" }).click();
      await page.getByRole("button", { name: "Start Quiz" }).click();

      // Click Start Section
      await page.getByRole("button", { name: "Start Section" }).click();

      // Should now see the quiz question
      await expect(page.getByText("Question 1 of 5")).toBeVisible();
      await expect(page.getByText("Coming Up")).not.toBeVisible();
    });

    test("dismisses section intro with Enter key", async ({ page }) => {
      await page.goto("/");

      // Setup quiz
      await page.getByRole("button", { name: "Start Quiz" }).click();
      await page.getByRole("textbox").fill("Test Team");
      await page.getByRole("button", { name: "Add" }).click();
      await page.getByRole("button", { name: "Start Quiz" }).click();

      // Press Enter to dismiss
      await expect(page.getByText("Coming Up")).toBeVisible();
      await page.keyboard.press("Enter");

      // Should now see the quiz question
      await expect(page.getByText("Question 1 of 5")).toBeVisible();
    });

    test("shows leaderboard from section intro", async ({ page }) => {
      await page.goto("/");

      // Setup quiz
      await page.getByRole("button", { name: "Start Quiz" }).click();
      await page.getByRole("textbox").fill("Test Team");
      await page.getByRole("button", { name: "Add" }).click();
      await page.getByRole("button", { name: "Start Quiz" }).click();

      // Click Leaderboard button
      await page.getByRole("button", { name: /Leaderboard/ }).click();

      // Scoreboard should be visible
      await expect(page.getByRole("heading", { name: "Scoreboard" })).toBeVisible();

      // Close scoreboard
      await page.getByRole("button", { name: "✕" }).click();

      // Should still be on section intro
      await expect(page.getByText("Coming Up")).toBeVisible();
    });

    test("shows leaderboard from section intro with S key", async ({ page }) => {
      await page.goto("/");

      // Setup quiz
      await page.getByRole("button", { name: "Start Quiz" }).click();
      await page.getByRole("textbox").fill("Test Team");
      await page.getByRole("button", { name: "Add" }).click();
      await page.getByRole("button", { name: "Start Quiz" }).click();

      // Press S to show scoreboard
      await expect(page.getByText("Coming Up")).toBeVisible();
      await page.keyboard.press("s");

      // Scoreboard should be visible
      await expect(page.getByRole("heading", { name: "Scoreboard" })).toBeVisible();

      // Press S to close
      await page.keyboard.press("s");
      await expect(page.getByRole("heading", { name: "Scoreboard" })).not.toBeVisible();
    });

    test("shows section intro when transitioning to next category", async ({ page }) => {
      await page.goto("/");

      // Setup quiz
      await page.getByRole("button", { name: "Start Quiz" }).click();
      await page.getByRole("textbox").fill("Test Team");
      await page.getByRole("button", { name: "Add" }).click();
      await page.getByRole("button", { name: "Start Quiz" }).click();

      // Dismiss first section intro
      await page.getByRole("button", { name: "Start Section" }).click();

      // Navigate through all questions in first category (General Knowledge has 3 questions)
      for (let i = 0; i < 3; i++) {
        await page.getByRole("button", { name: /Next/ }).click();
      }

      // Should show section intro for next category (Science)
      await expect(page.getByText("Coming Up")).toBeVisible();
      await expect(page.getByRole("heading", { name: "Science" })).toBeVisible();
    });
  });

  test.describe("Pre-Results Page", () => {
    async function navigateToPreResults(page: import("@playwright/test").Page) {
      await page.goto("/");

      // Setup quiz with one team
      await page.getByRole("button", { name: "Start Quiz" }).click();
      await page.getByRole("textbox").fill("Test Team");
      await page.getByRole("button", { name: "Add" }).click();
      await page.getByRole("button", { name: "Start Quiz" }).click();

      // Navigate through all questions (Example Quiz: 2 categories, 5 questions total)
      // General Knowledge (3 questions)
      await page.getByRole("button", { name: "Start Section" }).click();
      for (let i = 0; i < 3; i++) {
        await page.getByRole("button", { name: /Next/ }).click();
      }

      // Science (2 questions)
      await page.getByRole("button", { name: "Start Section" }).click();
      for (let i = 0; i < 2; i++) {
        await page.getByRole("button", { name: /Next/ }).click();
      }
    }

    test("displays pre-results page after completing all questions", async ({ page }) => {
      await navigateToPreResults(page);

      // Pre-results page should be visible
      await expect(page.getByText("That's a wrap!")).toBeVisible();
      await expect(page.getByRole("heading", { name: "Quiz Complete" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Reveal Scores" })).toBeVisible();
      await expect(page.getByText("Press Space or Enter to reveal scores")).toBeVisible();
    });

    test("displays quiz summary on pre-results page", async ({ page }) => {
      await page.goto("/");

      // Setup quiz with two teams
      await page.getByRole("button", { name: "Start Quiz" }).click();
      await page.getByRole("textbox").fill("Team Alpha");
      await page.getByRole("button", { name: "Add" }).click();
      await page.getByRole("textbox").fill("Team Beta");
      await page.getByRole("button", { name: "Add" }).click();
      await page.getByRole("button", { name: "Start Quiz" }).click();

      // Navigate through all questions (Example Quiz: 2 categories, 5 questions total)
      // General Knowledge (3 questions)
      await page.getByRole("button", { name: "Start Section" }).click();
      for (let i = 0; i < 3; i++) {
        await page.getByRole("button", { name: /Next/ }).click();
      }
      // Science (2 questions)
      await page.getByRole("button", { name: "Start Section" }).click();
      for (let i = 0; i < 2; i++) {
        await page.getByRole("button", { name: /Next/ }).click();
      }

      // Check summary displays correct team count
      await expect(page.getByText("5 questions answered by 2 teams")).toBeVisible();
    });

    test("navigates to results with Reveal Scores button", async ({ page }) => {
      await navigateToPreResults(page);

      // Click Reveal Scores button
      await page.getByRole("button", { name: "Reveal Scores" }).click();

      // Should now be on results page
      await expect(page.getByRole("heading", { name: "Quiz Complete!" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Final Standings" })).toBeVisible();
    });

    test("navigates to results with Enter key", async ({ page }) => {
      await navigateToPreResults(page);

      // Wait for pre-results page to be visible
      await expect(page.getByRole("button", { name: "Reveal Scores" })).toBeVisible();

      // Press Enter to reveal scores
      await page.keyboard.press("Enter");

      // Should now be on results page
      await expect(page.getByRole("heading", { name: "Quiz Complete!" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Final Standings" })).toBeVisible();
    });

    test("navigates to results with Space key", async ({ page }) => {
      await navigateToPreResults(page);

      // Wait for pre-results page to be visible
      await expect(page.getByRole("button", { name: "Reveal Scores" })).toBeVisible();

      // Press Space to reveal scores
      await page.keyboard.press("Space");

      // Should now be on results page
      await expect(page.getByRole("heading", { name: "Quiz Complete!" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Final Standings" })).toBeVisible();
    });

    test("settings menu is accessible from pre-results page", async ({ page }) => {
      await navigateToPreResults(page);

      // Settings should be visible
      await expect(page.getByRole("button", { name: "Settings" })).toBeVisible();

      // Can open settings
      await page.getByRole("button", { name: "Settings" }).click();
      await expect(page.getByRole("button", { name: "Reset Game" })).toBeVisible();
    });

    test("reset game works from pre-results page", async ({ page }) => {
      await navigateToPreResults(page);

      // Reset game
      await page.getByRole("button", { name: "Settings" }).click();
      await page.getByRole("button", { name: "Reset Game" }).click();
      await page.getByRole("button", { name: "Reset", exact: true }).click();

      // Should be back on home page
      await expect(page.getByRole("heading", { name: "Quizmaster" })).toBeVisible();
    });
  });
});
