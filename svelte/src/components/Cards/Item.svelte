<script>
	import { getContext } from "svelte";

	let { item } = $props();

	const api = getContext("filemanager-store");
	const _ = getContext("wx-i18n").getGroup("filemanager");
	const templates = getContext("filemanager-store").templates;

	let { panels, activePanel, mode } = api.getReactiveState();

	const selection = $derived($panels[$activePanel].selected);

	let preview = $derived(templates.preview(item, 214, 163));
	let icon = $derived(templates.icon(item, "big"));
</script>

{#if item.id == "/wx-filemanager-parent-link"}
	{#if $mode !== "search"}
		<div class="wx-back-item">
			<div
				class="wx-back"
				data-id="/wx-filemanager-parent-link"
				class:wx-selected={item.navigation}
			>
				<i class="wxi-arrow-left"></i>
				<span> {_("Back to parent folder")}</span>
			</div>
		</div>
	{/if}
{:else}
	<div
		class="wx-item"
		class:wx-selected={selection?.length && selection.indexOf(item.id) >= 0}
		data-id={item.id}
	>
		{#if preview}
			<div class="wx-preview wx-file-preview">
				<img
					class="wx-card-preview"
					alt={_("A miniature file preview")}
					src={preview}
				/>
			</div>
		{:else if icon}
			<div class="wx-preview wx-file-icon">
				<img class="wx-card-preview" alt="" src={icon} />
			</div>
		{:else}
			<div class="wx-preview"><i class="wxi-{item.type}"></i></div>
		{/if}
		{#if item.type === "folder"}
			<div class="wx-info">
				<div class="wx-folder-name">
					<span class="wx-type">{_("Folder")}</span>
					<span class="wx-name">{item.name}</span>
				</div>
				<div data-action-id={item.id} class="wx-more">
					<i class="wxi-dots-v"></i>
				</div>
			</div>
		{:else}
			<div class="wx-info">
				<div class="wx-file-name">
					<span class="wx-name">{item.name}</span>
				</div>
				<div data-action-id={item.id} class="wx-more">
					<i class="wxi-dots-v"></i>
				</div>
			</div>
		{/if}
	</div>
{/if}

<style>
	.wx-item {
		display: flex;
		flex-direction: column;
		width: 210px;
		height: 200px;
		margin: 0 20px 20px 0;
		overflow: hidden;
		cursor: pointer;
		background-color: var(--wx-background);
		border-radius: 6px;
		box-shadow: var(--wx-fm-box-shadow);
	}

	.wx-preview {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-grow: 1;
	}

	.wx-preview i {
		font-size: 105px;
		color: var(--wx-color-primary);
	}

	.wx-preview i:before {
		line-height: 105px;
	}
	.wx-file-preview .wx-card-preview {
		height: 154px;
		width: 100%;
	}

	.wx-file-icon .wx-card-preview {
		height: 100px;
		width: 100px;
	}

	.wx-selected {
		outline: 1px solid var(--wx-color-primary);
	}
	.wx-info {
		display: flex;
		align-items: center;
		height: 46px;
		padding: 0 6px 3px 10px;
	}
	.wx-folder-name {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		max-width: 80%;
	}
	.wx-more {
		display: flex;
		padding: 4px;
		line-height: 1;
	}

	.wx-more i {
		font-size: 24px;
		width: 24px;
		height: 24px;
		color: var(--wx-icon-color);
	}

	.wx-more:hover {
		background-color: var(--wx-button-background);
		border-radius: 50%;
	}
	.wx-info .wx-type {
		color: var(--wx-color-font-alt);
		font-size: 12px;
		height: 18px;
	}
	.wx-file-name {
		display: flex;
		align-items: center;
		flex-grow: 1;
		max-width: 160px;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.wx-name {
		display: inline-block;
		font-size: 14px;
		font-weight: var(--wx-font-weight-md);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.wx-back-item {
		width: 100%;
		margin: 6px 0;
		font-size: 12px;
		line-height: 18px;
	}
	.wx-back {
		display: flex;
		width: fit-content;
		color: var(--wx-color-primary);
		user-select: none;
	}

	.wx-back i {
		display: flex;
		align-items: center;
		margin-right: 8px;
		font-size: 20px;
	}

	.wx-back i,
	.wx-back span {
		cursor: pointer;
	}
</style>
