<script>
	import { Locale, Segmented } from "wx-svelte-core";
	import { cn } from "wx-filemanager-locales";
	import { cn as cnCore } from "wx-core-locales";

	import { getData, getDrive } from "../data";
	import { Filemanager } from "../../src/";

	let lang = $state("en");
	const options = [
		{ id: "en", label: "EN" },
		{ id: "cn", label: "CN" },
	];
</script>

<div class="demo-box">
	<div class="bar">
		<Segmented {options} bind:value={lang} />
	</div>
	{#if lang === "en"}
		<Filemanager data={getData()} drive={getDrive()} />
	{/if}
	{#if lang === "cn"}
		<Locale words={{ ...cn, ...cnCore }}>
			<Filemanager data={getData()} drive={getDrive()} />
		</Locale>
	{/if}
</div>

<style>
	.demo-box {
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.bar {
		height: 50px;
		padding: 5px;
	}
</style>
