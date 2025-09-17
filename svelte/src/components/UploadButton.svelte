<script>
	import { getContext } from "svelte";
	import { apiKey } from "@svar-ui/svelte-uploader";

	let { item } = $props();

	const _ = getContext("wx-i18n").getGroup("filemanager");
	const uploaderApi = getContext(apiKey);

	function openFileChooserDialog() {
		uploaderApi.open({});
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="wx-upload-button" onclick={openFileChooserDialog}>
	<span>{_(item.text)}</span>
</div>

<style>
	.wx-upload-button {
		width: 100%;
	}
</style>
