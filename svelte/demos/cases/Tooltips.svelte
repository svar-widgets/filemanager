<script>
	import { getData, getDrive } from "../data";
	import { Filemanager, Tooltip } from "../../src";

	let api = $state();
	const data = getData();
	data.push({
		id: "/Hover me for tooltip. Visible for entries with overflow.txt",
		size: 1025,
		date: new Date(2023, 11, 1, 14, 45),
		type: "file",
	});
</script>

<Tooltip overflow {api}>
	<Filemanager bind:this={api} {data} drive={getDrive()} />
</Tooltip>
