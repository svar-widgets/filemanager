<script>
	import { getContext } from "svelte";
	import Panel from "./Cards/Panel.svelte";
	import Icon from "./ui/Icon.svelte";

	const _ = getContext("wx-i18n").getGroup("filemanager");
	const api = getContext("filemanager-store");

	let { panels, activePanel } = api.getReactiveState();
	let crumbs = $derived($panels[$activePanel]._crumbs);

	function clearSearch() {
		api.exec("filter-files", {
			text: "",
		});
	}
</script>

<div class="wx-search">
	<div class="wx-toolbar">
		<div class="wx-back-icon">
			<Icon name="angle-left" click={clearSearch} />
		</div>
		<div class="wx-text">
			{_("Search results in")}
			{#each crumbs as crumb, i}
				{#if i}/{/if}
				{crumb.id == "/" ? _(crumb.name) : crumb.name}
			{/each}
		</div>
	</div>
	<Panel />
</div>

<style>
	.wx-search {
		display: flex;
		flex-direction: column;
		height: 100%;
		max-height: 100%;
		max-width: 100%;
		flex-shrink: 1;
		padding: 10px;
		padding-top: 0;
	}
	.wx-toolbar {
		flex: 0 0 48px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 0 12px;
		max-width: 100%;
		background-color: var(--wx-background);
		border: 1px solid var(--wx-border);
	}

	.wx-text {
		font-size: 16px;
	}

	.wx-back-icon {
		margin-right: 4px;
	}
</style>
