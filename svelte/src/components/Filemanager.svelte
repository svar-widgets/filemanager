<script>
	import { createEventDispatcher, setContext } from "svelte";

	import Layout from "./Layout.svelte";

	import { Locale } from "wx-svelte-core";
	import { en } from "wx-filemanager-locales";

	// stores
	import { EventBusRouter } from "wx-lib-state";
	import { DataStore, getMenuOptions } from "wx-filemanager-store";
	import Modals from "./Modals.svelte";
	import { whitelist } from "../icons";

	// incoming parameters
	export let data = [];
	export let mode = "cards";
	export let drive = null;
	export let preview = false;
	export let panels = [];
	export let activePanel = 0;
	export let readonly = false;

	export let menuOptions = getMenuOptions;
	export let extraInfo = null;

	export let init = null;

	export let icons = function (file, size) {
		const { type, ext } = file;

		if (type === "folder") return false;

		let icon;

		if (type && type !== "file" && whitelist[type]) {
			icon = type;
		} else if (ext) {
			icon = whitelist[ext] ? ext : "file";
		} else icon = "unknown";

		return `https://cdn.svar.dev/icons/filemanager/vivid/${size}/${icon}.svg`;
	};
	export let previews = null;

	const dispatch = createEventDispatcher();

	// init stores
	const dataStore = new DataStore();
	$: {
		dataStore.init({
			tree: data,
			mode,
			drive,
			preview,
			panels,
			activePanel,
		});
		if (init) {
			init(api);
			init = null;
		}
	}

	// define event route
	let lastInRoute = new EventBusRouter(dispatch);
	let firstInRoute = dataStore.in;

	firstInRoute.setNext(lastInRoute);

	// public API
	export const api = {
		// state
		getState: dataStore.getState.bind(dataStore),
		getReactiveState: dataStore.getReactive.bind(dataStore),
		getStores: () => ({ data: dataStore }),

		// events
		exec: firstInRoute.exec,
		setNext: ev => (lastInRoute = lastInRoute.setNext(ev)),
		intercept: firstInRoute.intercept.bind(firstInRoute),
		on: firstInRoute.on.bind(firstInRoute),
		detach: firstInRoute.detach.bind(firstInRoute),

		//specific
		getFile: id => dataStore.getFile(id),
		serialize: id => dataStore.serialize(id),
	};

	const none = () => null;
	// common API available in components
	setContext("filemanager-store", {
		getReactiveState: dataStore.getReactive.bind(dataStore),
		exec: firstInRoute.exec.bind(firstInRoute),
		templates: {
			preview: previews || none,
			icon: icons == "simple" ? none : icons,
		},
		getFile: dataStore.getFile.bind(dataStore),
	});

</script>

<Locale words={en} optional={true}>
	<Modals>
		<Layout {readonly} {menuOptions} {extraInfo} />
	</Modals>
</Locale>
