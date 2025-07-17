const cases = [
	"/base/:skin",
	"/selection/:skin",
	"/context/:skin",
	"/readonly/:skin",
	"/custom-styles/:skin",
	"/simple-icons/:skin",
	"/locales/:skin",
	"/api/:skin",
	"/extra-info/:skin",
	//"/serverdata/:skin",
	//"/data-provider/:skin",
	//"/serverfilter/:skin",
];

const skins = ["material", "willow", "willow-dark"];
const links = [];

cases.forEach(w => {
	skins.forEach(s => {
		links.push(w.replace(":skin", s));
	});
});

context("Basic functionality", () => {
	it("widget", () => {
		links.forEach(w => {
			cy.visit(`/index.html#${w}`);
			cy.shot(w, { area: ".content" });
		});
	});
});
