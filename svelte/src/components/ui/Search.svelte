<script>
	import { createEventDispatcher, getContext } from "svelte";

	export let value = "";

	const dispatch = createEventDispatcher();
	const _ = getContext("wx-i18n").getGroup("filemanager");

	let node;

	$: icon = value !== "" ? "wxi-close" : "wxi-search";
	$: dispatch("search", { value });

	function clear() {
		value = "";
		node.focus();
		dispatch("search", { value });
	}

</script>

<div class="wx-search-input">
	<i class="wx-icon {icon}" on:click={clear} />
	<input
		type="text"
		class="wx-text"
		bind:this={node}
		bind:value
		placeholder={_('Search')} />
</div>

<style>
	.wx-search-input {
		position: relative;
		width: 100%;
		height: 30px;
	}

	.wx-icon {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		top: 4px;
		bottom: 4px;
		right: 1px;
		width: 25px;
		color: #94a1b3;
		font-size: 20px;
		cursor: pointer;
	}

	.wx-text {
		display: block;
		width: 100%;
		height: 30px;
		padding-left: 12px;
		border: var(--wx-border);
		outline: none;
		background-color: var(--wx-background);
		border-radius: 2px;
	}

	.wx-text::placeholder {
		color: #94a1b3;
	}

	.wx-text:focus {
		border: 1px solid var(--wx-color-primary);
	}

</style>
