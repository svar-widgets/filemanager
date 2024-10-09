context("Search", () => {
	it("Search works with local data", () => {
		cy.visit("/index.html#/local-data");
		cy.viewport(1300, 900);

		cy.wxF("toolbar").find(".wxi-search").should("be.visible");

		cy.wxF("search-input").type("too");
		cy.wxF("toolbar").find(".wxi-close").should("be.visible");
		cy.wxF("sidebar").should("not.exist");
		cy.wxF("panel-search")
			.find(".wx-text")
			.should("contain", "Search results in  My files");
		cy.wxF("mode-panels").parent().should("not.have.class", "wx-selected");
		cy.wxF("mode-cards").parent().should("not.have.class", "wx-selected");
		cy.wxF("mode-table").parent().should("not.have.class", "wx-selected");
		cy.shot("search-mode-from-root");

		cy.wxF("search-input").clear();
		cy.wxF("toolbar").find(".wxi-search").should("be.visible");
		cy.wxF("sidebar").should("be.visible");
		cy.wxF("panel-crumbs").find(".wx-item").should("contain", "My files");
		cy.wxF("mode-cards").parent().should("have.class", "wx-selected");
		cy.shot("clearing-input-changes-mode-to-cards");

		cy.wxF("panel-cards").wxF("card-item", "/Code").dblclick();
		cy.wxF("search-input").type("TOO");
		cy.wxF("toolbar").find(".wxi-close").should("be.visible");
		cy.wxF("sidebar").should("not.exist");
		cy.wxF("panel-search")
			.find(".wx-text")
			.should("contain", "Search results in  My files/ Code");
		cy.wxF("mode-panels").parent().should("not.have.class", "wx-selected");
		cy.wxF("mode-cards").parent().should("not.have.class", "wx-selected");
		cy.wxF("mode-table").parent().should("not.have.class", "wx-selected");
		cy.shot("search-mode-from-folder");

		cy.wxF("panel-search").find(".wxi-angle-left").click();
		cy.wxF("toolbar").find(".wxi-search").should("be.visible");
		cy.wxF("sidebar").should("be.visible");
		cy.wxF("panel-crumbs").children().last().contains("Code");
		cy.wxF("mode-cards").parent().should("have.class", "wx-selected");
		cy.shot("click-left-arrow-icon-changes-mode-to-cards");
	});
});
