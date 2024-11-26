<script>
	import {
		Globals,
		Willow,
		WillowDark,
		Material,
		Locale,
		popupContainer,
	} from "wx-svelte-core";
	import CustomFileManager from "./CustomFileManager.svelte";

	let skin = $state("willow");
</script>

<Willow />
<WillowDark />
<Material />

<div class="wx-{skin}-theme content" use:popupContainer>
	<Locale>
		<Globals>
			<CustomFileManager bind:skin />
		</Globals>
	</Locale>
</div>

<style>
	.content {
		height: 100%;
		width: 100%;
	}
</style>
