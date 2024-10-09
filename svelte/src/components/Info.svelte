<script>
	import { getContext } from "svelte";
	import { dateToString } from "wx-lib-dom";
	import { formatSize } from "wx-filemanager-store";
	import Icon from "./ui/Icon.svelte";

	const { preview, icon } = getContext("filemanager-store").templates;

	const api = getContext("filemanager-store");

	export let narrowMode;
	export let extraInfo;

	let {
		panels,
		activePanel,
		preview: rPreview,
		search,
	} = api.getReactiveState();

	let items, found;
	$: {
		const panel = $panels[$activePanel];
		const selected = panel._selected;

		found = $search && !selected.length;
		items = found ? panel._files : selected;
	}

	const locale = getContext("wx-i18n");
	const _ = locale.getGroup("filemanager");
	const format = dateToString(
		"%D, %d %F %Y, %H:%i",
		locale.getRaw().calendar
	);

	let item,
		name,
		previewSrc,
		iconSrc,
		showDownloadIcon,
		type,
		totalCount,
		totalSize,
		info;
	$: {
		if (items.length === 1 && !found) {
			item = items[0];
			name = item.name;
			const prev = preview(item, 400, 500);
			if (prev) {
				previewSrc = prev;
				iconSrc = "";
			} else {
				iconSrc = icon(item, "big");
				previewSrc = "";
			}
			showDownloadIcon = item.type !== "folder";
			if (extraInfo) getExtraInfo(item);
		} else {
			item = showDownloadIcon = info = null;
			name = "";
			if (items.length) {
				let sum = 0;
				let folders = 0;
				let files = 0;
				let extArr = [];
				let incorrectSize;
				items.forEach(item => {
					if (typeof item.size === "undefined") {
						incorrectSize = true;
						sum = undefined;
					}

					if (!incorrectSize) {
						sum += item.size;
					}

					extArr.push(getItemType(item));
					item.type === "folder" ? folders++ : files++;
				});

				const singleExt = new Set(extArr);
				type = singleExt.size > 1 ? _("multiple") : [...singleExt][0];
				totalCount = getTotalCount(folders, files);
				totalSize = sum;
				if (!found) name = _("Multiple files");
			}
			iconSrc = icon(
				{
					type: found ? "search" : items.length ? "multiple" : "none",
				},
				"big"
			);
			previewSrc = "";
		}
	}

	function downloadFile() {
		api.exec("download-file", {
			id: item.id,
		});
	}

	function getTotalCount(folders, files) {
		return (
			(folders
				? `${folders} ${_(folders > 1 ? "folders" : "folder")} `
				: "") +
			(files ? `${files} ${_(files > 1 ? "files" : "file")}` : "")
		);
	}

	function closePreview() {
		api.exec("show-preview", { mode: !$rPreview });
	}

	async function getExtraInfo(item) {
		try {
			const response = await extraInfo(item);
			info = response;
		} catch (e) {
			info = null;
		}
	}

	function getItemType(item) {
		return item.type === "folder"
			? _("Folder")
			: item.ext || _("Unknown file");
	}
</script>

<div class="wx-wrapper">
	{#if items.length}
		<div class="wx-preview">
			<div class="wx-toolbar">
				<div class="wx-name">{name}</div>
				<div class="wx-icons">
					{#if showDownloadIcon}
						<Icon name="download" click={downloadFile} />
					{/if}
					{#if narrowMode}
						<Icon name="close" click={closePreview} />
					{/if}
				</div>
			</div>
			{#if previewSrc}
				<div class="wx-img-wrapper">
					<img src={previewSrc} alt={_("A miniature file preview")} />
				</div>
			{:else if iconSrc}
				<div class="wx-icon-wrapper">
					<img src={iconSrc} alt={_("A miniature file preview")} />
				</div>
			{:else}
				<div class="wx-icon-wrapper">
					{#if item}
						<i class="wx-icon wxi-{item.type}" />
					{:else}
						<i
							class="wx-icon wxi-{found
								? 'search'
								: 'file-multiple-outline'}"
						/>
					{/if}
				</div>
			{/if}
		</div>
		<div class="wx-info-panel">
			<div class="wx-title">{found ? _("Found") : _("Information")}</div>
			<div class="wx-list">
				{#if item}
					<span class="wx-name">{_("Type")}</span>
					<span class="wx-value">{getItemType(item)}</span>
					{#if typeof item.size !== "undefined"}
						<span class="wx-name">{_("Size")}</span>
						<span class="wx-value">{formatSize(item.size)}</span>
					{/if}
					<span class="wx-name">{_("Date")}</span>
					<span class="wx-value">{format(item.date)} </span>
				{:else}
					<span class="wx-name">{_("Count")}</span>
					<span class="wx-value">{totalCount}</span>
					<span class="wx-name">{_("Type")}</span>
					<span class="wx-value">{type}</span>
					{#if typeof totalSize !== "undefined"}
						<span class="wx-name">{_("Size")}</span>
						<span class="wx-value">{formatSize(totalSize)}</span>
					{/if}
				{/if}
				{#if info}
					{#each Object.entries(info) as [name, value]}
						<span class="wx-name">{name}</span>
						<span class="wx-value">{value}</span>
					{/each}
				{/if}
			</div>
		</div>
	{:else}
		<div class="wx-no-info-panel">
			<div class="wx-toolbar">
				<div class="wx-name">{name}</div>
				<div class="wx-icons">
					{#if narrowMode}
						<Icon name="close" click={closePreview} />
					{/if}
				</div>
			</div>
			<div class="wx-no-info-wrapper">
				<div class="wx-no-info">
					{#if previewSrc}
						<div class="wx-img-wrapper">
							<img
								src={previewSrc}
								alt={_("A miniature file preview")}
							/>
						</div>
					{:else if iconSrc}
						<div class="wx-icon-wrapper">
							<img
								src={iconSrc}
								alt={_("A miniature file preview")}
							/>
						</div>
					{:else}
						<div class="wx-icon-wrapper">
							<i
								class="wx-icon wxi-{found
									? 'search'
									: 'message-question-outline'}"
							/>
						</div>
					{/if}
					<span class="wx-text"
						>{found
							? ""
							: _("Select file or folder to view details")}</span
					>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.wx-wrapper {
		height: 100%;
		width: 100%;
		cursor: default;
		padding: 0 10px 10px;
	}
	.wx-toolbar {
		flex: 0 0 48px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 12px;
		width: 100%;
		background-color: var(--wx-background);
		border-radius: 6px 6px 0 0;
		height: 48px;
	}
	.wx-toolbar .wx-name {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-weight: var(--wx-font-weight-md);
		font-size: 16px;
	}
	.wx-toolbar .wx-icons {
		display: flex;
	}
	.wx-preview {
		display: flex;
		flex-direction: column;
		box-shadow: var(--wx-fm-box-shadow);
		height: 60%;
		margin-bottom: 10px;
		border-radius: 6px;
	}
	.wx-preview .wx-img-wrapper,
	.wx-preview .wx-icon-wrapper {
		border-top: none;
		flex-grow: 1;
		border-radius: 0 0 6px 6px;
	}
	.wx-preview .wx-icon-wrapper {
		padding: 20px;
	}
	.wx-preview .wx-img-wrapper {
		height: calc(100% - 48px);
	}

	.wx-preview .wx-img-wrapper img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.wx-img-wrapper,
	.wx-icon-wrapper {
		background-color: var(--wx-background);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.wx-icon {
		color: var(--wx-color-primary);
	}
	.wx-preview .wx-icon {
		font-size: 105px;
	}
	.wx-img-wrapper img {
		max-width: 100%;
	}
	.wx-info-panel {
		flex-grow: 1;
		height: calc(40% - 10px);
		border-radius: 6px;
		background-color: var(--wx-background);
		box-shadow: var(--wx-fm-box-shadow);
	}
	.wx-title {
		display: flex;
		border-bottom: var(--wx-fm-grid-border);
		font-weight: var(--wx-font-weight-md);
		align-items: center;
		justify-content: flex-start;
		padding: 15px;
		font-size: 16px;
	}
	.wx-list {
		padding: 14px;
		max-height: calc(100% - 51px);
		display: grid;
		grid-template-columns: minmax(40px, max-content) 1fr;
		grid-auto-rows: auto;
		column-gap: 25px;
		overflow-y: auto;
	}
	.wx-list span {
		padding: 6px;
	}
	.wx-list .wx-name {
		font-size: 14px;
		font-weight: var(--wx-font-weight-md);
		grid-column: 1 / 2;
		min-width: 60px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.wx-list .wx-value {
		grid-column: 2 / 3;
		padding: 6px;
	}
	.wx-no-info-panel {
		height: 100%;
		width: 100%;
		background-color: var(--wx-background);
		border-radius: 6px;
		box-shadow: var(--wx-fm-box-shadow);
	}
	.wx-no-info-wrapper {
		height: calc(100% - var(--wx-fm-toolbar-height));
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.wx-no-info {
		padding: 5px;
		text-align: center;
	}
	.wx-no-info .wx-icon-wrapper {
		min-height: 120px;
	}
	.wx-no-info .wx-icon {
		font-size: 120px;
	}
	.wx-no-info .wx-text {
		font-size: var(--wx-font-size);
		line-height: var(--wx-line-height);
		font-weight: var(--wx-font-weight-md);
		text-align: center;
	}
</style>
