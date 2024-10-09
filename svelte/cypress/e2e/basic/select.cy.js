context("Selection", () => {
	it("multiple selections with local data", () => {
		cy.visit(`/index.html#/local-data`);
		cy.viewport(1300, 900);

		cy.wxF("panel-cards").wxF("card-item", "/Code").click();
		cy.wxF("panel-cards")
			.wxF("card-item", "/Music")
			.click({ ctrlKey: true });
		cy.get(".wx-item.wx-selected").should("have.length", 2);
		cy.shot("cars-select-toggle");
		cy.wxF("panel-cards")
			.wxF("card-item", "/Info.txt")
			.click({ shiftKey: true });
		cy.get(".wx-item.wx-selected").should("have.length", 4);
		cy.shot("cards-select-range");
		cy.wxF("panel-cards").click("bottom");

		cy.wxF("mode-table").click();
		cy.wxF("panel-table").wxF("grid-item", "/Code").click();
		cy.wxF("panel-table")
			.wxF("grid-item", "/Music")
			.click({ ctrlKey: true });
		cy.get(".wx-row.wx-selected").should("have.length", 2);
		cy.shot("grid-select-toggle");
		cy.wxF("panel-table")
			.wxF("grid-item", "/Info.txt")
			.click({ shiftKey: true });
		cy.get(".wx-row.wx-selected").should("have.length", 4);
		cy.shot("grid-select-range");

		cy.wxF("mode-panels").click();
		cy.wxF("fm-left-panel").wxF("grid-item", "/Code").click();
		cy.wxF("fm-right-panel").wxF("grid-item", "/Code").click();
		cy.wxF("fm-left-panel")
			.wxF("grid-item", "/Pictures")
			.click({ ctrlKey: true });
		cy.wxF("fm-right-panel")
			.wxF("grid-item", "/Info.txt")
			.click({ shiftKey: true });
		cy.get(".wx-row.wx-selected").should("have.length", 6);
		cy.shot("panel-select-toggle-range");
	});

	it("back to parent selection with local data", () => {
		cy.visit(`/index.html#/local-data`);
		cy.viewport(1300, 900);

		cy.wxF("fm").wxF("card-item", "/Code").dblclick();
		cy.wxF("panel-cards").find(".wx-back").should("have.length", 1);
		cy.wxF("panel-cards").find(".wx-back").click();
		cy.wxF("panel-cards")
			.find(".wx-back")
			.should("have.class", "wx-selected");
		cy.shot("cards-select-parent-link");

		cy.wxF("mode-table").click();
		cy.wxF("panel-table").wxF("grid-item", "/Code/Datepicker").dblclick();
		cy.wxF("panel-table")
			.wxF("grid-item", "/wx-filemanager-parent-link")
			.click();
		cy.get(".wx-row.wx-selected").should("have.length", 1);
		cy.wxF("panel-table")
			.wxF("grid-item", "/wx-filemanager-parent-link")
			.should("have.class", "wx-selected");
		cy.shot("table-select-parent-link");

		cy.wxF("mode-panels").click();
		cy.wxF("fm-left-panel")
			.wxF("grid-item", "/wx-filemanager-parent-link")
			.click();
		cy.wxF("fm-left-panel")
			.wxF("grid-item", "/wx-filemanager-parent-link")
			.should("have.class", "wx-selected");
		cy.wxF("fm-right-panel").wxF("grid-item", "/Code").dblclick();
		cy.wxF("fm-right-panel")
			.wxF("grid-item", "/wx-filemanager-parent-link")
			.click();
		cy.wxF("fm-right-panel")
			.wxF("grid-item", "/wx-filemanager-parent-link")
			.should("have.class", "wx-selected");
		cy.get(".wx-row.wx-selected").should("have.length", 2);
		cy.shot("panels-select-parent-link");
	});

	it("back to parent selection shouldn't work with selected items and ctrl/shift with local data", () => {
		cy.visit(`/index.html#/local-data`);
		cy.viewport(1300, 900);

		cy.wxF("panel-cards").wxF("card-item", "/Code").dblclick();
		cy.wxF("panel-cards").wxF("card-item", "/Code/Datepicker").click();
		cy.wxF("panel-cards").find(".wx-back").click({ ctrlKey: true });
		cy.wxF("panel-cards")
			.get(".wx-item.wx-selected")
			.should("have.length", 1);
		cy.wxF("panel-cards")
			.find(".wx-back")
			.should("not.have.class", "wx-selected");
		cy.wxF("panel-cards").find(".wx-back").click({ shiftKey: true });
		cy.wxF("panel-cards")
			.get(".wx-item.wx-selected")
			.should("have.length", 1);
		cy.wxF("panel-cards")
			.find(".wx-back")
			.should("not.have.class", "wx-selected");
		cy.shot("cards-nonselect-parent-link");

		cy.wxF("mode-table").click();
		cy.wxF("panel-table")
			.wxF("grid-item", "/wx-filemanager-parent-link")
			.click({ ctrlKey: true });
		cy.get(".wx-row.wx-selected").should("have.length", 1);
		cy.wxF("panel-table")
			.wxF("grid-item", "/Code/Datepicker")
			.should("have.class", "wx-selected");
		cy.wxF("panel-table")
			.wxF("grid-item", "/wx-filemanager-parent-link")
			.click({ shiftKey: true });
		cy.get(".wx-row.wx-selected").should("have.length", 1);
		cy.wxF("panel-table")
			.wxF("grid-item", "/Code/Datepicker")
			.should("have.class", "wx-selected");
		cy.shot("table-nonselect-parent-link");

		cy.wxF("mode-panels").click();
		cy.wxF("fm-left-panel")
			.wxF("grid-item", "/wx-filemanager-parent-link")
			.click({ ctrlKey: true });
		cy.wxF("fm-left-panel")
			.wxF("grid-item", "/wx-filemanager-parent-link")
			.click({ shiftKey: true });
		cy.get(".wx-row.wx-selected").should("have.length", 1);
		cy.wxF("fm-left-panel")
			.wxF("grid-item", "/Code/Datepicker")
			.should("have.class", "wx-selected");
		cy.wxF("fm-right-panel").wxF("grid-item", "/Code").dblclick();
		cy.wxF("fm-right-panel").wxF("grid-item", "/Code/Datepicker").click();
		cy.wxF("fm-right-panel")
			.wxF("grid-item", "/wx-filemanager-parent-link")
			.click({ ctrlKey: true });
		cy.wxF("fm-right-panel")
			.wxF("grid-item", "/wx-filemanager-parent-link")
			.click({ shiftKey: true });
		cy.get(".wx-row.wx-selected").should("have.length", 2);
		cy.wxF("fm-right-panel")
			.wxF("grid-item", "/Code/Datepicker")
			.should("have.class", "wx-selected");
		cy.shot("panels-nonselect-parent-link");
	});
});
