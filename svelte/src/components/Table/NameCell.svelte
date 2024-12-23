<script>
	import { Cell } from "wx-svelte-grid";
	import { getContext } from "svelte";

	let { row, col, columnStyle, cellStyle } = $props();

	const _ = getContext("wx-i18n").getGroup("filemanager");
	const templates = getContext("filemanager-store").templates;

	const icon = templates.icon(row, "small");
</script>

<Cell {row} {col} {columnStyle} {cellStyle}>
	<div class="wx-name-cell">
		{#if row.id === "/wx-filemanager-parent-link"}
			<i class="wxi-arrow-left"></i>
			<span class="wx-name"> {_("Back to parent folder")}</span>
		{:else}
			{#if icon}
				<img
					class="wx-icon"
					alt=""
					src={icon}
					height="24px"
					width="24px"
				/>
			{:else}<i class="wxi-{row.type}"></i>{/if}
			<span class="wx-name"> {row.name} </span>
		{/if}
	</div>
</Cell>

<style>
	.wx-name-cell {
		padding: 0 4px;
		display: flex;
		align-items: center;
		height: 100%;
		overflow: hidden;
		flex-shrink: 0;
		text-overflow: clip;
	}
	i,
	.wx-icon {
		margin-right: 10px;
		display: flex;
		align-items: center;
	}

	i {
		font-size: 24px;
		color: var(--wx-color-primary);
	}
	.wx-name {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
