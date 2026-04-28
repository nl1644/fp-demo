import puppeteer from "puppeteer";

(async () => {
  let browser;
  try {
    // Launch the browser and open a new blank page
    browser = await puppeteer.launch({ headless: false, slowMo: 50 });
    const page = await browser.newPage();

    // Navigate the page to a URL
    await page.goto("http://localhost:3000");

    const attempts = [
      { email: "wrong-user-1@example.com", password: "wrongpassword1" },
      { email: "wrong-user-2@example.com", password: "wrongpassword2" },
      { email: "demo@example.com", password: "password123" },
    ];

    for (const attempt of attempts) {
      console.log(`Attempting login for: ${attempt.email}`);

      // Hide the result box from previous attempts if visible
      await page.evaluate(() => {
        const box = document.querySelector("#resultBox");
        if (box) box.classList.add("hidden");
      });

      // Clear existing values and type new ones
      await page.click("#emailInput", { clickCount: 3 });
      await page.keyboard.press("Backspace");
      await page.type("#emailInput", attempt.email, { delay: 10 });

      await page.click("#passwordInput", { clickCount: 3 });
      await page.keyboard.press("Backspace");
      await page.type("#passwordInput", attempt.password, { delay: 10 });

      // Click the login button
      await page.click("#loginBtn");

      // Wait for server response to be visible
      await page.waitForSelector("#resultBox:not(.hidden)");

      // Capture any visible result message
      const message = await page.evaluate(() => {
        const el = document.querySelector("#resultMessage");
        return el ? el.textContent.trim() : "No result message found";
      });

      console.log("Server response:", message);

      // Wait for 1 second before the next attempt
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } finally {
    if (browser) {
      // Keep the browser open for a few seconds to see the final result
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await browser.close();
    }
  }
})().catch((err) => {
  console.error("Bot test failed:", err);
});
