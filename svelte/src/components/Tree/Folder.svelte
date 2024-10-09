<script>
	import { getContext } from "svelte";

	const api = getContext("filemanager-store");
	const { panels, activePanel } = api.getReactiveState();

	$: path = $panels[$activePanel].path;

	export let folderIcon = false;
	export let folder = {};

	const _ = getContext("wx-i18n").getGroup("filemanager");

	let open, data, name, id, padding, hasFolders;
	$: {
		open = folder.open;
		data = folder.data;
		hasFolders = false;
		if (data?.find(i => i.type === "folder")) {
			hasFolders = true;
		}
		name = folder.id == "/" ? _(folder.name) : folder.name;
		id = folder.id;
		padding = folder.$level > 1 ? (folder.$level - 1) * 20 : 0;
	}
</script>

<li
	data-id={folder.id}
	class="wx-folder"
	class:wx-selected={path === id}
	style="padding-left: {padding}px"
>
	{#if hasFolders}
		<i
			class="wx-toggle wxi-{open ? 'angle-down' : 'angle-right'}"
			data-action="toggle"
		/>
	{:else}<span class="wx-toggle-placeholder" />{/if}
	<i class={folderIcon || "wxi-folder"} />
	<span class="wx-name"> {name} </span>
</li>

{#if open && data && data.length && hasFolders}
	{#each data as folder (folder.id)}
		{#if folder.type === "folder"}
			<svelte:self {folder} />
		{/if}
	{/each}
{/if}

<style>
	.wx-folder {
		display: flex;
		align-items: center;
		cursor: default;
		letter-spacing: 0.2px;
		width: 100%;
		height: 32px;
		vertical-align: top;
		white-space: nowrap;
		position: relative;
	}

	.wx-selected {
		background-color: var(--wx-fm-select-background);
	}
	i {
		font-size: 22px;
		margin-right: 8px;
		max-height: 100%;
		color: var(--wx-color-primary);
	}
	.wx-toggle {
		cursor: pointer;
		color: var(--wx-icon-color);
		font-size: 24px;
		margin-right: -2px;
	}
	.wx-toggle-placeholder {
		width: 23px;
		flex-shrink: 0;
	}
	.wx-name {
		padding-right: 8px;
	}
</style>
