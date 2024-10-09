<script>
	import { getData, getDrive } from "../data";
	import { Filemanager } from "../../src/";
	import { Button } from "wx-svelte-core";

	let api;
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

<div style="padding: 10px;">
	<Button click={serialize}>Serialize and clear the "Code" folder</Button>
	<Button click={parse}>Load data back</Button>
</div>
<Filemanager
	bind:api
	data={getData()}
	drive={getDrive()}
	panels={[{ path: "/Code" }]}
/>
