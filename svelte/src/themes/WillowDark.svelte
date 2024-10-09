<script>
	import { WillowDark } from "wx-svelte-core";
	const SLOTS = $$props.$$slots;
</script>

{#if SLOTS && SLOTS.default}
	<WillowDark>
		<slot />
	</WillowDark>
{:else}
	<WillowDark />
{/if}

<style>
	:global(.wx-willow-dark-theme) {
		--wx-theme-name: willow-dark;
		color-scheme: dark;

		--wx-fm-background: #2b343b;
		--wx-fm-box-shadow: none;
		--wx-fm-select-background: #384047;
		--wx-fm-grid-border: 1px solid #384047;
		--wx-fm-grid-header-color: var(--wx-background);
		--wx-fm-button-font-color: #9fa1ae;
		--wx-fm-toolbar-height: 56px;
	}
</style>
