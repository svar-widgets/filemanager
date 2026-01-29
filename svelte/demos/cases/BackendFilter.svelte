<script>
	import { Filemanager } from "../../src";

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
	//server icons
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

	function parseDates(data) {
		data.forEach(item => {
			if (item.date) item.date = new Date(item.date * 1000);
		});
		return data;
	}

	let fmApi;
	let rawData = $state([]);
	let drive = $state({});

	Promise.all([
		fetch(server + "/files").then(data => data.json()),
		fetch(server + "/info").then(data => data.json()),
	]).then(([files, info]) => {
		rawData = parseDates(files);
		drive = info;
	});

	//dynamic loading
	function loadData(ev) {
		const id = ev.id;
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

	function init(api) {
		fmApi = api;

		api.on("download-file", ({ id }) => {
			window.open(getLink(id, true), "_self");
		});

		api.on("open-file", ({ id }) => {
			window.open(getLink(id), "_blank");
		});
		// send request to server to filter the data
		api.intercept("filter-files", ({ text }) => {
			const { panels, activePanel } = fmApi.getState();
			const id = panels[activePanel].path;
			fetch(
				server +
					"/files" +
					(id == "/" ? "" : `/${encodeURIComponent(id)}`) +
					`?text=${text || ""}`
			)
				.then(data => data.json())
				.then(data => {
					fmApi.exec("set-mode", { mode: text ? "search" : "cards" });
					fmApi.exec("provide-data", {
						id,
						data: parseDates(data),
					});
				});
			return false;
		});
	}
</script>

<Filemanager
	{init}
	data={rawData}
	{drive}
	icons={iconsURL}
	previews={previewURL}
	onrequestdata={loadData}
/>
