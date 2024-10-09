context("Navigation with local data", () => {
	beforeEach(() => {
		cy.visit("/index.html#/local-data");
		cy.viewport(1300, 900);
	});

	it("by folders, back to parent and crumbs in table", () => {
		cy.wxF("mode-table").click();
		cy.wait(100);
		cy.wxF("panel-table").should("be.visible");
		cy.wxF("panel-table").get(".wx-row").should("have.length", 4);
		cy.wxF("panel-table").wxF("grid-item", "/Code").dblclick();
		cy.wxF("panel-table").wxF("grid-item", "/Code/Datepicker").dblclick();
		cy.wxF("panel-table").get(".wx-row.wx-selected").should("not.exist");
		cy.wxF("panel-crumbs").children().last().contains("Datepicker");
		cy.shot("open-folders-in-table-mode");

		cy.wxF("panel-crumbs").wxF("crumb", "/Code").click();
		cy.wxF("panel-table")
			.wxF("grid-item", "/Code/Datepicker")
			.should("have.class", "wx-selected");
		cy.wxF("panel-crumbs").children().last().contains("Code");
		cy.shot("back-by-crumbs-in-table-mode");

		cy.wxF("panel-table")
			.wxF("grid-item", "/wx-filemanager-parent-link")
			.dblclick();
		cy.wxF("panel-table")
			.wxF("grid-item", "/Code")
			.should("have.class", "wx-selected");
		cy.wxF("panel-crumbs").children().last().contains("My files");
		cy.shot("back-by-parent-link-in-table-mode");
	});

	it("by folders, back to parent and crumbs in cards", () => {
		cy.wxF("panel-cards").should("be.visible");
		cy.wxF("panel-cards").wxF("card-item", "/Code").dblclick();
		cy.wxF("panel-cards").wxF("card-item", "/Code/Datepicker").dblclick();
		cy.wxF("panel-cards").get(".wx-item.wx-selected").should("not.exist");
		cy.wxF("panel-crumbs").children().last().contains("Datepicker");
		cy.shot("open-folders-in-cards-mode");

		cy.wxF("panel-crumbs").wxF("crumb", "/Code").click();
		cy.wxF("panel-cards")
			.wxF("card-item", "/Code/Datepicker")
			.should("have.class", "wx-selected");
		cy.wxF("panel-crumbs").children().last().contains("Code");
		cy.shot("back-by-crumbs-in-cards-mode");

		cy.wxF("panel-cards").find(".wx-back").dblclick();
		cy.wxF("panel-cards")
			.wxF("card-item", "/Code")
			.should("have.class", "wx-selected");
		cy.wxF("panel-crumbs").children().last().contains("My files");
		cy.shot("back-by-parent-link-in-cards-mode");
	});

	it("by folders, back to parent and crumbs in panels", () => {
		cy.wxF("mode-panels").click();
		cy.wxF("fm-left-panel").should("be.visible");
		cy.wxF("fm-right-panel").should("be.visible");

		cy.wxF("fm-left-panel").wxF("grid-item", "/Code").dblclick();
		cy.wxF("fm-left-panel").wxF("grid-item", "/Code/Datepicker").dblclick();
		cy.wxF("fm-left-panel").get(".wx-row.wx-selected").should("not.exist");
		cy.wxF("fm-left-panel")
			.find(".wx-breadcrumbs")
			.children()
			.last()
			.contains("Datepicker");
		cy.shot("open-folders-in-left-panel");

		cy.wxF("fm-left-panel")
			.find(".wx-breadcrumbs")
			.wxF("crumb", "/Code")
			.click();
		cy.wxF("fm-left-panel")
			.wxF("grid-item", "/Code/Datepicker")
			.should("have.class", "wx-selected");
		cy.wxF("fm-left-panel")
			.find(".wx-breadcrumbs")
			.children()
			.last()
			.contains("Code");
		cy.shot("back-by-crumbs-in-left-panel");

		cy.wxF("fm-left-panel")
			.wxF("grid-item", "/wx-filemanager-parent-link")
			.dblclick();
		cy.wxF("fm-left-panel")
			.wxF("grid-item", "/Code")
			.should("have.class", "wx-selected");
		cy.wxF("panel-crumbs").children().last().contains("My files");
		cy.shot("back-by-parent-link-in-left-panel");

		cy.wxF("fm-right-panel").wxF("grid-item", "/Code").dblclick();
		cy.wxF("fm-right-panel")
			.wxF("grid-item", "/Code/Datepicker")
			.dblclick();
		cy.wxF("fm-right-panel")
			.find(".wx-row.wx-selected")
			.should("have.length", 0);
		cy.wxF("fm-right-panel")
			.find(".wx-breadcrumbs")
			.children()
			.last()
			.contains("Datepicker");
		cy.shot("open-folders-in-right-panel");

		cy.wxF("fm-right-panel")
			.find(".wx-breadcrumbs")
			.wxF("crumb", "/Code")
			.click();
		cy.wxF("fm-right-panel")
			.find(".wx-breadcrumbs")
			.children()
			.last()
			.contains("Code");
		cy.wxF("fm-right-panel")
			.wxF("grid-item", "/Code/Datepicker")
			.should("have.class", "wx-selected");
		cy.shot("back-by-crumbs-in-right-panel");

		cy.wxF("fm-right-panel")
			.wxF("grid-item", "/wx-filemanager-parent-link")
			.dblclick();
		cy.wxF("fm-right-panel")
			.wxF("grid-item", "/Code")
			.should("have.class", "wx-selected");
		cy.wxF("panel-crumbs").children().last().contains("My files");
		cy.shot("back-by-parent-link-in-right-panel");
	});

	it("by tree (open/close branches)", () => {
		cy.wxF("tree").should("be.visible");
		cy.wxF("tree")
			.wxF("tree-item", "/")
			.should("have.class", "wx-selected");

		cy.wxF("tree").wxF("tree-toggle", "/Code").click();
		cy.wxF("tree")
			.wxF("tree-item", "/Code/Datepicker")
			.should("be.visible");
		cy.shot("open-tree-branch");

		cy.wxF("tree").wxF("tree-toggle", "/Code").click();
		cy.wxF("tree").wxF("tree-item", "/Code/Datepicker").should("not.exist");
		cy.wxF("tree")
			.wxF("tree-item", "/Code")
			.should("not.have.class", "wx-selected");
		cy.shot("close-tree-branch");

		cy.wxF("tree").wxF("tree-item", "/Code").click();
		cy.wxF("panel-crumbs").children().last().contains("Code");
		cy.wxF("tree")
			.wxF("tree-item", "/Code")
			.should("have.class", "wx-selected");
		cy.wxF("panel-cards").get(".wx-item.wx-selected").should("not.exist");

		cy.wxF("tree").wxF("tree-toggle", "/Code").click();
		cy.wxF("tree").wxF("tree-item", "/Code/Datepicker").click();
		cy.wxF("panel-cards").get(".wx-item.wx-selected").should("not.exist");
		cy.wxF("tree")
			.wxF("tree-item", "/Code/Datepicker")
			.should("have.class", "wx-selected");
		cy.wxF("panel-crumbs").children().last().contains("Datepicker");

		cy.wxF("tree").wxF("tree-item", "/").click();
		cy.wxF("panel-crumbs").children().last().contains("My file");
		cy.wxF("panel-cards")
			.wxF("card-item", "/Code")
			.should("have.class", "wx-selected");
		cy.wxF("tree")
			.wxF("tree-item", "/")
			.should("have.class", "wx-selected");
		cy.shot("open-folders-by-tree");
	});
});
