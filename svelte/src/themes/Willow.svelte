<script>
	import { Willow } from "@svar-ui/svelte-core";
	let { fonts = true, children } = $props();
</script>

{#if children}
	<Willow {fonts}>{@render children()}</Willow>
{:else}
	<Willow {fonts} />
{/if}

<style>
	:global(.wx-willow-theme) {
		--wx-theme-name: willow;

		--wx-fm-background: #f2f3f7;
		--wx-fm-box-shadow: 0px 1px 2px rgba(44, 47, 60, 0.06),
			0px 3px 10px rgba(44, 47, 60, 0.12);
		--wx-fm-select-background: #eaedf5;
		--wx-fm-grid-border: 1px solid #ededf1;
		--wx-fm-grid-header-color: #fafafb;
		--wx-fm-button-font-color: #9fa1ae;
		--wx-fm-toolbar-height: 56px;
	}
</style>
