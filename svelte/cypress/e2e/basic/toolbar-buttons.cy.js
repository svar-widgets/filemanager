context("Mode change", () => {
	it("Mode changes and preview works with local data", () => {
		cy.visit("/index.html#/local-data");
		cy.viewport(1300, 900);

		cy.wxF("preview-button").click();
		cy.wxF("panel-preview").should("be.visible");
		cy.shot("open-preview");

		cy.wxF("preview-button").click();
		cy.wxF("panel-preview").should("not.exist");
		cy.shot("close-preview");

		cy.wxF("mode-table").click();
		cy.wxF("panel-table").should("be.visible");
		cy.shot("open-panel-table");

		cy.wxF("mode-cards").click();
		cy.wxF("panel-cards").should("be.visible");
		cy.shot("open-panel-cards");

		cy.wxF("mode-panels").click();
		cy.wxF("fm-left-panel").should("be.visible");
		cy.wxF("fm-right-panel").should("be.visible");
		cy.shot("open-panels");

		cy.wxF("mode-panels").click();
		cy.wxF("fm-left-panel").should("be.visible");
		cy.wxF("fm-right-panel").should("be.visible");
		cy.shot("second-click-on-selected-mode");
	});
});
