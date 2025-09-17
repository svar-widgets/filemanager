<script>
	import { RestDataProvider } from "@svar-ui/filemanager-data-provider";
	import { formatSize } from "@svar-ui/filemanager-store";
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

	// request extra info when opening preview
	function requestInfo(file) {
		if (file.type == "folder" || file.ext == "jpg" || file.ext == "png") {
			return restProvider.loadInfo(file.id).then(data => {
				if (file.type == "folder") data.Size = formatSize(data.Size);
				return data;
			});
		}
	}

	const restProvider = new RestDataProvider(server); // init provider
	let fmApi;

	let data = $state([]);
	let drive = $state({});

	function init(api) {
		fmApi = api;
		api.setNext(restProvider); //enable saving

		fmApi.on("download-file", ({ id }) => {
			window.open(getLink(id, true), "_self");
		});

		fmApi.on("open-file", ({ id }) => {
			window.open(getLink(id), "_blank");
		});
	}

	// rename file on client if server provides unexpected id
	restProvider.on("file-renamed", ({ id, newId }) => {
		const name = newId.slice(newId.lastIndexOf("/") + 1);
		fmApi.exec("rename-file", { id, name, skipProvider: true });
	});

	//load initial data with provider
	Promise.all([restProvider.loadFiles(), restProvider.loadInfo()]).then(
		([files, info]) => {
			data = files;
			drive = info;
		}
	);
	// dynamic loading
	function loadData(ev) {
		const id = ev.id;
		restProvider.loadFiles(id).then(files => {
			fmApi.exec("provide-data", {
				id,
				data: files,
			});
		});
	}
</script>

<Filemanager
	{init}
	{data}
	{drive}
	icons={iconsURL}
	previews={previewURL}
	extraInfo={requestInfo}
	onrequestdata={loadData}
/>
