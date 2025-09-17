<script>
	import { getContext } from "svelte";
	import { delegateClick } from "@svar-ui/lib-dom";
	import Item from "./Item.svelte";

	const api = getContext("filemanager-store");
	const _ = getContext("wx-i18n").getGroup("filemanager");

	let { panels, activePanel, mode } = api.getReactiveState();

	const files = $derived($panels[$activePanel]._files);
	const selected = $derived($panels[$activePanel].selected);
	const path = $derived($panels[$activePanel].path);
	const crumbs = $derived($panels[$activePanel]._crumbs);
	const selectNavigation = $derived($panels[$activePanel]._selectNavigation);

	function click(id, e) {
		const ctrl = e && (e.ctrlKey || e.metaKey);
		const shift = e && e.shiftKey;

		if (id === "/wx-filemanager-parent-link") {
			if (selected.length && (ctrl || shift)) return;
			api.exec("select-file", {
				type: "navigation",
			});
			return;
		}

		const isFile = id !== "body";
		let newSelection = !isFile && e ? null : id;

		const actionClick =
			e.target.className.indexOf("wx-more") !== -1 ||
			e.target.className.indexOf("wxi-dots-v") !== -1;

		api.exec("select-file", {
			id: newSelection,
			toggle: ctrl && !actionClick,
			range: shift && !actionClick,
			panel: $activePanel,
		});
	}
	function backToParent() {
		if (crumbs.length > 1) {
			api.exec("set-path", {
				id: crumbs[crumbs.length - 2].id,
				panel: $activePanel,
				selected: [crumbs[crumbs.length - 1].id],
			});
		}
	}
	function dblclick(id) {
		if (id === "/wx-filemanager-parent-link") {
			return backToParent();
		}

		if ($mode === "search") {
			api.exec("filter-files", {
				text: "",
			});
		}

		const item = files.find(a => a.id === id);

		if (item) {
			if (item.type == "folder") {
				api.exec("set-path", {
					id: item.id,
					panel: $activePanel,
				});
			} else {
				api.exec("open-file", {
					id: item.id,
				});
			}
		}
	}

	function applySelection(id, ev) {
		if (
			!selected?.length ||
			!selected.filter(i => i?.id === id).length > 0
		) {
			click(id, ev);
		}
	}

	let renderedFiles = $derived(
		path !== "/"
			? [
					{
						id: "/wx-filemanager-parent-link",
						name: _("Back to parent folder"),
						navigation: selectNavigation,
					},
					...files,
				]
			: files
	);
</script>

{#if $mode == "search" && !renderedFiles.length}
	<div class="wx-not-found">
		<div class="wx-not-found-text">{_("Looks like nothing is here")}</div>
	</div>
{:else}
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		tabindex="0"
		class="wx-cards"
		class:wx-has-back-link={path !== "/" && $mode !== "search"}
		data-id={"body"}
		use:delegateClick={{ click, dblclick, context: applySelection }}
	>
		{#each renderedFiles as child}
			<Item item={child} />
		{/each}
	</div>
{/if}

<style>
	.wx-cards {
		flex-grow: 1;
		flex-wrap: wrap;
		height: 100%;
		border-top: none;
		padding: 30px 20px 10px;
		display: flex;
		align-items: flex-start;
		overflow-y: auto;
		align-content: flex-start;
		outline: none;
	}
	.wx-cards.wx-has-back-link {
		padding: 0 20px 10px;
	}
	.wx-not-found-text {
		text-align: center;
		color: var(--wx-color-font-alt);
	}
	.wx-not-found {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 5px;
		height: 100%;
	}
</style>
