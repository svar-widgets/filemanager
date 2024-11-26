<script>
	import { getContext } from "svelte";

	let { value = "", onsearch } = $props();

	const _ = getContext("wx-i18n").getGroup("filemanager");

	let node = null;
	let icon = $derived(value !== "" ? "wxi-close" : "wxi-search");

	function oninput(e) {
		value = e.target.value;
		onsearch && onsearch({ value });
	}

	function clear() {
		value = "";
		node.focus();
		onsearch && onsearch({ value });
	}
</script>

<div class="wx-search-input">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<i class="wx-icon {icon}" onclick={clear}></i>
	<input
		type="text"
		class="wx-text"
		bind:this={node}
		{value}
		{oninput}
		placeholder={_("Search")}
	/>
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
