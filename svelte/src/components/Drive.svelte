<script>
	import { getContext } from "svelte";
	import { formatSize } from "@svar-ui/filemanager-store";

	const api = getContext("filemanager-store");
	const drive = api.getReactiveState().drive;
	const _ = getContext("wx-i18n").getGroup("filemanager");

	let used = $derived($drive ? $drive.used : "");
	let total = $derived($drive ? $drive.total : "");
</script>

{#if used && total}
	<div class="wx-drive">
		<progress value={used} max={total} class="wx-progress"></progress>
		<p>{formatSize(used)} {_("of")} {formatSize(total)} {_("used")}</p>
	</div>
{/if}

<style>
	.wx-drive {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 8px;
	}
	.wx-progress {
		width: 100%;
		height: 8px;
		border-radius: 20px;
		background-color: var(--wx-button-background);
		border: none;
	}
	.wx-progress[value]::-webkit-progress-bar {
		border-radius: 20px;
		background-color: var(--wx-fm-progress-bar-color);
	}
	.wx-progress[value]::-moz-progress-bar {
		background-color: var(--wx-color-primary);
		border-radius: 10px;
	}

	.wx-progress[value]::-webkit-progress-value {
		background-color: var(--wx-color-primary);
		border-radius: 10px;
	}
	.wx-drive p {
		margin: 20px 0;
	}
</style>
