<script>
	import { getContext } from "svelte";

	import { Button } from "wx-svelte-core";
	import { DropDownMenu, registerMenuItem } from "wx-svelte-menu";

	import Tree from "./Tree/Tree.svelte";
	import Drive from "./Drive.svelte";
	import UploadButton from "./UploadButton.svelte";

	let { readonly, menuOptions } = $props();

	const _ = getContext("wx-i18n").getGroup("filemanager");
	const { showPrompt } = getContext("filemanager-modals");

	registerMenuItem("upload", UploadButton);

	function handleClick({ action }) {
		if (action) {
			if (action.id === "add-file")
				showPrompt({
					item: {
						type: "file",
						size: 0,
						date: new Date(),
					},
					add: true,
				});
			else if (action.id === "add-folder")
				showPrompt({
					item: {
						type: "folder",
						date: new Date(),
					},
					add: true,
				});
		}
	}

	let options = $derived(
		menuOptions("add").map(option => {
			option.text = _(option.text);
			return option;
		})
	);
</script>

<div class="wx-wrapper">
	{#if !readonly}
		<div class="wx-button">
			<DropDownMenu {options} at="bottom-fit" onclick={handleClick}>
				<Button type="primary block">{_("Add New")}</Button>
			</DropDownMenu>
		</div>
	{/if}
	<div class="wx-tree">
		<Tree />
	</div>
	<Drive />
</div>

<style>
	.wx-wrapper {
		display: flex;
		flex-direction: column;
		height: 100%;
		background-color: var(--wx-background);
		border-radius: 6px;
		box-shadow: var(--wx-fm-box-shadow);
	}

	.wx-button {
		padding: 8px 8px 0;
	}

	.wx-tree {
		padding-top: 8px;
		flex-grow: 1;
		overflow-x: auto;
	}
</style>
