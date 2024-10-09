import { test, expect } from "vitest";
import { DataStore } from "../src/index";

function writable(value) {
	let subscriptions = [];
	const trigger = b =>
		subscriptions.forEach(a => {
			if (a) a(b);
		});

	return {
		subscribe: handler => {
			subscriptions.push(handler);
			trigger(value);

			return () =>
				(subscriptions = subscriptions.filter(a => a != handler));
		},
		set: nv => {
			value = nv;
			trigger(value);
		},
		update: cb => {
			value = cb(value);
			trigger(value);
		},
	};
}

const defaultConfig = {
	tree: [],
	mode: "cards",
	drive: null,
	preview: false,
	panels: [],
	activePanel: 0,
	search: "",
};

const drive = {
	used: 15200000000,
	total: 50000000000,
};

function getDataStore(config = defaultConfig) {
	const store = new DataStore(writable);
	store.init({
		...config,
	});
	return { store };
}

test("supports add action", () => {
	const { store } = getDataStore();

	const { panels, activePanel } = store.getState();
	const _files = panels[activePanel]._files;

	expect(_files.length).to.eq(0);
});
test("can add new files with correct id", () => {
	const { store } = getDataStore({
		...defaultConfig,
		tree: [{ id: "/Folder", name: "Folder", type: "folder" }],
	});

	store.in.exec("create-file", {
		parent: "/",
		file: {
			name: "file.txt",
		},
	});

	let { panels, activePanel } = store.getState();
	let _files = panels[activePanel]._files;
	expect(_files).to.have.lengthOf(2);
	expect(_files[1].id).to.eq("/file.txt");
	expect(_files[1].name).to.eq("file.txt");

	store.in.exec("create-file", {
		parent: "/",
		file: {
			name: "file.txt",
		},
	});
	({ panels, activePanel } = store.getState());
	_files = panels[activePanel]._files;
	expect(_files).to.have.lengthOf(3);
	expect(_files[1].id).to.eq("/file.new.txt");
	expect(_files[1].name).to.eq("file.new.txt");

	store.in.exec("set-path", { id: "/Folder" });
	store.in.exec("create-file", {
		parent: "/Folder",
		file: {
			name: "file.txt",
		},
	});
	({ panels, activePanel } = store.getState());
	_files = panels[activePanel]._files;
	expect(_files).to.have.lengthOf(1);
	expect(_files[0].id).to.eq("/Folder/file.txt");
	expect(_files[0].name).to.eq("file.txt");
	expect(_files[0].parent).to.eq("/Folder");
});
test("can rename file and provide correct ids for the file and ids and parents for childs", () => {
	const { store } = getDataStore({
		...defaultConfig,
		tree: [
			{ id: "/Folder", name: "Folder", type: "folder" },
			{ id: "/Folder/file.txt", name: "file.txt" },
			{ id: "/Folder/NewFolder", name: "NewFolder", type: "folder" },
			{ id: "/Folder/NewFolder/file.txt", name: "file.txt" },
		],
	});

	store.in.exec("set-path", { id: "/" });
	store.in.exec("rename-file", {
		id: "/Folder",
		name: "Collection",
	});

	let { panels, activePanel } = store.getState();
	let _files = panels[activePanel]._files;
	expect(_files[0].id).to.eq("/Collection");
	expect(_files[0].name).to.eq("Collection");

	store.in.exec("set-path", { id: "/Collection" });
	({ panels, activePanel } = store.getState());
	_files = panels[activePanel]._files;
	_files.forEach(file => {
		const id = `/Collection/${file.name}`;
		expect(file.id).to.eq(id);
		expect(file.parent).to.eq("/Collection");
		if (file.data) {
			const nexChild = file.data[0];
			expect(nexChild.id).to.eq("/Collection/NewFolder/file.txt");
			expect(nexChild.parent).to.eq("/Collection/NewFolder");
		}
	});
});
test("can copy files with correct ids to another directory", () => {
	const { store } = getDataStore({
		...defaultConfig,
		tree: [
			{ id: "/Folder", name: "Folder", type: "folder" },
			{ id: "/text.txt", name: "text.txt" },
			{ id: "/Folder/file.txt", name: "file.txt" },
		],
	});

	store.in.exec("set-path", { id: "/" });
	store.in.exec("copy-files", {
		ids: ["/text.txt"],
		target: "/Folder",
	});

	let { panels, activePanel } = store.getState();
	let _files = panels[activePanel]._files;
	expect(_files).to.have.lengthOf(2);

	store.in.exec("set-path", { id: "/Folder" });
	({ panels, activePanel } = store.getState());
	_files = panels[activePanel]._files;
	expect(_files).to.have.lengthOf(2);

	const [file, copiedFile] = _files;
	expect(file.id).to.eq("/Folder/file.txt");
	expect(copiedFile.id).to.eq("/Folder/text.txt");
	expect(copiedFile.parent).to.eq("/Folder");
});
test("can copy files with correct ids to the same directory", () => {
	const { store } = getDataStore({
		...defaultConfig,
		tree: [
			{ id: "/Folder", name: "Folder", type: "folder" },
			{ id: "/text.txt", name: "text.txt" },
			{ id: "/Folder/file.txt", name: "file.txt" },
		],
	});

	store.in.exec("set-path", { id: "/" });
	store.in.exec("copy-files", {
		ids: ["/Folder", "/text.txt"],
		target: "/",
	});

	let { panels, activePanel } = store.getState();
	let _files = panels[activePanel]._files;
	expect(_files).to.have.lengthOf(4);

	const newFolder = _files[1];
	expect(newFolder.id).to.eq("/Folder.new");
	expect(newFolder.name).to.eq("Folder.new");

	const newFile = _files[2];
	expect(newFile.id).to.eq("/text.new.txt");
	expect(newFile.name).to.eq("text.new.txt");

	store.in.exec("set-path", { id: "/Folder.new" });
	({ panels, activePanel } = store.getState());
	_files = panels[activePanel]._files;
	expect(_files).to.have.lengthOf(1);
	expect(_files[0].id).to.eq("/Folder.new/file.txt");
	expect(_files[0].parent).to.eq("/Folder.new");
});
test("can move files with correct ids", () => {
	const { store } = getDataStore({
		...defaultConfig,
		tree: [
			{ id: "/Folder", name: "Folder", type: "folder" },
			{ id: "/Folder/NewFolder", name: "NewFolder" },
			{ id: "/Folder/text.txt", name: "text.txt" },
			{ id: "/Folder/NewFolder/file.txt", name: "file.txt" },
		],
	});

	store.in.exec("set-path", { id: "/" });
	let { panels, activePanel } = store.getState();
	let _files = panels[activePanel]._files;
	expect(_files).to.have.lengthOf(1);

	store.in.exec("move-files", {
		ids: ["/Folder/NewFolder", "/Folder/text.txt"],
		target: "/",
	});

	({ panels, activePanel } = store.getState());
	_files = panels[activePanel]._files;
	expect(_files).to.have.lengthOf(3);

	const [, movedFolder, movedFile] = _files;
	expect(movedFolder.id).to.eq("/NewFolder");
	expect(movedFolder.parent).to.eq("/");
	expect(movedFile.id).to.eq("/text.txt");
	expect(movedFile.parent).to.eq("/");

	store.in.exec("set-path", { id: "/NewFolder" });
	({ panels, activePanel } = store.getState());
	_files = panels[activePanel]._files;
	expect(_files).to.have.lengthOf(1);
	expect(_files[0].id).to.eq("/NewFolder/file.txt");
	expect(_files[0].parent).to.eq("/NewFolder");
});
test("should not move files to the same directory", () => {
	const { store } = getDataStore({
		...defaultConfig,
		tree: [{ id: "/Folder", name: "Folder", type: "folder" }],
	});

	store.in.exec("set-path", { id: "/" });

	let { panels, activePanel } = store.getState();
	const startFiles = panels[activePanel]._files;

	store.in.exec("move-files", {
		ids: ["/Folder"],
		target: "/",
	});

	({ panels, activePanel } = store.getState());
	const currentFiles = panels[activePanel]._files;
	expect(startFiles).to.eq(currentFiles);
});
test("can filter files", () => {
	const { store } = getDataStore({
		...defaultConfig,
		tree: [
			{ id: "/Folder", name: "Folder", type: "folder" },
			{ id: "/text.txt", name: "text.txt" },
			{ id: "/Folder/file.txt", name: "file.txt" },
		],
	});

	let { search } = store.getState();
	expect(search).to.eq("");

	store.in.exec("filter-files", { text: "file" });

	let { panels, activePanel } = store.getState();
	let filteredFiles = panels[activePanel]._files;

	expect(filteredFiles).to.have.lengthOf(1);
	expect(filteredFiles[0].id).to.eq("/Folder/file.txt");

	store.in.exec("filter-files", { text: "" });

	({ panels, activePanel } = store.getState());
	filteredFiles = panels[activePanel]._files;

	expect(filteredFiles).to.have.lengthOf(2);
});
test("should update preview mode", () => {
	const { store } = getDataStore();

	store.in.exec("show-preview", { mode: true });

	const { preview } = store.getState();
	expect(preview).to.be.true;
});

test("should set mode and clear search", () => {
	const { store } = getDataStore({
		...defaultConfig,
		mode: "cards",
		search: "someSearchTerm",
	});

	store.in.exec("set-mode", { mode: "table" });

	const { mode, search } = store.getState();
	expect(mode).to.equal("table");
	expect(search).to.equal("");
});
test("should set drive", () => {
	const { store } = getDataStore({
		...defaultConfig,
		drive,
	});

	const { drive: storeDrive } = store.getState();
	expect(storeDrive).to.equal(drive);
});

test("should update path", () => {
	const { store } = getDataStore({
		...defaultConfig,
		tree: [
			{ id: "/Folder", name: "Folder", type: "folder" },
			{ id: "/Folder/file.txt", name: "file.txt" },
			{ id: "/AnotherFolder", name: "AnotherFolder", type: "folder" },
			{
				id: "/AnotherFolder/another-file.txt",
				name: "another-file.txt",
			},
		],
	});

	store.in.exec("set-path", { id: "/Folder" });

	const { panels, activePanel } = store.getState();
	const panel = panels[activePanel];

	expect(panel.path).to.equal("/Folder");
	expect(panel.selected).to.be.an("array").that.is.empty;
});

test("should update path and select files in certain panel", () => {
	const { store } = getDataStore({
		...defaultConfig,
		tree: [
			{ id: "/Folder", name: "Folder", type: "folder" },
			{ id: "/Folder/file.txt", name: "file.txt" },
			{ id: "/Folder/another-file.txt", name: "another-file.txt" },
		],
	});

	store.in.exec("set-path", {
		id: "/Folder",
		panel: 0,
		selected: ["/Folder/file.txt", "/Folder/another-file.txt"],
	});
	store.in.exec("set-path", {
		id: "/Folder",
		panel: 1,
	});

	const { panels } = store.getState();
	const leftPanel = panels[0];
	const rightPanel = panels[1];

	expect(leftPanel.path).to.equal("/Folder");
	expect(rightPanel.path).to.equal("/Folder");

	expect(leftPanel.selected[0]).to.eq("/Folder/file.txt");
	expect(leftPanel.selected[1]).to.eq("/Folder/another-file.txt");
	expect(rightPanel.selected).to.be.an("array").that.is.empty;
});

test("can sort files", () => {
	const { store } = getDataStore({
		...defaultConfig,
		tree: [
			{ id: "/AFolder", name: "AFolder", type: "folder" },
			{ id: "/Afile.txt", name: "Afile.txt", size: 3500 },
			{ id: "/BFolder", name: "BFolder", type: "folder", size: 2048 },
			{ id: "/Bfile.txt", name: "Bfile.txt", size: 1024 },
		],
	});

	let { panels, activePanel } = store.getState();
	let initialFiles = panels[activePanel]._files;

	expect(initialFiles[1].id).to.eq("/BFolder");

	store.in.exec("sort-files", { order: "desc", key: "name" });

	({ panels, activePanel } = store.getState());
	let sortedFiles = panels[activePanel]._files;

	expect(sortedFiles[0].id).to.eq("/BFolder");
	expect(sortedFiles[1].id).to.eq("/AFolder");
	expect(sortedFiles[2].id).to.eq("/Bfile.txt");

	store.in.exec("sort-files", { order: "asc", key: "size" });

	({ panels, activePanel } = store.getState());
	sortedFiles = panels[activePanel]._files;

	expect(sortedFiles[1].id).to.eq("/BFolder");
	expect(sortedFiles[2].id).to.eq("/Bfile.txt");
	expect(sortedFiles[3].id).to.eq("/Afile.txt");
});
