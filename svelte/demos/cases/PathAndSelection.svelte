<script>
	import { getData, getDrive } from "../data";
	import { Filemanager } from "../../src/";

	const panels = [
		{
			path: "/Code",
			selected: ["/Code/Datepicker"],
		},
		{
			path: "/",
			selected: ["/Music"],
		},
	];
</script>

<Filemanager data={getData()} drive={getDrive()} mode={"panels"} {panels} />
