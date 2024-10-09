import type { TContextMenuType, TMenuData } from "./types";

export function getMenuOptions(mode: TContextMenuType): TMenuData[] {
	switch (mode) {
		case "body":
			return [
				{
					icon: "wxi-content-paste",
					text: "Paste",
					hotkey: "Ctrl+V",
					id: "paste",
				},
			];
		case "add":
			return [
				{
					icon: "mdi mdi-folder-plus-outline",
					text: "Add new file",
					id: "add-file",
				},
				{
					icon: "mdi mdi-file-plus-outline",
					text: "Add new folder",
					id: "add-folder",
				},
				{
					icon: "mdi mdi-file-upload-outline",
					text: "Upload file",
					id: "upload",
					type: "upload",
				},
			];
		case "multiselect":
			return [
				{
					icon: "wxi-content-copy",
					text: "Copy",
					hotkey: "Ctrl+C",
					id: "copy",
				},
				{
					icon: "wxi-content-cut",
					text: "Cut",
					hotkey: "Ctrl+X",
					id: "move",
				},
				{
					type: "separator",
				},
				{
					icon: "wxi-close",
					text: "Delete",
					hotkey: "Delete",
					id: "delete",
				},
			];
		default:
			return [
				mode === "folder"
					? null
					: {
							icon: "wxi-download",
							text: "Download",
							hotkey: "Ctrl+D",
							id: "download",
					  },
				{
					icon: "wxi-content-copy",
					text: "Copy",
					hotkey: "Ctrl+C",
					id: "copy",
				},
				{
					icon: "wxi-content-cut",
					text: "Cut",
					hotkey: "Ctrl+X",
					id: "move",
				},
				{
					icon: "wxi-content-paste",
					text: "Paste",
					hotkey: "Ctrl+V",
					id: "paste",
				},
				{
					type: "separator",
				},
				{
					icon: "wxi-edit",
					text: "Rename",
					hotkey: "Ctrl+R",
					id: "rename",
				},
				{
					icon: "wxi-close",
					text: "Delete",
					hotkey: "Delete",
					id: "delete",
				},
			].filter(a => a !== null);
	}
}
