import { locateAttr } from "wx-lib-dom";

import type { TID, IParsedEntity } from "./types";
import { getParentPath, getSelectionOnNavigation } from "./helpers";

export function hotkeys(node: HTMLElement, config: any) {
	const { api } = config;

	function handleHotkey(hotkey: string, e: KeyboardEvent) {
		const panel = config.getPanel();
		const selected = panel.selected;

		const ctrl = e.ctrlKey || e.metaKey;
		const shift = e.shiftKey;

		let options;
		const item = selected?.[0] ? api.getFile(selected[0]) : null;
		if (selected?.length) {
			if (selected.length > 1)
				options = config.menuOptions("multiselect");
			else options = config.menuOptions(item.type, item);
		} else {
			options = config.menuOptions("body");
		}
		const hotkeys = `${ctrl ? "ctrl+" : ""}${
			shift ? "shift+" : ""
		}${hotkey}`;
		const option = options
			? options.find((o: any) => o.hotkey?.toLowerCase() === hotkeys)
			: false;
		const action = config.performAction;
		if (option) {
			switch (hotkeys) {
				case "ctrl+c":
					action("copy");
					break;
				case "ctrl+x":
					action("move");
					break;
				case "ctrl+v":
					action("paste", item);
					break;
				case "delete":
					action("delete");
					break;
				case "ctrl+r":
					e.preventDefault();
					action("rename", item);
					break;
				case "ctrl+d":
					e.preventDefault();
					action("download", item);
					break;
				default:
					option.handler?.({ context: item });
			}
		}

		switch (hotkey) {
			case "enter": {
				if (ctrl || shift) break;
				const { _crumbs: crumbs, _selectNavigation: selectNavigation } =
					panel;

				if (selectNavigation) {
					const path = getParentPath(crumbs);
					if (path) {
						const selection = getSelectionOnNavigation(
							path,
							crumbs
						);
						api.exec("set-path", {
							id: path,
							selected: [selection],
						});
					}
				} else if (selected.length === 1) {
					const item = api.getFile(selected[0]);
					if (item) {
						api.exec(
							item.type === "folder" ? "set-path" : "open-file",
							{ id: item.id }
						);
					}
				}
				break;
			}

			case "arrowup":
			case "arrowleft": {
				const {
					_files: files,
					_selected: selectedFiles,
					path,
					_selectNavigation: selectNavigation,
				} = panel;

				let nextId: TID;

				if (selectedFiles.length) {
					const start = selectedFiles.at(0).id;
					const currentIndex = files.findIndex(
						(file: IParsedEntity) => file.id === start
					);
					if (currentIndex !== -1) {
						const next = currentIndex - 1;
						if (files[next]) nextId = files[next].id;
						else if (path !== "/" && !(ctrl || shift)) {
							api.exec("select-file", { type: "navigation" });
						}
					}
				} else {
					if (selectNavigation) break;
					if (path !== "/") {
						api.exec("select-file", { type: "navigation" });
						break;
					}
					nextId = files.at(0)?.id;
				}

				if (nextId)
					api.exec("select-file", {
						id: nextId,
						toggle: ctrl,
						range: shift,
					});
				break;
			}

			case "arrowdown":
			case "arrowright": {
				const {
					_files: files,
					_selected: selectedFiles,
					path,
					_selectNavigation: selectNavigation,
				} = panel;

				let nextId: TID;

				if (selectedFiles.length) {
					const start = selectedFiles.at(-1).id;
					const currentIndex = files.findIndex(
						(file: IParsedEntity) => file.id === start
					);
					if (currentIndex !== -1) {
						const next = currentIndex + 1;
						if (files[next]) nextId = files[next].id;
					}
				} else {
					if (path !== "/" && !selectNavigation) {
						api.exec("select-file", { type: "navigation" });
						break;
					}
					nextId = files.at(0)?.id;
				}

				if (nextId) {
					api.exec("select-file", {
						id: nextId,
						toggle: ctrl,
						range: shift,
					});
				}
				break;
			}
		}
	}

	function handleKeydown(e: any) {
		const code = e.code.replace("Key", "").toLowerCase();
		handleHotkey(code, e);

		//tracking active panel
		if (code == "tab")
			setTimeout(() => {
				const active = document.activeElement;
				if (active.className.indexOf("table") != -1) {
					api.exec("set-active-panel", {
						panel: locateAttr(active, "data-panel"),
					});
				}
			});
	}

	node.addEventListener("keydown", handleKeydown);

	return {
		destroy: () => {
			node.removeEventListener("keydown", handleKeydown);
		},
	};
}
