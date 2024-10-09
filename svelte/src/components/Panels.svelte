<script>
	import TableView from "./Table/View.svelte";
	import { getContext } from "svelte";

	const api = getContext("filemanager-store");
	const activePanel = api.getReactiveState().activePanel;

	function toggleActive(panel) {
		api.exec("set-active-panel", { panel });
	}

</script>

<div class="wx-panels" data-id="body">
	<div class="wx-item" data-panel={0}>
		<TableView
			panel={0}
			active={$activePanel == 0}
			on:click={() => toggleActive(0)}
			on:contextmenu={() => toggleActive(0)} />
	</div>
	<div class="wx-item" data-panel={1}>
		<TableView
			panel={1}
			active={$activePanel == 1}
			on:click={() => toggleActive(1)}
			on:contextmenu={() => toggleActive(1)} />
	</div>
</div>

<style>
	.wx-panels {
		display: flex;
		width: 100%;
		max-width: 100%;
		height: 100%;
	}
	.wx-item {
		flex-grow: 1;
		flex-shrink: 0;
		width: calc(50% - 10px);
	}
	.wx-item:first-child {
		margin-right: 10px;
	}

</style>
