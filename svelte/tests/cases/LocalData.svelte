<script>
	import { Filemanager } from "../../src";
	import { getData } from "../data";
	import { Willow, Locale } from "wx-svelte-core";

	const data = getData();
</script>

<Willow>
	<Locale>
		<Filemanager {data} />
	</Locale>
</Willow>
