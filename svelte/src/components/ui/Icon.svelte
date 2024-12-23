<script>
	let { name = "", spin = false, onclick } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<i
	data-menu-ignore="true"
	class="wx-icon wxi-{name} 
	{spin ? 'wx-spin' : ''} 
	{onclick ? 'wx-clickable' : ''}"
	onclick={() => {
		onclick && onclick();
	}}
></i>

<style>
	.wx-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 38px;
		width: 38px;
		font-size: var(--wx-icon-size);
		color: var(--wx-icon-color);
		border-radius: 50%;
	}

	.wx-icon.wx-clickable {
		cursor: pointer;
	}

	.wx-icon.wx-clickable:hover {
		background-color: var(--wx-background-alt);
	}

	.wx-spin:before {
		color: var(--wx-color-primary);
		animation-name: spin;
		animation-duration: 2000ms;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
