<script>
	import { setContext } from "svelte";

	import Layout from "./Layout.svelte";

	import { Locale } from "wx-svelte-core";
	import { en } from "wx-filemanager-locales";

	// stores
	import { EventBusRouter } from "wx-lib-state";
	import { DataStore, getMenuOptions } from "wx-filemanager-store";
	import Modals from "./Modals.svelte";
	import { whitelist } from "../icons";

	let {
		data = [],
		mode = "cards",
		drive = null,
		preview = false,
		panels = [],
		activePanel = 0,
		readonly = false,
		menuOptions = getMenuOptions,
		extraInfo = null,
		init = null,
		icons = function (file, size) {
			const { type, ext } = file;

			if (type === "folder") return false;

			let icon;

			if (type && type !== "file" && whitelist[type]) {
				icon = type;
			} else if (ext) {
				icon = whitelist[ext] ? ext : "file";
			} else icon = "unknown";

			return `https://cdn.svar.dev/icons/filemanager/vivid/${size}/${icon}.svg`;
		},
		previews = null,
		...restProps
	} = $props();

	// init stores
	const dataStore = new DataStore();

	// define event route
	let firstInRoute = dataStore.in;

	const dash = /-/g;
	let lastInRoute = new EventBusRouter((a, b) => {
		const name = "on" + a.replace(dash, "");
		if (restProps[name]) {
			restProps[name](b);
		}
	});
	firstInRoute.setNext(lastInRoute);

	// public API
	export const // state
		getState = dataStore.getState.bind(dataStore),
		getReactiveState = dataStore.getReactive.bind(dataStore),
		getStores = () => ({ data: dataStore }),
		// events
		exec = firstInRoute.exec,
		setNext = ev => (lastInRoute = lastInRoute.setNext(ev)),
		intercept = firstInRoute.intercept.bind(firstInRoute),
		on = firstInRoute.on.bind(firstInRoute),
		detach = firstInRoute.detach.bind(firstInRoute),
		//specific
		getFile = id => dataStore.getFile(id),
		serialize = id => dataStore.serialize(id);

	const api = {
		getState,
		getReactiveState,
		getStores,
		exec,
		setNext,
		intercept,
		on,
		detach,
		getFile,
		serialize,
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

	let init_once = true;
	const reinitStore = () => {
		dataStore.init({
			tree: data,
			mode,
			drive,
			preview,
			panels,
			activePanel,
		});

		if (init_once && init) {
			init(api);
			init_once = false;
		}
	};
	reinitStore();
	$effect(reinitStore);
</script>

<Locale words={en} optional={true}>
	<Modals>
		<Layout {readonly} {menuOptions} {extraInfo} />
	</Modals>
</Locale>
