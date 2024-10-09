<script>
	import { getContext } from "svelte";
	import { apiKey } from "wx-svelte-uploader";

	export let item;

	const _ = getContext("wx-i18n").getGroup("filemanager");
	const uploaderApi = getContext(apiKey);

	function openFileChooserDialog() {
		uploaderApi.open({});
	}
</script>

<div class="wx-upload-button" on:click={openFileChooserDialog}>
	<span>{_(item.text)}</span>
</div>

<style>
	.wx-upload-button {
		width: 100%;
	}
</style>
