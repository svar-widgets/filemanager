<script>
	import { clickOutside, locateID } from "wx-lib-dom";
	import { ActionMenu, ContextMenu } from "wx-svelte-menu";
	import { Uploader } from "wx-svelte-uploader";
	import { hotkeys } from "wx-filemanager-store";

	import { getContext, tick } from "svelte";

	import SearchView from "./SearchView.svelte";
	import Info from "./Info.svelte";
	import Panels from "./Panels.svelte";
	import Sidebar from "./Sidebar.svelte";
	import Toolbar from "./Toolbar.svelte";
	import TableView from "./Table/View.svelte";
	import CardsView from "./Cards/View.svelte";

	let { readonly = false, menuOptions, extraInfo } = $props();

	let sidebarWidth = $state();

	let narrowMode = $state();
	let showSidebar = $state(false);

	function resize(node) {
		const ro = new ResizeObserver(entries => {
			narrowMode = entries[0].borderBoxSize[0].inlineSize < 768;
		});
		ro.observe(node);
	}

	function toggleSidebar() {
		showSidebar = !showSidebar;
	}

	function hideSidebar(ev) {
		if (narrowMode && locateID(ev) !== "toggle-tree") {
			showSidebar = false;
		}
	}

	const api = getContext("filemanager-store");
	const { showPrompt, showConfirm } = getContext("filemanager-modals");
	const _ = getContext("wx-i18n").getGroup("filemanager");

	const {
		mode: rMode,
		preview: rPreview,
		activePanel: rActivePanel,
		panels: rPanels,
	} = api.getReactiveState();

	const selected = $derived($rPanels[$rActivePanel].selected);
	const path = $derived($rPanels[$rActivePanel].path);
	let contextMenuOptions = $state([]);

	const previewOption = {
		icon: "wxi-eye",
		text: "Preview",
		id: "preview",
	};

	function getReadonlyMenu(type) {
		let options = narrowMode ? [previewOption] : [];
		if (type === "file")
			options = [
				...options,
				...menuOptions().filter(o => o.id === "download"),
			];
		return options;
	}

	function resolveContext(id, e) {
		const item = id ? api.getFile(id) : null;
		const inTree = e.target.closest(".tree-item.folder");

		let options;

		if (readonly && item) {
			options = getReadonlyMenu(item?.type);
		} else {
			switch (id) {
				case "body":
					options = menuOptions(id);
					break;
				default:
					if (item) {
						if (!inTree && selected.length > 1) {
							options = narrowMode
								? [previewOption, ...menuOptions("multiselect")]
								: menuOptions("multiselect");
						} else if (id === "/") {
							options = menuOptions("folder", item).filter(
								o => o.id === "paste"
							);
						} else {
							const mOptions = menuOptions(item.type, item);
							if (mOptions) {
								options = narrowMode
									? [previewOption, ...mOptions]
									: mOptions;
							}
						}
					}
			}
			if ($rMode === "search") {
				options = options?.filter(o => o.id !== "paste");
			}
		}

		if (
			item?.id &&
			(!selected.length || !selected.some(i => i === item.id)) &&
			!inTree
		) {
			api.exec("select-file", { id: item.id });
		}

		if (options?.length) {
			options.forEach(o => {
				if (inTree) o.hotkey = "";
				if (o.text) o.text = _(o.text);
				if (o.hotkey) o.subtext = o.hotkey;
			});
			contextMenuOptions = options;
			return item || {};
		}
	}

	let copy = null;
	function handleMenu(e) {
		const { action, context } = e;
		if (action) {
			performAction(action.id, context, !action.hotkey);
		}
	}

	function performAction(action, context, inTree) {
		const ids = inTree ? [context.id] : selected;
		switch (action) {
			case "download":
				api.exec("download-file", { id: context.id });
				break;
			case "copy":
			case "move":
				copy = {
					action,
					ids: ids,
				};
				break;
			case "paste":
				if (copy) {
					api.exec(
						copy.action === "copy" ? "copy-files" : "move-files",
						{
							ids: copy.ids,
							target:
								context?.type === "folder" ? context.id : path,
						}
					);
					copy = null;
				}
				break;
			case "rename":
				showPrompt({ item: context });
				break;
			case "delete":
				showConfirm({ selected: ids });
				break;
			case "preview":
				api.exec("show-preview", { mode: !$rPreview });
				break;
		}
	}

	function getPanel() {
		return $rPanels[$rActivePanel];
	}

	async function handleUpload(f) {
		//if active panel was changed before upload, wait until for it
		await tick();
		const { name, size } = f.file;

		api.exec("create-file", {
			file: {
				name,
				size,
				date: new Date(),
				file: f.file,
			},
			parent: path,
		});
	}
</script>

<div
	class="wx-filemanager wx-flex"
	use:resize
	use:hotkeys={{
		api,
		menuOptions: readonly ? getReadonlyMenu : menuOptions,
		performAction,
		getPanel,
	}}
>
	{#if narrowMode && $rPreview}
		<div class="wx-info-narrow">
			<Info {narrowMode} {extraInfo} />
		</div>
	{:else}
		<Toolbar {narrowMode} onshowtree={toggleSidebar} />
		<ContextMenu
			dataKey={"id"}
			at={"point"}
			options={contextMenuOptions}
			resolver={resolveContext}
			onclick={handleMenu}
		>
			<ActionMenu
				dataKey="actionId"
				options={contextMenuOptions}
				resolver={resolveContext}
				onclick={handleMenu}
			>
				<Uploader apiOnly={true} uploadURL={handleUpload}>
					<div class="wx-content-wrapper wx-flex">
						{#if $rMode !== "panels" && $rMode !== "search"}
							<div
								use:clickOutside={hideSidebar}
								class="wx-sidebar"
								class:wx-sidebar-narrow={narrowMode}
								class:wx-sidebar-visible={showSidebar}
								bind:clientWidth={sidebarWidth}
							>
								<Sidebar {readonly} {menuOptions} />
							</div>
							<div
								class="wx-content"
								style="width: calc(100% - {sidebarWidth}px - 10px)"
							>
								<div
									class="wx-content-item{$rPreview
										? ''
										: '-fit'}"
									data-id="body"
								>
									{#if $rMode === "table"}
										<TableView panel={$rActivePanel} />
									{:else}
										<CardsView />
									{/if}
								</div>
								{#if $rPreview}
									<div class="wx-info">
										<Info {extraInfo} />
									</div>
								{/if}
							</div>
						{:else}
							<div
								class="wx-content-item{$rPreview ? '' : '-fit'}"
							>
								{#if $rMode === "panels"}
									<Panels />
								{:else}
									<SearchView />
								{/if}
							</div>
							{#if $rPreview}
								<div class="wx-info">
									<Info {extraInfo} />
								</div>
							{/if}
						{/if}
					</div>
				</Uploader>
			</ActionMenu>
		</ContextMenu>
	{/if}
</div>

<style>
	.wx-flex {
		display: flex;
		width: 100%;
	}
	.wx-filemanager {
		max-width: 100vw;
		max-height: 100vh;
		overflow: hidden;
		background-color: var(--wx-fm-background);
		flex-direction: column;
		height: 100%;
	}
	.wx-content {
		flex-grow: 1;
		display: flex;
		flex-shrink: 0;
	}
	.wx-content-item-fit {
		width: 100%;
		padding: 0 10px 10px;
	}
	.wx-content-item {
		width: 67%;
		padding: 0 10px 10px;
	}
	.wx-content-wrapper {
		margin-top: 10px;
		max-width: 100%;
		max-height: 100%;
		position: relative;
	}
	.wx-info {
		width: 38%;
	}
	.wx-sidebar {
		flex: 0 0 auto;
		width: 238px;
		padding: 0 10px 10px;
		height: 100%;
	}
	.wx-sidebar-narrow {
		position: absolute !important;
		z-index: 3;
		left: -300px;
		transition-duration: 0.6s;
	}
	.wx-sidebar-visible {
		left: 0;
	}
	.wx-info-narrow {
		width: 100%;
		height: 100%;
		padding-top: 10px;
	}
	.wx-filemanager > :global(div[data-menu-ignore="true"]) {
		height: calc(100% - var(--wx-fm-toolbar-height));
		width: 100%;
	}

	.wx-filemanager
		> :global(div[data-menu-ignore="true"])
		> :global(div[data-menu-ignore="true"]) {
		height: 100%;
		width: 100%;
		display: flex;
	}
</style>
