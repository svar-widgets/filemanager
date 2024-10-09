context("Hotkeys", () => {
	it("copy-cut-paste in default fm with local data", () => {
		cy.visit(`/index.html#/local-data`);
		cy.viewport(1300, 900);

		cy.wxF("panel-cards").wxF("card-item", "/Code").click();
		cy.wxF("fm").trigger("keydown", { ctrlKey: true, code: "C" });
		cy.wxF("panel-cards").click("bottom");
		cy.wxF("fm").trigger("keydown", { ctrlKey: true, code: "V" });
		cy.shot("card-copied-by-hotkey");

		cy.wxF("mode-table").click();
		cy.wxF("panel-table").wxF("grid-item", "/Info.txt").click();
		cy.wxF("fm").trigger("keydown", { ctrlKey: true, code: "C" });
		cy.wxF("panel-table").click("bottom");
		cy.wxF("fm").trigger("keydown", { ctrlKey: true, code: "V" });
		cy.shot("grid-item-copied-by-hotkey");

		cy.wxF("mode-panels").click();
		cy.wxF("fm-left-panel").wxF("grid-item", "/Pictures").click();
		cy.wxF("fm").trigger("keydown", { ctrlKey: true, code: "X" });
		cy.wxF("fm-right-panel").wxF("grid-item", "/Music").dblclick();
		cy.wxF("fm-right-panel").click("bottom");
		cy.wxF("fm").trigger("keydown", { ctrlKey: true, code: "V" });
		cy.shot("panels-menus-cut-paste-hotkey");
	});

	it("hotkey renaming works in default fm with local data", () => {
		cy.visit("/index.html#/local-data");
		cy.viewport(1300, 900);

		cy.wxF("panel-cards").wxF("card-item", "/Code").click();
		cy.wxF("fm").trigger("keydown", { ctrlKey: true, code: "R" });
		cy.get(".wx-modal").should("be.visible");
		cy.get(".wx-modal").find("input").type("New name{enter}");

		cy.wxF("panel-cards")
			.wxF("card-item", "/New name")
			.should("be.visible");
		cy.wxF("tree-item", "/New name").should("be.visible");
		cy.shot("card-renamed-hotkey");

		cy.wxF("mode-table").click();
		cy.wxF("panel-table").wxF("grid-item", "/Music").click();
		cy.wxF("fm").trigger("keydown", { ctrlKey: true, code: "R" });
		cy.get(".wx-modal").should("be.visible");
		cy.get(".wx-modal").find("input").type("Miracle of sound{enter}");
		cy.wxF("panel-table")
			.wxF("grid-item", "/Miracle of sound")
			.should("be.visible");
		cy.wxF("tree-item", "/Miracle of sound").should("be.visible");
		cy.shot("grid-item-renamed-hotkey");

		cy.wxF("mode-panels").click();
		cy.wxF("fm-right-panel").wxF("grid-item", "/Info.txt").click();
		cy.wxF("fm").trigger("keydown", { ctrlKey: true, code: "R" });
		cy.get(".wx-modal").should("be.visible");
		cy.get(".wx-modal").find("input").type("Reamde.xx{enter}");
		cy.wxF("fm-right-panel")
			.wxF("grid-item", "/Reamde.xx")
			.should("be.visible");
		cy.wxF("fm-left-panel")
			.wxF("grid-item", "/Reamde.xx")
			.should("be.visible");
		cy.shot("panel-item-renamed-hotkey");
	});

	it("hotkey deleting works in default fm with local data", () => {
		cy.visit("/index.html#/local-data");
		cy.viewport(1300, 900);

		cy.wxF("panel-cards").wxF("card-item", "/Code").click();
		cy.wxF("fm").trigger("keydown", { code: "Delete" });
		cy.get(".wx-modal").should("be.visible");
		cy.get(".wx-modal").find("button").contains("OK").click();
		cy.wxF("panel-cards").children().should("have.length", 3);
		cy.wxF("tree").children().should("have.length", 3);
		cy.shot("card-deleted-hotkey");

		cy.wxF("mode-table").click();
		cy.wxF("panel-table").wxF("grid-item", "/Music").click();
		cy.wxF("fm").trigger("keydown", { code: "Delete" });
		cy.get(".wx-modal").should("be.visible");
		cy.get(".wx-modal").find("button").contains("Cancel").click();
		cy.wxF("panel-table")
			.find(".wx-scroll .wx-body .wx-data")
			.children()
			.should("have.length", 3);
		cy.wxF("tree").children().should("have.length", 3);
		cy.shot("item-not-deleted-hotkey");

		cy.wxF("mode-panels").click();
		cy.wxF("fm-right-panel").wxF("grid-item", "/Info.txt").click();
		cy.wxF("fm-right-panel")
			.wxF("grid-item", "/Music")
			.click({ ctrlKey: true });
		cy.wxF("fm").trigger("keydown", { code: "Delete" });
		cy.get(".wx-modal").should("be.visible");
		cy.get(".wx-modal").find("button").contains("OK").click();
		cy.wxF("fm-right-panel")
			.find(".wx-scroll .wx-body .wx-data")
			.children()
			.should("have.length", 1);
		cy.wxF("fm-left-panel")
			.find(".wx-scroll .wx-body .wx-data")
			.children()
			.should("have.length", 1);
		cy.shot("multiple-deleted-hotkey");
		cy.wxF("mode-cards").click();
		cy.wxF("tree").children().should("have.length", 2);
		cy.shot("multiple-deleted-tree-view");
	});

	it("hotkeys and click work for multiselection", () => {
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
		cy.wxF("fm").trigger("keydown", { code: "Delete" });
		cy.get(".wx-modal").should("be.visible");
		cy.get(".wx-modal").find("button").contains("Cancel").click();
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
		cy.wxF("fm").trigger("keydown", { code: "Delete" });
		cy.get(".wx-modal").should("be.visible");
		cy.get(".wx-modal").find("button").contains("Cancel").click();

		cy.wxF("mode-panels").click();
		cy.wxF("fm-left-panel").wxF("grid-item", "/Code").click();
		cy.wxF("fm-right-panel").wxF("grid-item", "/Music").click();
		cy.wxF("fm-left-panel")
			.wxF("grid-item", "/Music")
			.click({ ctrlKey: true });
		cy.wxF("fm-right-panel")
			.wxF("grid-item", "/Pictures")
			.click({ ctrlKey: true });
		cy.wxF("fm").trigger("keydown", { code: "Delete" });
		cy.get(".wx-modal").should("be.visible");
		cy.get(".wx-modal").find("button").contains("Cancel").click();
	});

	it("hotkeys work for new files and folders", () => {
		cy.visit(`/index.html#/local-data`);
		cy.viewport(1300, 900);

		cy.wxF("add-button").click();
		cy.wxF("menu-option", "add-file").click();
		cy.get(".wx-modal").should("be.visible");
		cy.get(".wx-modal").find("button").contains("OK").click();
		cy.wxF("panel-cards").wxF("card-item", "/New file.txt").click();

		cy.wxF("add-button").click();
		cy.wxF("menu-option", "add-folder").click();
		cy.get(".wx-modal").should("be.visible");
		cy.get(".wx-modal").find("button").contains("OK").click();
		cy.wxF("panel-cards").wxF("card-item", "/New folder").click();
	});

	it("hotkeys in readonly fm with local data", () => {
		cy.visit(`/index.html#/readonly`);
		cy.viewport(1300, 900);

		cy.wxF("panel-cards").wxF("card-item", "/Code").click();
		cy.wxF("fm").trigger("keydown", { code: "Delete" });
		cy.get(".wx-modal").should("not.exist");

		cy.wxF("panel-cards")
			.wxF("card-item", "/Pictures")
			.click({ ctrlKey: true });
		cy.wxF("fm").trigger("keydown", { code: "Delete" });
		cy.get(".wx-modal").should("not.exist");

		cy.wxF("panel-cards").click("bottom");

		cy.wxF("mode-table").click();

		cy.wxF("panel-table").wxF("grid-item", "/Code").click();
		cy.wxF("fm").trigger("keydown", { code: "Delete" });
		cy.get(".wx-modal").should("not.exist");

		cy.wxF("panel-table")
			.wxF("grid-item", "/Pictures")
			.click({ ctrlKey: true });
		cy.wxF("fm").trigger("keydown", { code: "Delete" });
		cy.get(".wx-modal").should("not.exist");

		cy.wxF("panel-table").click("bottom");

		cy.wxF("mode-panels").click();
		cy.wxF("fm-left-panel").wxF("grid-item", "/Pictures").click();
		cy.wxF("fm").trigger("keydown", { code: "Delete" });
		cy.get(".wx-modal").should("not.exist");

		cy.wxF("mode-cards").click();
		cy.wxF("panel-cards").wxF("card-item", "/Code").dblclick();

		cy.wxF("panel-cards").wxF("card-item", "/Code/Area.svelte").click();
		cy.wxF("fm").trigger("keydown", { force: true, code: "Delete" });
		cy.get(".wx-modal").should("not.exist");

		cy.wxF("mode-table").click();
		cy.wxF("panel-table").wxF("grid-item", "/Code/Combo.svelte").click();
		cy.wxF("fm").trigger("keydown", { force: true, code: "Delete" });
		cy.get(".wx-modal").should("not.exist");

		cy.wxF("mode-panels").click();
		cy.wxF("fm-left-panel")
			.wxF("grid-item", "/Code/Confirm.svelte")
			.click();
		cy.wxF("fm").trigger("keydown", { force: true, code: "Delete" });
		cy.get(".wx-modal").should("not.exist");
	});

	it("hotkeys for custom menu in default fm with local data", () => {
		cy.visit(`/index.html#/custom-menu`);
		cy.viewport(1300, 900);

		cy.wxF("panel-cards").wxF("card-item", "/Code").click();
		cy.wxF("fm").trigger("keydown", { force: true, code: "Delete" });
		cy.get(".wx-modal").should("not.exist");

		cy.wxF("panel-cards").wxF("card-item", "/Music").click();
		cy.wxF("fm").trigger("keydown", {
			ctrlKey: true,
			shiftKey: true,
			code: "V",
		});
		cy.wxF("panel-cards").children().should("have.length", 5);

		cy.wxF("panel-cards").wxF("card-item", "/Pictures").click();
		cy.wxF("fm").trigger("keydown", { ctrlKey: true, code: "R" });
		cy.get(".wx-modal").should("be.visible");
		cy.get(".wx-modal").find("input").type("Pics{enter}");
	});

	it("hotkeys for custom menu in readonly fm with local data", () => {
		cy.visit(`/index.html#/custom-menu-readonly`);
		cy.viewport(1300, 900);

		cy.wxF("panel-cards").wxF("card-item", "/Code").click();
		cy.wxF("fm").trigger("keydown", { code: "Delete" });
		cy.get(".wx-modal").should("not.exist");

		cy.wxF("panel-cards").wxF("card-item", "/Music").click();
		cy.wxF("fm").trigger("keydown", {
			ctrlKey: true,
			shiftKey: true,
			code: "V",
		});
		cy.wxF("panel-cards").children().should("have.length", 4);

		cy.wxF("panel-cards").wxF("card-item", "/Pictures").click();
		cy.wxF("fm").trigger("keydown", { ctrlKey: true, code: "R" });
		cy.get(".wx-modal").should("not.exist");

		cy.wxF("panel-cards").wxF("card-item", "/Code").dblclick();
		cy.wxF("panel-cards")
			.wxF("card-item", "/Code/Button.svelte")
			.click(0, 50); // [temp] workaround for svelte-menu fitToBody bug
		cy.wxF("fm").trigger("keydown", { force: true, code: "Delete" });
		cy.get(".wx-modal").should("not.exist");
	});

	it("hotkeys single selection in default fm with local data", () => {
		cy.visit(`/index.html#/local-data`);
		cy.viewport(1300, 900);

		cy.wxF("fm").trigger("keydown", { code: "ArrowRight" });
		cy.get(".wx-item.wx-selected").should("have.length", 1);
		cy.wxF("panel-cards")
			.wxF("card-item", "/Code")
			.should("have.class", "wx-selected");
		cy.wxF("fm").trigger("keydown", { code: "ArrowDown" });
		cy.get(".wx-item.wx-selected").should("have.length", 1);
		cy.wxF("panel-cards")
			.wxF("card-item", "/Music")
			.should("have.class", "wx-selected");
		cy.wxF("fm").trigger("keydown", { code: "ArrowRight" });
		cy.wxF("fm").trigger("keydown", { code: "ArrowDown" });
		cy.wxF("fm").trigger("keydown", { code: "ArrowLeft" });
		cy.get(".wx-item.wx-selected").should("have.length", 1);
		cy.wxF("panel-cards")
			.wxF("card-item", "/Pictures")
			.should("have.class", "wx-selected");
		cy.wxF("panel-cards").click("bottom");
		cy.wxF("fm").trigger("keydown", { code: "ArrowUp" });
		cy.wxF("fm").trigger("keydown", { code: "ArrowUp" });
		cy.get(".wx-item.wx-selected").should("have.length", 1);
		cy.wxF("panel-cards")
			.wxF("card-item", "/Code")
			.should("have.class", "wx-selected");
		cy.shot("cards-hotkeys-single-select");

		cy.wxF("panel-cards").click("bottom");
		cy.wxF("mode-table").click();
		cy.wxF("fm").trigger("keydown", { code: "ArrowUp" });
		cy.get(".wx-row.wx-selected").should("have.length", 1);
		cy.wxF("panel-table")
			.wxF("grid-item", "/Code")
			.should("have.class", "wx-selected");
		cy.wxF("fm").trigger("keydown", { code: "ArrowDown" });
		cy.wxF("fm").trigger("keydown", { code: "ArrowRight" });
		cy.get(".wx-row.wx-selected").should("have.length", 1);
		cy.wxF("panel-table")
			.wxF("grid-item", "/Pictures")
			.should("have.class", "wx-selected");
		cy.wxF("fm").trigger("keydown", { code: "ArrowLeft" });
		cy.get(".wx-row.wx-selected").should("have.length", 1);
		cy.wxF("panel-table")
			.wxF("grid-item", "/Music")
			.should("have.class", "wx-selected");
		cy.wxF("panel-table").click("bottom");
		cy.wxF("fm").trigger("keydown", { code: "ArrowDown" });
		cy.get(".wx-row.wx-selected").should("have.length", 1);
		cy.wxF("panel-table")
			.wxF("grid-item", "/Code")
			.should("have.class", "wx-selected");
		cy.shot("table-hotkeys-single-select");

		cy.wxF("panel-table").click("bottom");
		cy.wxF("mode-panels").click();
		cy.wxF("fm").trigger("keydown", { code: "ArrowUp" });
		cy.wxF("fm").trigger("keydown", { code: "ArrowRight" });
		cy.wxF("fm").trigger("keydown", { code: "ArrowDown" });
		cy.wxF("fm-left-panel")
			.find(".wx-row.wx-selected")
			.should("have.length", 1);
		cy.wxF("fm-left-panel")
			.wxF("grid-item", "/Pictures")
			.should("have.class", "wx-selected");
		cy.wxF("fm").trigger("keydown", { code: "ArrowLeft" });
		cy.wxF("fm").trigger("keydown", { code: "ArrowUp" });
		cy.wxF("fm-left-panel")
			.find(".wx-row.wx-selected")
			.should("have.length", 1);
		cy.wxF("fm-left-panel")
			.wxF("grid-item", "/Code")
			.should("have.class", "wx-selected");
		cy.wxF("fm-right-panel").click("bottom");
		cy.wxF("fm").trigger("keydown", { code: "ArrowDown" });
		cy.wxF("fm").trigger("keydown", { code: "ArrowDown" });
		cy.wxF("fm").trigger("keydown", { code: "ArrowLeft" });
		cy.wxF("fm-right-panel")
			.find(".wx-row.wx-selected")
			.should("have.length", 1);
		cy.wxF("fm-right-panel")
			.wxF("grid-item", "/Code")
			.should("have.class", "wx-selected");
		cy.shot("panels-hotkeys-single-select");
	});

	it("hotkeys multiselection in default fm with local data", () => {
		cy.visit(`/index.html#/local-data`);
		cy.viewport(1300, 900);

		cy.wxF("fm").trigger("keydown", { shiftKey: true, code: "ArrowUp" });
		cy.wxF("fm").trigger("keydown", { ctrlKey: true, code: "ArrowUp" });
		cy.get(".wx-item.wx-selected").should("have.length", 1);
		cy.wxF("panel-cards")
			.wxF("card-item", "/Code")
			.should("have.class", "wx-selected");
		cy.wxF("panel-cards").click("bottom");
		cy.wxF("fm").trigger("keydown", { ctrlKey: true, code: "ArrowRight" });
		cy.wxF("fm").trigger("keydown", { shiftKey: true, code: "ArrowRight" });
		cy.wxF("fm").trigger("keydown", { shiftKey: true, code: "ArrowRight" });
		cy.get(".wx-item.wx-selected").should("have.length", 3);
		cy.shot("cards-hotkeys-multi-select");

		cy.wxF("panel-cards").click("bottom");
		cy.wxF("mode-table").click();
		cy.wxF("panel-table").wxF("grid-item", "/Music").click();
		cy.wxF("fm").trigger("keydown", { ctrlKey: true, code: "ArrowUp" });
		cy.get(".wx-row.wx-selected").should("have.length", 2);
		cy.wxF("fm").trigger("keydown", { ctrlKey: true, code: "ArrowDown" });
		cy.wxF("fm").trigger("keydown", { shiftKey: true, code: "ArrowDown" });
		cy.get(".wx-row.wx-selected").should("have.length", 4);
		cy.shot("table-hotkeys-multi-select");

		cy.wxF("panel-table").click("bottom");
		cy.wxF("mode-panels").click();
		cy.wxF("fm").trigger("keydown", { shiftKey: true, code: "ArrowRight" });
		cy.wxF("fm").trigger("keydown", { ctrlKey: true, code: "ArrowRight" });
		cy.wxF("fm-left-panel")
			.find(".wx-row.wx-selected")
			.should("have.length", 2);
		cy.wxF("fm-right-panel").click("bottom");
		cy.wxF("fm").trigger("keydown", { shiftKey: true, code: "ArrowLeft" });
		cy.wxF("fm").trigger("keydown", { ctrlKey: true, code: "ArrowRight" });
		cy.wxF("fm").trigger("keydown", { ctrlKey: true, code: "ArrowRight" });
		cy.wxF("fm-left-panel")
			.find(".wx-row.wx-selected")
			.should("have.length", 2);
		cy.wxF("fm-right-panel")
			.find(".wx-row.wx-selected")
			.should("have.length", 3);
		cy.shot("panels-hotkeys-multi-select");
	});

	it("hotkeys selection with back to parrent link in default fm with local data", () => {
		cy.visit(`/index.html#/local-data`);
		cy.viewport(1300, 900);

		cy.wxF("fm").wxF("card-item", "/Pictures").dblclick();
		cy.wxF("fm").trigger("keydown", { code: "ArrowRight" });
		cy.wxF("panel-cards")
			.find(".wx-back")
			.should("have.class", "wx-selected");
		cy.get(".wx-item.wx-selected").should("have.length", 0);
		cy.wxF("panel-cards").click("bottom");
		cy.wxF("fm").trigger("keydown", { code: "ArrowLeft" });
		cy.wxF("panel-cards")
			.find(".wx-back")
			.should("have.class", "wx-selected");
		cy.get(".wx-item.wx-selected").should("have.length", 0);
		cy.wxF("fm").trigger("keydown", { shiftKey: true, code: "ArrowRight" });
		cy.wxF("panel-cards")
			.find(".wx-back")
			.should("not.have.class", "wx-selected");
		cy.get(".wx-item.wx-selected").should("have.length", 1);
		cy.wxF("fm").trigger("keydown", { ctrlKey: true, code: "ArrowLeft" });
		cy.wxF("fm").trigger("keydown", { shiftKey: true, code: "ArrowLeft" });
		cy.wxF("panel-cards")
			.find(".wx-back")
			.should("not.have.class", "wx-selected");
		cy.get(".wx-item.wx-selected").should("have.length", 1);
		cy.wxF("fm").trigger("keydown", { code: "ArrowLeft" });
		cy.wxF("panel-cards")
			.find(".wx-back")
			.should("have.class", "wx-selected");
		cy.get(".wx-item.wx-selected").should("have.length", 0);
		cy.shot("cards-hotkeys-parent-link-select");

		cy.wxF("panel-cards").click("bottom");
		cy.wxF("mode-table").click();
		cy.wxF("fm").trigger("keydown", { code: "ArrowDown" });
		cy.wxF("panel-table")
			.find(".wx-row.wx-selected")
			.should("have.length", 1);
		cy.wxF("panel-table")
			.wxF("grid-item", "/wx-filemanager-parent-link")
			.should("have.class", "wx-selected");
		cy.wxF("panel-table").click("bottom");
		cy.wxF("fm").trigger("keydown", { code: "ArrowUp" });
		cy.wxF("panel-table")
			.find(".wx-row.wx-selected")
			.should("have.length", 1);
		cy.wxF("panel-table")
			.wxF("grid-item", "/wx-filemanager-parent-link")
			.should("have.class", "wx-selected");
		cy.wxF("fm").trigger("keydown", { ctrlKey: true, code: "ArrowDown" });
		cy.wxF("panel-table")
			.find(".wx-row.wx-selected")
			.should("have.length", 1);
		cy.wxF("panel-table")
			.wxF("grid-item", "/wx-filemanager-parent-link")
			.should("not.have.class", "wx-selected");
		cy.wxF("fm").trigger("keydown", { ctrlKey: true, code: "ArrowUp" });
		cy.wxF("fm").trigger("keydown", { shiftKey: true, code: "ArrowUp" });
		cy.wxF("panel-table")
			.find(".wx-row.wx-selected")
			.should("have.length", 1);
		cy.wxF("panel-table")
			.wxF("grid-item", "/wx-filemanager-parent-link")
			.should("not.have.class", "wx-selected");
		cy.wxF("fm").trigger("keydown", { code: "ArrowUp" });
		cy.wxF("panel-table")
			.find(".wx-row.wx-selected")
			.should("have.length", 1);
		cy.wxF("panel-table")
			.wxF("grid-item", "/wx-filemanager-parent-link")
			.should("have.class", "wx-selected");
		cy.shot("table-hotkeys-parent-link-select");

		cy.wxF("panel-table").click("bottom");
		cy.wxF("mode-panels").click();
		cy.wxF("fm").trigger("keydown", { code: "ArrowDown" });
		cy.wxF("fm-left-panel")
			.find(".wx-row.wx-selected")
			.should("have.length", 1);
		cy.wxF("fm-left-panel")
			.wxF("grid-item", "/wx-filemanager-parent-link")
			.should("have.class", "wx-selected");
		cy.wxF("fm").trigger("keydown", { code: "ArrowDown" });
		cy.wxF("fm").trigger("keydown", { ctrlKey: true, code: "ArrowUp" });
		cy.wxF("fm").trigger("keydown", { shiftKey: true, code: "ArrowUp" });
		cy.wxF("fm-left-panel")
			.find(".wx-row.wx-selected")
			.should("have.length", 1);
		cy.wxF("fm-left-panel")
			.wxF("grid-item", "/wx-filemanager-parent-link")
			.should("not.have.class", "wx-selected");
		cy.wxF("fm").trigger("keydown", { code: "ArrowUp" });
		cy.wxF("fm-left-panel")
			.find(".wx-row.wx-selected")
			.should("have.length", 1);
		cy.wxF("fm-left-panel")
			.wxF("grid-item", "/wx-filemanager-parent-link")
			.should("have.class", "wx-selected");
		cy.wxF("fm-right-panel").wxF("grid-item", "/Code").dblclick();
		cy.wxF("fm").trigger("keydown", { code: "ArrowUp" });

		cy.wxF("fm-right-panel")
			.find(".wx-row.wx-selected")
			.should("have.length", 1);
		cy.wxF("fm-right-panel")
			.wxF("grid-item", "/wx-filemanager-parent-link")
			.should("have.class", "wx-selected");

		cy.wxF("fm").trigger("keydown", { ctrlKey: true, code: "ArrowDown" });
		cy.wxF("fm").trigger("keydown", { shiftKey: true, code: "ArrowDown" });
		cy.wxF("fm-right-panel")
			.find(".wx-row.wx-selected")
			.should("have.length", 2);
		cy.wxF("fm-right-panel")
			.wxF("grid-item", "/wx-filemanager-parent-link")
			.should("not.have.class", "wx-selected");
		cy.wxF("fm").trigger("keydown", { code: "ArrowUp" });
		cy.wxF("fm-right-panel")
			.find(".wx-row.wx-selected")
			.should("have.length", 1);
		cy.wxF("fm-right-panel")
			.wxF("grid-item", "/wx-filemanager-parent-link")
			.should("have.class", "wx-selected");
		cy.shot("panels-hotkeys-parent-link-select");
	});

	it("hotkeys selection works after sorts in default fm with local data", () => {
		cy.visit(`/index.html#/local-data`);
		cy.viewport(1300, 900);

		cy.wxF("mode-table").click();
		cy.wxF("fm").trigger("keydown", { code: "ArrowDown" });
		cy.wxF("table-header-cell", 0).click();
		cy.wxF("fm").trigger("keydown", { code: "ArrowUp" });
		cy.wxF("panel-table")
			.find(".wx-row.wx-selected")
			.should("have.length", 1);
		cy.wxF("panel-table")
			.wxF("grid-item", "/Music")
			.should("have.class", "wx-selected");
		cy.wxF("fm").trigger("keydown", { ctrlKey: true, code: "ArrowUp" });
		cy.wxF("table-header-cell", 0).click();
		cy.wxF("fm").trigger("keydown", { ctrlKey: true, code: "ArrowUp" });
		cy.wxF("panel-table")
			.find(".wx-row.wx-selected")
			.should("have.length", 3);
		cy.wxF("panel-table")
			.wxF("grid-item", "/Code")
			.should("have.class", "wx-selected");
		cy.shot("table-hotkeys-select-after-sorts");
	});

	it("hotkeys opening folder works in default fm with local data", () => {
		cy.visit(`/index.html#/local-data`);
		cy.viewport(1300, 900);

		cy.wxF("panel-cards").wxF("card-item", "/Pictures").click();
		cy.wxF("fm").trigger("keydown", { ctrlKey: true, code: "Enter" });
		cy.wxF("panel-cards").find(".wx-item").should("have.length", 4);

		cy.wxF("panel-cards").wxF("card-item", "/Pictures").click();
		cy.wxF("fm").trigger("keydown", { code: "Enter" });
		cy.wxF("panel-cards").find(".wx-item").should("have.length", 6);
		cy.shot("grid-folder-open-by-hotkey");
	});

	it("hotkeys back to parrent folder works in default fm with local data", () => {
		cy.visit(`/index.html#/local-data`);
		cy.viewport(1300, 900);

		cy.wxF("panel-cards").wxF("card-item", "/Code").dblclick();
		cy.wxF("panel-cards").find(".wx-back").click();
		cy.wxF("fm").trigger("keydown", { code: "Enter" });
		cy.wxF("panel-cards").find(".wx-item").should("have.length", 4);
		cy.wxF("panel-cards")
			.wxF("card-item", "/Code")
			.should("have.class", "wx-selected");
		cy.shot("cards-back-to-code-folder-hotkey");

		cy.wxF("mode-table").click();
		cy.wxF("panel-table").wxF("grid-item", "/Music").dblclick();
		cy.wxF("panel-table")
			.wxF("grid-item", "/wx-filemanager-parent-link")
			.click();
		cy.wxF("fm").trigger("keydown", { code: "Enter" });
		cy.wxF("panel-table").find(".wx-row").should("have.length", 4);
		cy.wxF("panel-table")
			.wxF("grid-item", "/Music")
			.should("have.class", "wx-selected");
		cy.shot("cards-back-to-music-folder-hotkey");

		cy.wxF("mode-panels").click();
		cy.wxF("fm-left-panel").wxF("grid-item", "/Pictures").dblclick();
		cy.wxF("fm-left-panel")
			.wxF("grid-item", "/wx-filemanager-parent-link")
			.click();
		cy.wxF("fm").trigger("keydown", { code: "Enter" });
		cy.wxF("fm-left-panel").find(".wx-row").should("have.length", 4);
		cy.wxF("fm-right-panel").wxF("grid-item", "/Pictures").dblclick();
		cy.wxF("fm-right-panel")
			.wxF("grid-item", "/wx-filemanager-parent-link")
			.click();
		cy.wxF("fm").trigger("keydown", { code: "Enter" });
		cy.wxF("fm-right-panel").find(".wx-row").should("have.length", 4);
		cy.shot("panels-back-to-pictures-folder-hotkey");
	});
});
