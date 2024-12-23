<script>
	import { getContext } from "svelte";

	import { delegateClick } from "wx-lib-dom";
	import Folder from "./Folder.svelte";
	import { getSelectionOnNavigation } from "wx-filemanager-store";

	const api = getContext("filemanager-store");
	const { tree: data, panels, activePanel } = api.getReactiveState();

	const crumbs = $derived($panels[$activePanel]._crumbs);

	function toggle(id) {
		api.exec("open-tree-folder", {
			id,
			mode: !$data.byId(id).open,
		});
	}

	function click(id) {
		const selectedId = getSelectionOnNavigation(id, crumbs);
		api.exec("set-path", {
			id,
			panel: $activePanel,
			...(selectedId && { selected: [selectedId] }),
		});
	}
	/* [FIXME] key block below forces tree rendering 
	   as it does not repaint when state.tree is mutated */
</script>

{#key $data}
	<ul use:delegateClick={{ click, toggle }}>
		{#each $data.byId(0).data as folder (folder.id)}
			{#if folder.type === "folder"}
				<Folder {folder} />
			{/if}
		{/each}
	</ul>
{/key}

<style>
	ul {
		padding: 0;
		margin: 0;
		height: 100%;
		min-width: 100%;
		width: fit-content;
	}
</style>
