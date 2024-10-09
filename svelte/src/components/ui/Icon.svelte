<script>
	export let name = "";
	export let spin = false;
	export let click;

</script>

<i
	data-menu-ignore="true"
	class="wx-icon wxi-{name} 
	{spin ? 'wx-spin' : ''} 
	{click ? 'wx-clickable' : ''}"
	on:click={click} />

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
