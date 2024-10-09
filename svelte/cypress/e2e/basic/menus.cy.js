context("Menus", () => {
	it("default menus in default fm with local data", () => {
		cy.visit(`/index.html#/local-data`);
		cy.viewport(1300, 900);

		cy.wxF("card-dots", "/Music").click();
		cy.wxF("menu").should("be.visible");
		cy.wxF("menu").children().should("have.length", 6);
		cy.shot(`card-action-menu`);

		cy.wxF("panel-cards").wxF("card-item", "/Code").rightclick();
		cy.wxF("menu").should("be.visible");
		cy.wxF("menu").children().should("have.length", 6);
		cy.shot(`card-context-menu`);
		cy.wxF("menu-option", "copy").click();

		cy.wxF("panel-cards").rightclick("bottom");
		cy.wxF("menu").should("be.visible");
		cy.wxF("menu").children().should("have.length", 1);
		cy.shot("card-body-menu");
		cy.wxF("menu-option", "paste").click();
		cy.shot("card-copied-by-menu");

		cy.wxF("mode-table").click();
		cy.wxF("panel-table").wxF("grid-item", "/Code").rightclick();
		cy.wxF("menu").should("be.visible");
		cy.wxF("menu").children().should("have.length", 6);
		cy.shot(`table-context-menu`);

		cy.wxF("panel-table").rightclick("bottom");
		cy.shot("table-body-menu");

		cy.wxF("mode-panels").click();
		cy.wxF("fm-left-panel").wxF("grid-item", "/Pictures").rightclick();
		cy.wxF("menu").should("be.visible");
		cy.wxF("menu").children().should("have.length", 6);
		cy.wxF("menu-option", "move").click();
		cy.wxF("fm-right-panel").wxF("grid-item", "/Music").dblclick();
		cy.wxF("fm-right-panel").rightclick("bottom");
		cy.wxF("menu").should("be.visible");
		cy.wxF("menu").children().should("have.length", 1);
		cy.wxF("menu-option", "paste").click();
		cy.shot("panels-menus-cut-paste");

		cy.wxF("fm-left-panel").wxF("grid-item", "/Code").dblclick();
		cy.wxF("fm-left-panel")
			.wxF("grid-item", "/Code/ColorPicker.svelte")
			.rightclick();
		cy.wxF("menu").should("be.visible");
		cy.wxF("menu").children().should("have.length", 7);
		cy.shot("default-file-context-menu");

		cy.wxF("mode-table").click();
		cy.wxF("tree-item", "/Code").rightclick();
		cy.wxF("menu").should("be.visible");
		cy.wxF("menu").children().should("have.length", 6);
		cy.shot("tree-default-menu");

		cy.wxF("mode-table").click();
		cy.wxF("tree-item", "/").rightclick();
		cy.wxF("menu").should("be.visible");
		cy.wxF("menu").children().should("have.length", 1);
		cy.shot("tree-root-default-menu");

		cy.wxF("tree-item", "/").click();
		cy.wxF("add-button").click();
		cy.wxF("menu").should("be.visible");
		cy.wxF("menu").children().should("have.length", 3);
		cy.wxF("menu-option", "add-file").click();
		cy.get(".wx-modal").should("be.visible");
		cy.get(".wx-modal").find("button").contains("OK").click();
		cy.wxF("mode-cards").click();
		cy.wxF("panel-cards").children().should("have.length", 5);
		cy.wxF("add-button").click();
		// temp, uncomment when tree add temp ids issue will be fixed
		cy.wxF("menu-option", "add-folder").click();
		cy.get(".wx-modal").should("be.visible");
		cy.get(".wx-modal").find("button").contains("OK").click();
		cy.wxF("panel-cards").children().should("have.length", 6);
	});

	it("menu works for multiselection", () => {
		cy.visit(`/index.html#/local-data`);
		cy.viewport(1300, 900);

		cy.wxF("panel-cards")
			.wxF("card-item", "/Code")
			.click({ ctrlKey: true });
		cy.wxF("panel-cards")
			.wxF("card-item", "/Music")
			.click({ ctrlKey: true });
		cy.wxF("panel-cards")
			.wxF("card-item", "/Pictures")
			.click({ ctrlKey: true });
		cy.wxF("panel-cards").wxF("card-item", "/Pictures").rightclick();
		cy.wxF("menu").should("be.visible");
		cy.wxF("menu").children().should("have.length", 4);
		cy.get(".wx-item.wx-selected").should("have.length", 3);
		cy.wxF("panel-cards").click("bottom");

		cy.wxF("mode-table").click();
		cy.wxF("panel-table")
			.wxF("grid-item", "/Code")
			.click({ ctrlKey: true });
		cy.wxF("panel-table")
			.wxF("grid-item", "/Music")
			.click({ ctrlKey: true });
		cy.wxF("panel-table")
			.wxF("grid-item", "/Pictures")
			.click({ ctrlKey: true });
		cy.wait(300); // somehow that last element gets detached
		cy.wxF("panel-table").wxF("grid-item", "/Pictures").rightclick();
		cy.wxF("menu").should("be.visible");
		cy.wxF("menu").children().should("have.length", 4);
		cy.get(".wx-row.wx-selected").should("have.length", 3);

		cy.wxF("mode-panels").click();
		cy.wxF("fm-left-panel").wxF("grid-item", "/Code").click();
		cy.wxF("fm-right-panel").wxF("grid-item", "/Music").click();
		cy.wxF("fm-left-panel")
			.wxF("grid-item", "/Music")
			.click({ ctrlKey: true });
		cy.wxF("fm-right-panel")
			.wxF("grid-item", "/Pictures")
			.click({ ctrlKey: true });
		cy.wxF("fm-right-panel").wxF("grid-item", "/Pictures").rightclick();
		cy.wxF("menu").should("be.visible");
		cy.wxF("menu").children().should("have.length", 4);

		cy.wxF("mode-panels").click();
		cy.wxF("fm-left-panel").wxF("grid-item", "/Music").rightclick();
		cy.wxF("menu").should("be.visible");
		cy.wxF("menu").children().should("have.length", 4);
		cy.get(".wx-row.wx-selected").should("have.length", 4);
	});

	it("menu works for new files and folders", () => {
		cy.visit(`/index.html#/local-data`);
		cy.viewport(1300, 900);

		cy.wxF("add-button").click();
		cy.wxF("menu-option", "add-file").click();
		cy.get(".wx-modal").should("be.visible");
		cy.get(".wx-modal").find("button").contains("OK").click();
		cy.wxF("panel-cards").wxF("card-item", "/New file.txt").rightclick();
		cy.wxF("menu").should("be.visible");
		cy.wxF("menu").children().should("have.length", 7);

		cy.wxF("add-button").click();
		cy.wxF("menu-option", "add-folder").click();
		cy.get(".wx-modal").should("be.visible");
		cy.get(".wx-modal").find("button").contains("OK").click();
		cy.wxF("panel-cards").wxF("card-item", "/New folder").rightclick();
		cy.wxF("menu").should("be.visible");
		cy.wxF("menu").children().should("have.length", 6);
	});

	it("default menus in readonly fm with local data", () => {
		cy.visit(`/index.html#/readonly`);
		cy.viewport(1300, 900);

		cy.wxF("card-dots", "/Music").click();
		cy.wxF("menu").should("not.exist");
		cy.shot(`card-action-menu-readonly`);

		cy.wxF("panel-cards").wxF("card-item", "/Code").rightclick();
		cy.wxF("menu").should("not.exist");
		cy.shot(`card-context-menu-readonly`);

		cy.wxF("panel-cards").rightclick("bottom");
		cy.shot("card-body-menu-readonly");

		cy.wxF("mode-table").click();
		cy.wxF("panel-table").wxF("grid-item", "/Code").rightclick();
		cy.wxF("menu").should("not.exist");
		cy.shot(`table-context-menu-readonly`);

		cy.wxF("mode-panels").click();
		cy.wxF("fm-left-panel").wxF("grid-item", "/Pictures").rightclick();
		cy.wxF("menu").should("not.exist");

		cy.wxF("mode-cards").click();
		cy.wxF("panel-cards").wxF("card-item", "/Code").dblclick();

		cy.wxF("card-dots", "/Code/Area.svelte").click();
		cy.shot(`card-action-menu-file-readonly`);

		cy.wxF("panel-cards")
			.wxF("card-item", "/Code/Area.svelte")
			.rightclick();
		cy.wxF("menu").should("be.visible");
		cy.wxF("menu").children().should("have.length", 1);
		cy.shot(`card-context-menu-readonly-file`);

		cy.wxF("panel-cards").rightclick(215, 215);
		cy.shot("card-body-menu-readonly-2");

		cy.wxF("mode-table").click();
		cy.wxF("panel-table")
			.wxF("grid-item", "/Code/Combo.svelte")
			.rightclick();
		cy.wxF("menu").should("be.visible");
		cy.wxF("menu").children().should("have.length", 1);
		cy.shot(`table-context-menu-readonly-2`);

		cy.wxF("mode-panels").click();
		cy.wxF("fm-left-panel")
			.wxF("grid-item", "/Code/Confirm.svelte")
			.rightclick();
		cy.wxF("menu").should("be.visible");
		cy.wxF("menu").children().should("have.length", 1);

		cy.wxF("mode-table").click();
		cy.wxF("tree-item", "/Code").rightclick();
		cy.wxF("menu").should("not.exist");
		cy.shot("tree-readonly-menu");

		cy.wxF("tree-item", "/").rightclick();
		cy.wxF("menu").should("not.exist");
		cy.shot("tree-root-readonly-menu");

		cy.wxF("add-button").should("not.exist");
	});

	it("custom menus in default fm with local data", () => {
		cy.visit(`/index.html#/custom-menu`);
		cy.viewport(1300, 900);

		cy.wxF("panel-cards").wxF("card-item", "/Code").rightclick();
		cy.wxF("menu").should("not.exist");
		cy.shot(`card-no-custom-context-menu`);

		cy.wxF("card-dots", "/Music").click();
		cy.wxF("menu").should("be.visible");
		cy.wxF("menu").children().should("have.length", 8);
		cy.shot(`card-custom-action-menu`);
		cy.wxF("menu-option", "clone").click();
		cy.wxF("panel-cards").children().should("have.length", 5);

		cy.wxF("panel-cards").wxF("card-item", "/Pictures").rightclick();
		cy.wxF("menu").should("be.visible");
		cy.wxF("menu").children().should("have.length", 1);
		cy.shot(`card-custom-context-menu`);
	});

	it("custom menus in readonly fm with local data", () => {
		cy.visit(`/index.html#/custom-menu-readonly`);
		cy.viewport(1300, 900);

		cy.wxF("panel-cards").wxF("card-item", "/Code").rightclick();
		cy.wxF("menu").should("not.exist");
		cy.shot(`card-no-custom-context-menu-readonly`);

		cy.wxF("card-dots", "/Music").click();
		cy.wxF("menu").should("not.exist");
		cy.shot(`card-custom-action-menu-readonly`);

		cy.wxF("panel-cards").wxF("card-item", "/Pictures").rightclick();
		cy.wxF("menu").should("not.exist");
		cy.shot(`card-custom-context-menu-readonly`);

		cy.wxF("panel-cards").wxF("card-item", "/Code").dblclick();
		cy.wxF("panel-cards")
			.wxF("card-item", "/Code/Button.svelte")
			.rightclick(0, 50); // [temp] workaround for svelte-menu fitToBody bug
		cy.wxF("menu").should("be.visible");
		cy.wxF("menu").children().should("have.length", 1);
		cy.shot(`card-custom-context-menu-readonly-file`);
	});
});
