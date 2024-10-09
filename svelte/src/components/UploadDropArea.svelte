<script>
	import { getContext } from "svelte";
	import { apiKey } from "wx-svelte-uploader";
	import { locateAttr } from "wx-lib-dom";

	const api = getContext("filemanager-store");
	const activePanel = api.getReactiveState().activePanel;

	const uploaderApi = getContext(apiKey);

	const apiSettings = {
		selected: () => {
			const panel = locateAttr(self, "data-panel");
			if (panel && panel != $activePanel) {
				api.exec("set-active-panel", {
					panel: panel * 1,
				});
			}
		},
		dragEnter: () => self.classList.toggle("wx-active"),
		dragLeave: () => self.classList.toggle("wx-active"),
	};

	let self;
</script>

<div
	class="wx-upload-area"
	class:wx-active={false}
	bind:this={self}
	use:uploaderApi.droparea={{ ...apiSettings }}
>
	<slot />
</div>

<style>
	.wx-upload-area {
		height: 100%;
	}
	.wx-upload-area.wx-active {
		background: var(--wx-color-primary-selected);
	}
</style>
