<script>
	import { getContext, setContext } from "svelte";
	import { Globals, Modal, Text } from "wx-svelte-core";

	let { children } = $props();

	const _ = getContext("wx-i18n").getGroup("filemanager");
	const api = getContext("filemanager-store");

	const { panels: rPanels, activePanel: rActivePanel } =
		api.getReactiveState();

	const path = $derived($rPanels[$rActivePanel].path);
	let prompt = $state(null);
	let confirm = $state(null);
	let value = $state("");
	let initialName = $state("");
	let error = $state(false);

	function promptOk() {
		const name = value.trim();
		if (!name) {
			error = true;
			return;
		}

		if (prompt.add) {
			api.exec("create-file", {
				file: {
					...prompt.item,
					name,
				},
				parent: path,
			});
		} else {
			if (initialName !== name)
				api.exec("rename-file", { id: prompt.item.id, name });
		}

		closePrompt();
	}

	function closePrompt() {
		prompt = error = null;
		initialName = value = "";
	}

	function confirmOk() {
		api.exec("delete-files", { ids: confirm.selected });
		confirm = null;
	}

	setContext("filemanager-modals", {
		showPrompt(config) {
			initialName = value =
				config.item.name ||
				(config.item.type === "folder"
					? _("New folder")
					: `${_("New file")}.txt`);
			prompt = { ...config };
		},
		showConfirm(config) {
			confirm = { ...config };
		},
	});
</script>

<Globals>
	{@render children?.()}
</Globals>

{#if prompt}
	<Modal
		title={_(`Enter ${prompt.item.type} name`)}
		ok={promptOk}
		cancel={closePrompt}
	>
		<!-- [todo] add selection mask to exclude extensions as a Text feature -->
		<Text {error} select={true} focus={true} bind:value />
	</Modal>
{/if}

{#if confirm}
	<Modal
		title={_("Are you sure you want to delete these items:")}
		ok={confirmOk}
		cancel={() => (confirm = null)}
	>
		{#if confirm.selected}
			<ul class="wx-list">
				{#each confirm.selected as item}
					<li>{item}</li>
				{/each}
			</ul>
		{/if}
	</Modal>
{/if}

<style>
	.wx-list {
		text-align: left;
		padding-left: 20px;
		max-height: 300px;
		overflow: auto;
	}

	.wx-list li {
		font-weight: var(--wx-font-weight-md);
	}
</style>
