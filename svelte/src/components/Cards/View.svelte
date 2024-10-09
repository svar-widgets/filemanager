<script>
	import { getContext } from "svelte";

	import Breadcrumbs from "../Breadcrumbs.svelte";
	import Panel from "./Panel.svelte";
	import UploadDropArea from "../UploadDropArea.svelte";

	const api = getContext("filemanager-store");
	const { activePanel } = api.getReactiveState();

</script>

<div class="wx-wrapper">
	<Breadcrumbs panel={$activePanel} />
	<UploadDropArea>
		<Panel />
	</UploadDropArea>
</div>

<style>
	.wx-wrapper {
		display: flex;
		flex-direction: column;
		height: 100%;
		max-height: 100%;
		max-width: 100%;
		flex-shrink: 1;
	}

	.wx-wrapper > :global(.wx-upload-area) {
		height: calc(100% - 48px);
	}

	.wx-wrapper > :global(.wx-upload-area) {
		overflow-y: auto;
		border: 1px solid transparent;
		border-radius: 0 0 6px 6px;
	}
	.wx-wrapper > :global(.wx-upload-area.wx-active) {
		border: 1px solid var(--wx-color-primary);
	}

</style>
