<script>
	import { getData, getDrive } from "../data";
	import { Filemanager } from "../../src/";
	import { formatSize } from "@svar-ui/filemanager-store";

	function requestInfo(file) {
		if (file.type === "folder") {
			const { size, folders, files } = getSizeAndCount(file);

			let getString = (number, name) =>
				number ? `${number} ${name + (number === 1 ? "" : "s")}` : "";

			const foldersStr = getString(folders, "folder");

			return {
				Size: formatSize(size),
				Count:
					(foldersStr ? `${foldersStr}, ` : "") +
					getString(files, "file"),
			};
		}
	}

	function getSizeAndCount(file) {
		const dimensions = {
			size: 0,
			folders: 0,
			files: 0,
		};

		file.data?.forEach(item => {
			dimensions.size = dimensions.size + item.size || 0;
			dimensions[`${item.type}s`] = ++dimensions[`${item.type}s`];

			const result = getSizeAndCount(item);
			for (let key in result) {
				dimensions[key] = dimensions[key] + result[key];
			}
		});

		return dimensions;
	}
</script>

<Filemanager
	data={getData()}
	drive={getDrive()}
	panels={[{ selected: ["/Code"] }]}
	preview
	extraInfo={requestInfo}
/>
