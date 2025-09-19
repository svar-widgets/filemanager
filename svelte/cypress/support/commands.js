// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add("shot", (...args) => {
	// eslint-disable-next-line cypress/no-unnecessary-waiting
	cy.wait(100);

	const name = args.filter(a => typeof a !== "object").join("-");
	const conf =
		typeof args[args.length - 1] === "object" ? args[args.length - 1] : {};
	const sconf = { ...conf, overwrite: true };

	if (conf.area) cy.get(conf.area).screenshot(name, sconf);
	else cy.screenshot(name, sconf);
});

Cypress.Commands.add(
	"wxF",
	{
		prevSubject: "optional",
	},
	(subject, type, id) => {
		subject = subject ? cy.wrap(subject) : cy;
		switch (type) {
			case "toolbar":
				return subject.get(".wx-toolbar");
			case "search-input":
				return subject.get(".wx-toolbar .wx-search-input .wx-text");
			case "preview-button":
				return subject.get(".wx-toolbar .wx-preview-icon .wxi-eye");
			case "mode-table":
				return subject.get(
					".wx-toolbar .wx-modes .wxi-view-sequential"
				);
			case "mode-cards":
				return subject.get(".wx-toolbar .wx-modes .wxi-view-grid");
			case "mode-panels":
				return subject.get(".wx-toolbar .wx-modes .wxi-view-column");

			case "fm":
				return subject.get(".wx-content-wrapper");
			case "sidebar":
				return subject.get(".wx-sidebar");
			case "add-button":
				return subject.get(".wx-sidebar button");
			case "tree":
				return subject.get(".wx-sidebar .wx-tree ul");
			case "tree-item":
				return subject.get(`.wx-tree .wx-folder[data-id="${id}"]`);
			case "tree-toggle":
				return subject.get(
					`.wx-tree .wx-folder[data-id="${id}"] .wx-toggle`
				);

			case "panel-cards":
				return subject.get(".wx-cards");
			case "panel-table":
				return subject.get(".wx-list .wx-grid");
			case "panel-preview":
				return subject.get(".wx-info .wx-wrapper");
			case "panel-crumbs":
				return subject.get(".wx-breadcrumbs");
			case "panel-search":
				return subject.get(".wx-search");

			case "grid-item":
				return subject.find(`.wx-row[data-id="${id}"]`);
			case "card-item":
				return subject.find(`.wx-item[data-id="${id}"]`);

			case "crumb":
				return subject.find(`.wx-item[data-id="${id}"]`);

			case "fm-left-panel":
				return subject.get(".wx-panels .wx-item .wx-wrapper").first();
			case "fm-right-panel":
				return subject.get(".wx-panels .wx-item .wx-wrapper").eq(1);

			case "card-dots":
				return subject.get(
					`.wx-cards .wx-item[data-id="${id}"] .wx-info .wx-more`
				);
			case "table-header-cell":
				return subject.get(".wx-list .wx-header .wx-cell").eq(id);

			case "menu":
				return subject.get(".wx-menu");
			case "menu-option":
				return subject.get(`.wx-menu .wx-option[data-id="${id}"]`);

			default:
				throw `not supported arguments for wxF: ${type}, ${id}`;
		}
	}
);

// Hide caret in all tests so screenshots are stable
Cypress.on("window:before:load", win => {
	if (!win.document.getElementById("hide-caret-style")) {
		const style = win.document.createElement("style");
		style.id = "hide-caret-style";
		style.innerHTML = `*:focus { caret-color: transparent !important; }`;
		win.document.head.appendChild(style);
	}
});

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
