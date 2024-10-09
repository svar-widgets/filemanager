<script>
	import { getContext } from "svelte";
	import { delegateClick } from "wx-lib-dom";
	import { getSelectionOnNavigation } from "wx-filemanager-store";
	import Icon from "./ui/Icon.svelte";

	export let panel;

	const api = getContext("filemanager-store");
	const _ = getContext("wx-i18n").getGroup("filemanager");

	const { panels } = api.getReactiveState();
	$: ({ _files: files, _crumbs: crumbs } = $panels[panel]);

	function click(id) {
		const selectedId = getSelectionOnNavigation(id, crumbs);
		api.exec("set-path", {
			id,
			panel,
			...(selectedId && { selected: [selectedId] }),
		});
	}

	let loading;
	function refresh() {
		const id = crumbs[crumbs.length - 1].id;
		loading = true;

		api.exec("request-data", { id });
	}
	$: if (files) loading = null;

</script>

<div
	class="wx-breadcrumbs"
	use:delegateClick={{ click }}
	data-menu-ignore="true">
	<div class="wx-refresh-icon">
		<Icon name="refresh" spin={!!loading} click={refresh} />
	</div>
	{#each crumbs as crumb, i}
		{#if i}
			<Icon name="angle-right" />
		{/if}
		<div class="wx-item" data-id={crumb.id} data-menu-ignore="true">
			{crumb.id == '/' ? _(crumb.name) : crumb.name}
		</div>
	{/each}
</div>

<style>
	.wx-breadcrumbs {
		flex: 0 0 48px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 0 4px;
		max-width: 100%;
		border-radius: 6px 6px 0 0;
		background-color: var(--wx-background);
		font-size: 16px;
		overflow: hidden;
	}

	.wx-refresh-icon {
		margin-right: 4px;
	}

	.wx-item {
		cursor: pointer;
		font-size: 16px;
		font-weight: 300;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.wx-item:hover {
		color: var(--wx-color-primary);
	}

</style>
