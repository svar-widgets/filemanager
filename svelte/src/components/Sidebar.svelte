<script>
	import { getContext } from "svelte";

	import { Button } from "wx-svelte-core";
	import { DropDownMenu, registerMenuItem } from "wx-svelte-menu";

	import Tree from "./Tree/Tree.svelte";
	import Drive from "./Drive.svelte";
	import UploadButton from "./UploadButton.svelte";

	export let readonly;
	export let menuOptions;

	const _ = getContext("wx-i18n").getGroup("filemanager");
	const { showPrompt } = getContext("filemanager-modals");

	registerMenuItem("upload", UploadButton);

	function handleClick(ev) {
		const { action } = ev.detail;
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

	$: options = menuOptions("add").map(option => {
		option.text = _(option.text);
		return option;
	});

</script>

<div class="wx-wrapper">
	{#if !readonly}
		<div class="wx-button">
			<DropDownMenu {options} at="bottom-fit" on:click={handleClick}>
				<Button type="primary block">{_('Add New')}</Button>
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
