<script>
	import { getData, getDrive } from "../data";
	import { Filemanager } from "../../src/";
	import { Button } from "wx-svelte-core";

	let api = $state();
	let serializedData = [];

	function serialize() {
		serializedData = api.serialize("/Code");
		api.exec("provide-data", {
			id: "/Code",
			data: [],
		});
	}

	function parse() {
		api.exec("provide-data", {
			id: "/Code",
			data: serializedData,
		});
	}
</script>

<div class="demo">
	<div class="bar">
		<Button onclick={serialize}
			>Serialize and clear the "Code" folder</Button
		>
		<Button onclick={parse}>Load data back</Button>
	</div>
	<Filemanager
		bind:this={api}
		data={getData()}
		drive={getDrive()}
		panels={[{ path: "/Code" }]}
	/>
</div>

<style>
	.demo {
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
