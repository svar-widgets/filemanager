<script>
	import { Filemanager, getMenuOptions } from "../../src";
	import { getData } from "../data";
	import { Willow, Locale } from "@svar-ui/svelte-core";

	const data = getData();

	let fmApi;
	function init(api) {
		fmApi = api;

		fmApi.on("download-file", ({ id }) => {
			alert(`No server data - no download. File ID: ${id}`);
		});
	}
	function menuOptions(mode, item) {
		switch (mode) {
			case "file":
			case "folder":
				if (item.id === "/Code") return false;
				if (item.id === "/Pictures")
					return getMenuOptions().filter(o => o.id === "rename");
				return [
					...getMenuOptions(mode),
					{
						comp: "separator",
					},
					{
						icon: "wxi-cat",
						text: "Clone",
						id: "clone",
						hotkey: "Ctrl+Shift+V",
						handler: ({ context }) => {
							const { panels, activePanel } = fmApi.getState();
							fmApi.exec("copy-files", {
								ids: [context.id],
								target: panels[activePanel].path,
							});
						},
					},
				];

			default:
				return getMenuOptions(mode);
		}
	}
</script>

<Willow>
	<Locale>
		<Filemanager {data} {init} {menuOptions} readonly />
	</Locale>
</Willow>
