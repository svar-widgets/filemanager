<script>
	import { getContext } from "svelte";
	import { formatSize } from "wx-filemanager-store";
	import { delegateClick, dateToString } from "wx-lib-dom";
	import { Grid } from "wx-svelte-grid";

	import Breadcrumbs from "../Breadcrumbs.svelte";
	import NameCell from "./NameCell.svelte";
	import UploadDropArea from "../UploadDropArea.svelte";

	let { panel, active = false, onclick, oncontextmenu } = $props();

	const api = getContext("filemanager-store");

	const locale = getContext("wx-i18n");
	const _ = locale.getGroup("filemanager");
	const format = dateToString("%d %M %Y", locale.getRaw().calendar);

	let { panels } = api.getReactiveState();

	const selection = $derived($panels[panel].selected);
	const path = $derived($panels[panel].path);
	const crumbs = $derived($panels[panel]._crumbs);
	const sorts = $derived($panels[panel]._sorts);
	const selectNavigation = $derived($panels[panel]._selectNavigation);
	const files = $derived($panels[panel]._files);

	const defaultColumns = [
		{
			id: "name",
			header: _("Name"),
			flexgrow: 3,
			sort: true,
			resize: true,
			cell: NameCell,
		},
		{
			id: "size",
			header: _("Size"),
			width: 100,
			sort: true,
			resize: true,
			template: v => (typeof v === "number" ? formatSize(v) : ""),
		},
		{
			id: "date",
			header: _("Date"),
			width: 120,
			sort: true,
			resize: true,
			template: v => (v ? format(v) : ""),
		},
	];

	const columns = $derived.by(() => {
		const { key, order } = sorts[path] || {};
		// to mark sorted column with relevant icon
		return defaultColumns.map(col => {
			col.$sort = order && col.id === key ? { order } : null;
			return col;
		});
	});

	let sortClick = null;
	let resizeClick = null;

	const tableSelection = $derived(
		selectNavigation ? ["/wx-filemanager-parent-link"] : [...selection]
	);

	function click(id, e) {
		//[FIXME] grip is wx-table classname which may change
		if (e && e.target.className.indexOf("wx-grip") !== -1) return;

		const ctrl = e && (e.ctrlKey || e.metaKey);
		const shift = e && e.shiftKey;

		if (id === "/wx-filemanager-parent-link") {
			if (selection.length && (ctrl || shift)) return;
			api.exec("select-file", {
				type: "navigation",
			});
			return;
		}

		const isFile = id !== "body";
		let newSelection = !isFile && e ? null : id;

		if (!sortClick && !resizeClick) {
			api.exec("select-file", {
				id: newSelection,
				toggle: ctrl,
				range: shift,
				panel: panel,
			});
		} else sortClick = resizeClick = null;
	}

	function backToParent() {
		if (crumbs.length > 1) {
			api.exec("set-path", {
				id: crumbs[crumbs.length - 2].id,
				panel: panel,
				selected: [crumbs[crumbs.length - 1].id],
			});
		}
	}

	function dblclick(id) {
		if (id === "/wx-filemanager-parent-link") {
			return backToParent();
		}
		const item = files.find(a => a.id === id);

		if (item) {
			if (item.type == "folder") {
				api.exec("set-path", {
					id: item.id,
					panel: panel,
				});
			} else {
				api.exec("open-file", {
					id: item.id,
				});
			}
		}
	}

	function handleSort(e) {
		const col = e.key;
		const prevSort = sorts[path];
		let order = !prevSort ? "desc" : "asc";

		if (prevSort && prevSort.key === col) {
			order = prevSort.order === "asc" ? "desc" : "asc";
		}

		api.exec("sort-files", {
			key: col,
			order,
			panel,
			path,
		});
	}

	function initTable(api) {
		api.intercept("sort-rows", e => {
			sortClick = true;
			handleSort(e);
			return false;
		});

		api.intercept("select-row", () => false);

		api.on("resize-column", () => (resizeClick = true));

		api.intercept("hotkey", () => false);
	}

	let renderedFiles = $derived(
		path !== "/"
			? [
					{
						id: "/wx-filemanager-parent-link",
						name: _("Back to parent folder"),
					},
					...files,
				]
			: files
	);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div {onclick} {oncontextmenu} class="wx-wrapper">
	<Breadcrumbs {panel} />
	<div
		data-id="body"
		class="wx-list"
		class:wx-active={active}
		use:delegateClick={{ click, dblclick }}
	>
		<UploadDropArea>
			<Grid
				init={initTable}
				data={renderedFiles}
				{columns}
				selectedRows={tableSelection}
				columnStyle={() => "wx-each-cell"}
				sizes={{ rowHeight: 42, headerHeight: 42 }}
			/>
		</UploadDropArea>
	</div>
</div>

<style>
	.wx-wrapper {
		display: flex;
		flex-direction: column;
		height: 100%;
		max-height: 100%;
		max-width: 100%;
		box-shadow: var(--wx-fm-box-shadow);
		border-radius: 6px;
	}

	.wx-list {
		height: calc(100% - 50px);
	}
	.wx-list > :global(.wx-upload-area .wx-grid) {
		--wx-table-cell-border: var(--wx-fm-grid-border);
		--wx-table-header-border: var(--wx-fm-grid-border);
		--wx-table-header-cell-border: var(--wx-fm-grid-border);
	}
	.wx-list > :global(.wx-upload-area .wx-body .wx-each-cell) {
		border-right: none;
	}
	.wx-list
		> :global(.wx-upload-area .wx-header .wx-cell:first-child .wx-text) {
		padding: 0 6px;
	}
	.wx-list > :global(.wx-upload-area .wx-table) {
		border-radius: 0 0 6px 6px;
	}

	.wx-list.wx-active > :global(.wx-upload-area .wx-grid),
	.wx-list > :global(.wx-upload-area.wx-active .wx-grid) {
		--wx-table-cell-border: 1px solid var(--wx-color-primary);
	}
	.wx-list.wx-active > :global(.wx-upload-area .wx-row) {
		--wx-table-cell-border: var(--wx-fm-grid-border);
	}

	.wx-list > :global(.wx-upload-area.wx-active .wx-row) {
		background: var(--wx-color-primary-selected);
		--wx-table-cell-border: 1px solid var(--wx-color-primary-selected);
	}
	/*switch off focus due to filamanager own navigation system*/
	.wx-list > :global(.wx-upload-area .wx-grid .wx-cell[tabindex="0"]) {
		outline: none;
	}

	/* temp hack to align toolbar and table body (with 1.75px full match) */
	.wx-list > :global(.wx-upload-area) {
		border-right: 1px solid transparent;
	}

	/* magic, do not touch. there is no obvious need for this, but cypress tests in electron break without it */
	.wx-list > :global(.wx-upload-area .wx-grid .wx-scroll) {
		overflow-x: hidden;
	}
</style>
