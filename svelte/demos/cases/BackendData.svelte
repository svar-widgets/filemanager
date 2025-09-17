<script>
	import { Filemanager } from "../../src";
	import { formatSize } from "@svar-ui/filemanager-store";

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
	// dynamic loading
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

	let rawData = $state([]);
	let drive = $state({});

	Promise.all([
		fetch(server + "/files").then(data => data.json()),
		fetch(server + "/info").then(data => data.json()),
	]).then(([files, info]) => {
		rawData = parseDates(files);
		drive = info;
	});

	function init(api) {
		api.on("download-file", ({ id }) => {
			window.open(getLink(id, true), "_self");
		});

		api.on("open-file", ({ id }) => {
			window.open(getLink(id), "_blank");
		});

		fmApi = api;
	}
</script>

<Filemanager
	{init}
	data={rawData}
	{drive}
	icons={iconsURL}
	previews={previewURL}
	extraInfo={requestInfo}
	onrequestdata={loadData}
/>
