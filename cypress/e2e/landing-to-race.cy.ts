describe("Landing to Race Management to Race completion", () => {
  it("navigates, starts race, and sees completion with results modal", () => {
    // Landing page
    cy.visit("/");
    cy.contains("button", "PLAY").click();

    // Race Management page
    cy.contains("h1", "Race Management", { timeout: 20000 }).should("be.visible");

    // Start Race button might show "Start Race" initially or "Next Race (Round X)" after first
    cy.contains("button", /Start Race|Next Race/i, { timeout: 20000 }).click();

    // Optionally ensure we navigated to the race page first
    cy.location("pathname", { timeout: 10000 }).should("match", /\/race(?!-management)/);

    // Race page: wait for race to finish and redirect back to race management
    // The race has a pre-race period (~4s) plus animation; allow enough time and assert redirect
    cy.contains("h1", "Race Management", { timeout: 60000 }).should("be.visible");

    // Assert the results modal appears with ordering
    cy.get(".modal-overlay", { timeout: 10000 }).should("be.visible");
    cy.contains(".modal-title", /Round .* Results/).should("be.visible");
    cy.get(".results-list .result-item").should("have.length.greaterThan", 0);
    cy.get(".results-list .result-item .position-number").first().should("have.text", "1");

    // Assert that at least one round shows as Completed
    cy.contains(".status-badge", "Completed").should("exist");
  });
});
