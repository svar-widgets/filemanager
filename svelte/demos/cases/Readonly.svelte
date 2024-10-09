<script>
	import { getData, getDrive } from "../data";
	import { Filemanager } from "../../src/";
</script>

<Filemanager data={getData()} drive={getDrive()} readonly />
