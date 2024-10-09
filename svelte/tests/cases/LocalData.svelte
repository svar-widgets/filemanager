<script>
	import { Filemanager } from "../../src";
	import { getData } from "../data";
	import { Material, Locale } from "wx-svelte-core";

	const data = getData();
</script>

<Material>
	<Locale>
		<Filemanager {data} />
	</Locale>
</Material>
