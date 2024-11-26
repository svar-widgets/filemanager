<script>
	import Folder from "./Folder.svelte";
	import { getContext } from "svelte";

	const api = getContext("filemanager-store");
	const { panels, activePanel } = api.getReactiveState();

	let path = $derived($panels[$activePanel].path);

	let { folderIcon = false, folder = {} } = $props();

	const _ = getContext("wx-i18n").getGroup("filemanager");

	const hasFolders = $derived(!!folder.data?.find(i => i.type === "folder"));
	const name = $derived(folder.id == "/" ? _(folder.name) : folder.name);
	const padding = $derived(folder.$level > 1 ? (folder.$level - 1) * 20 : 0);
	const open = $derived(folder.open !== false);
</script>

<li
	data-id={folder.id}
	class="wx-folder"
	class:wx-selected={path === folder.id}
	style="padding-left: {padding}px"
>
	{#if hasFolders}
		<i
			class="wx-toggle wxi-{open ? 'angle-down' : 'angle-right'}"
			data-action="toggle"
		></i>
	{:else}<span class="wx-toggle-placeholder"></span>{/if}
	<i class={folderIcon || "wxi-folder"}></i>
	<span class="wx-name"> {name} </span>
</li>

{#if open && folder.data && folder.data.length && hasFolders}
	{#each folder.data as folder (folder.id)}
		{#if folder.type === "folder"}
			<Folder {folder} />
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
