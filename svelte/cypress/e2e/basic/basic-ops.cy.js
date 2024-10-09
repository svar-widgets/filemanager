context("Basic functionality", () => {
	it("main views", () => {
		cy.visit(`/index.html#/local-data`);
		cy.viewport(1300, 900);
		cy.shot(`initial`);

		cy.wxF("mode-table").click();
		cy.shot("initial-table");

		cy.wxF("mode-panels").click();
		cy.shot("initial-panels");

		cy.wxF("mode-cards").click();
		cy.wxF("panel-cards").wxF("card-item", "/Code").dblclick();
		cy.shot("cards-many-items");

		cy.wxF("mode-table").click();
		cy.shot("table-many-items");

		cy.wxF("mode-panels").click();
		cy.shot("panels-many-items");
	});

	it("renaming works", () => {
		cy.visit("/index.html#/local-data");
		cy.viewport(1300, 900);

		cy.wxF("panel-cards").wxF("card-item", "/Code").rightclick();
		cy.wxF("menu-option", "rename").click();
		cy.get(".wx-modal").should("be.visible");
		cy.get(".wx-modal").find("input").type("New name{enter}");
		cy.wxF("panel-cards")
			.wxF("card-item", "/New name")
			.should("be.visible");
		cy.wxF("tree-item", "/New name").should("be.visible");
		cy.shot("card-renamed");

		cy.wxF("mode-table").click();
		cy.wxF("panel-table").wxF("grid-item", "/Music").rightclick();
		cy.wxF("menu-option", "rename").click();
		cy.get(".wx-modal").should("be.visible");
		cy.get(".wx-modal").find("input").type("Miracle of sound{enter}");
		cy.wxF("panel-table")
			.wxF("grid-item", "/Miracle of sound")
			.should("be.visible");
		cy.wxF("tree-item", "/Miracle of sound").should("be.visible");
		cy.shot("grid-item-renamed");

		cy.wxF("mode-panels").click();
		cy.wxF("fm-right-panel").wxF("grid-item", "/Info.txt").rightclick();
		cy.wxF("menu-option", "rename").click();
		cy.get(".wx-modal").should("be.visible");
		cy.get(".wx-modal").find("input").type("Reamde.xx{enter}");
		cy.wxF("fm-right-panel")
			.wxF("grid-item", "/Reamde.xx")
			.should("be.visible");
		cy.wxF("fm-left-panel")
			.wxF("grid-item", "/Reamde.xx")
			.should("be.visible");
		cy.shot("panel-item-renamed");

		cy.wxF("mode-cards").click();
		cy.wxF("tree-toggle", "/New name").click();
		cy.wxF("tree-item", "/New name").click();
		cy.wxF("tree-item", "/New name/Datepicker").rightclick();
		cy.wxF("menu-option", "rename").click();
		cy.get(".wx-modal").should("be.visible");
		cy.get(".wx-modal").find("input").type("Spacepicker{enter}");
		cy.wxF("tree-item", "/New name/Spacepicker").should("be.visible");
		cy.wxF("panel-cards")
			.wxF("card-item", "/New name/Spacepicker")
			.should("be.visible");
		cy.shot("tree-item-renamed");
	});

	it("deleting works", () => {
		cy.visit("/index.html#/local-data");
		cy.viewport(1300, 900);

		cy.wxF("panel-cards").wxF("card-item", "/Code").rightclick();
		cy.wxF("menu-option", "delete").click();
		cy.get(".wx-modal").should("be.visible");
		cy.get(".wx-modal").find("button").contains("OK").click();
		cy.wxF("panel-cards").children().should("have.length", 3);
		cy.wxF("tree").children().should("have.length", 3);
		cy.shot("card-deleted");

		cy.wxF("mode-table").click();
		cy.wxF("panel-table").wxF("grid-item", "/Music").rightclick();
		cy.wxF("menu-option", "delete").click();
		cy.get(".wx-modal").should("be.visible");
		cy.get(".wx-modal").find("button").contains("Cancel").click();
		cy.wxF("panel-table")
			.find(".wx-scroll .wx-body .wx-data")
			.children()
			.should("have.length", 3);
		cy.wxF("tree").children().should("have.length", 3);
		cy.shot("item-not-deleted");

		cy.wxF("tree-item", "/Pictures").rightclick();
		cy.wxF("menu-option", "delete").click();
		cy.get(".wx-modal").should("be.visible");
		cy.get(".wx-modal").find("button").contains("OK").click();
		cy.wxF("panel-table")
			.find(".wx-scroll .wx-body .wx-data")
			.children()
			.should("have.length", 2);
		cy.wxF("tree").children().should("have.length", 2);
		cy.shot("tree-item-deleted");

		cy.wxF("mode-panels").click();
		cy.wxF("fm-right-panel").wxF("grid-item", "/Info.txt").click();
		cy.wxF("fm-right-panel")
			.wxF("grid-item", "/Music")
			.click({ ctrlKey: true });
		cy.wxF("fm-right-panel").wxF("grid-item", "/Info.txt").rightclick();
		cy.wxF("menu-option", "delete").click();
		cy.get(".wx-modal").should("be.visible");
		cy.get(".wx-modal").find("button").contains("OK").click();
		cy.wxF("fm-right-panel")
			.find(".wx-scroll .wx-body .wx-data")
			.children()
			.should("have.length", 0);
		cy.wxF("fm-left-panel")
			.find(".wx-scroll .wx-body .wx-data")
			.children()
			.should("have.length", 0);
		cy.shot("multiple-deleted");
		cy.wxF("mode-cards").click();
		cy.wxF("tree").children().should("have.length", 1);
		cy.shot("multiple-deleted-tree-view");
	});

	it("sorting works", () => {
		cy.visit("/index.html#/local-data");
		cy.viewport(1300, 900);
		cy.wxF("mode-table").click();
		cy.wxF("panel-table").find(".wx-header .wx-cell").eq(0).click();
		cy.wxF("panel-table")
			.find(".wx-sort .wxi-arrow-down")
			.should("be.visible");
		cy.wxF("panel-table")
			.find(".wx-row")
			.eq(0)
			.should("contain", "Pictures");
		cy.shot("table-mode-sort-desc");
		cy.wxF("mode-cards").click();
		cy.wxF("panel-cards")
			.find(".wx-item")
			.eq(0)
			.should("contain", "Pictures");
		cy.shot("cards-mode-sort-desc");
		cy.wxF("mode-panels").click();
		cy.wxF("fm-right-panel").wxF("grid-item", "/Pictures").dblclick();
		cy.wxF("fm-right-panel").find(".wx-header .wx-cell").eq(2).click();
		cy.wxF("fm-right-panel")
			.find(".wx-row")
			.eq(1)
			.should("contain", "dasha-emma-i-kieit.jpeg");
		cy.shot("panels-right-sort-date");
		cy.wxF("mode-cards").click();
		cy.wxF("panel-cards")
			.find(".wx-item")
			.eq(0)
			.should("contain", "dasha-emma-i-kieit.jpeg");
		cy.shot("cards-mode-sort-date");
	});
});
