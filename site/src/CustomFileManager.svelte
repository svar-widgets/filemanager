<script>
	//import { FileManager } from "wx-svelte-filemanager";
	import { Filemanager } from "../../svelte/src/";
	import { RestDataProvider } from "wx-filemanager-data-provider";
	import { formatSize } from "wx-filemanager-store";

	import ThemeSelect from "./ThemeSelect.svelte";

	export let skin;

	function selectSkin(ev) {
		skin = ev.detail.selected.id;
	}

	const server = "https://master--svar-filemanager-go--dev.webix.io";
	//server previews
	function previewURL(file, width, height) {
		const ext = file.ext;
		if (ext === "png" || ext === "jpg" || ext === "jpeg")
			return (
				server +
				`/preview?width=${width}&height=${height}&id=${encodeURIComponent(
					file.id
				)}`
			);

		return false;
	}
	// server icons
	function iconsURL(file, size) {
		if (file.type !== "file")
			return server + `/icons/${size}/${file.type}.svg`;

		return server + `/icons/${size}/${file.ext}.svg`;
	}

	function getLink(id, download) {
		return (
			server +
			"/direct?id=" +
			encodeURIComponent(id) +
			(download ? "&download=true" : "")
		);
	}

	// request extra info when opening preview
	function requestInfo(file) {
		if (file.type == "folder" || file.ext == "jpg" || file.ext == "png") {
			return fetch(server + "/info/" + encodeURIComponent(file.id)).then(
				data => {
					if (data.ok) {
						return data.json().then(d => {
							if (file.type == "folder")
								d.Size = formatSize(d.Size);
							return d;
						});
					}
				}
			);
		}
	}

	function parseDates(data) {
		data.forEach(item => {
			if (item.date) item.date = new Date(item.date);
		});
		return data;
	}

	let fmApi;
	const restProvider = new RestDataProvider(server); // init provider

	// dynamic loading
	function loadData(ev) {
		const id = ev.detail.id;
		fetch(server + "/files/" + encodeURIComponent(id))
			.then(data => data.json())
			.then(data => {
				//emulate slow backend
				setTimeout(() => {
					fmApi.exec("provide-data", {
						id,
						data: parseDates(data),
					});
				}, 500);
			});
	}

	let rawData = [];
	let drive;
	// load initial data
	$: {
		Promise.all([
			fetch(server + "/files").then(data => data.json()),
			fetch(server + "/info").then(data => data.json()),
		]).then(([files, info]) => {
			rawData = parseDates(files);
			drive = info;
		});
	}

	function init(api) {
		api.on("download-file", ({ id }) => {
			window.open(getLink(id, true), "_self");
		});

		api.on("open-file", ({ id }) => {
			window.open(getLink(id), "_blank");
		});
		api.setNext(restProvider); //enable saving
		fmApi = api;
	}
</script>

<div class="demo" style="padding: 10px 20px;">
	<div class="toolbar">
		<div class="control">
			<span>Theme</span>
			<ThemeSelect bind:value={skin} on:select={selectSkin}></ThemeSelect>
		</div>
	</div>
	<div class="bottom">
		<Filemanager
			{init}
			data={rawData}
			{drive}
			icons={iconsURL}
			previews={previewURL}
			extraInfo={requestInfo}
			on:request-data={loadData}
		/>
	</div>
</div>

<style>
	.demo {
		--wx-checkbox-border-width: 1px;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	.bottom {
		flex: 1;
		height: 100%;
		overflow: hidden;
		position: relative;
		border: var(--wx-fm-grid-border);
	}

	.demo :global(.wx-cell) {
		word-break: normal;
		white-space: normal;
		border-right: none;
	}

	.demo :global(.wx-cell:not(:last-child)) {
		border-right: none;
	}

	.toolbar {
		height: 32px;
		margin-bottom: 8px;
		display: flex;
		justify-content: flex-end;
	}
	.control {
		width: 212px;
		display: flex;
		gap: 8px;
		align-items: center;
	}

	:global(.wx-material-theme .myMiddleClass) {
		background-color: rgba(232, 49, 37, 0.77);
	}
	:global(.wx-willow-theme .myMiddleClass),
	:global(.wx-willow-dark-theme .myMiddleClass) {
		background-color: rgba(255, 84, 84, 0.77);
	}
	:global(.wx-material-theme .myEndClass) {
		background-color: rgba(29, 180, 164, 0.77);
	}
	:global(.wx-willow-theme .myEndClass),
	:global(.wx-willow-dark-theme .myEndClass) {
		background-color: rgba(54, 206, 124, 0.77);
	}
</style>
