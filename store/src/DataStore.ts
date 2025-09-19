import { Store, EventBus, DataRouter, markReactive } from "@svar-ui/lib-state";
import type { TDataConfig, TWritableCreator } from "@svar-ui/lib-state";
import { sort } from "./helpers";

import FileTree from "./FileTree";

import type {
	IData,
	IDataConfig,
	TID,
	IEntity,
	IParsedEntity,
	TMode,
	TActivePanel,
	IPanel,
	IFile,
	TSort,
} from "./types";

export class DataStore extends Store<IData> {
	public in: EventBus<TMethodsConfig, keyof TMethodsConfig>;
	private _router: DataRouter<IData, IDataConfig, TMethodsConfig>;

	constructor(w: TWritableCreator) {
		super({ writable: w, async: false });

		const configs = [];
		for (let i = 0; i < 2; i++) {
			configs.push({
				in: ["data", `panels.${i}.path`],
				out: [`panels.${i}._crumbs`],
				exec: (ctx: TDataConfig) => {
					const { data, panels } = this.getState();
					const update: Partial<IPanel>[] = [];
					update[i] = { _crumbs: data.getParents(panels[i].path) };

					this.setState({ panels: update }, ctx);
				},
			});
			configs.push({
				in: [
					"data",
					`panels.${i}.path`,
					`panels.${i}._sorts`,
					"search",
				],
				out: [`panels.${i}._files`],
				exec: (ctx: TDataConfig) => {
					const { data, panels, search } = this.getState();
					let _files;

					if (search) _files = data.findFiles(search, panels[i].path);
					else _files = data.byId(panels[i].path)?.data || [];

					const { path, _sorts: sorts } = panels[i];
					_files = sort(_files, sorts[path]);

					const update: Partial<IPanel>[] = [];
					update[i] = { _files };

					this.setState({ panels: update }, ctx);
				},
			});
			configs.push({
				in: ["data", `panels.${i}.selected`, `panels.${i}._sorts`],
				out: [`panels.${i}._selected`],
				exec: (ctx: TDataConfig) => {
					const { data, panels } = this.getState();

					const selectedFiles = panels[i].selected.map((s: TID) =>
						data.byId(s)
					);
					const { path, _sorts: sorts } = panels[i];
					const sortedFiles = sort(selectedFiles, sorts[path]);

					const update: Partial<IPanel>[] = [];
					update[i] = { _selected: sortedFiles };

					this.setState({ panels: update }, ctx);
				},
			});
		}

		this._router = new DataRouter(super.setState.bind(this), configs, {
			data: (v: IParsedEntity[]) => new FileTree(v),
		});
		const inBus = (this.in = new EventBus());

		inBus.on(
			"select-file",
			({
				id,
				toggle,
				range,
				panel,
				type,
			}: TMethodsConfig["select-file"]) => {
				const { panels, activePanel } = this.getState();
				if (typeof panel === "undefined") panel = activePanel;
				if (!id) toggle = range = false;

				let selected = [...panels[panel].selected];

				if (toggle) {
					const index = selected.indexOf(id);
					if (index === -1) selected.push(id);
					else selected.splice(index, 1);
				} else if (range && panels[panel]._lastSelected) {
					const files = panels[panel]._files;

					let start = files.findIndex(
						f => f.id == panels[panel]._lastSelected
					);
					let end = files.findIndex(f => f.id == id);
					if (end < start) [start, end] = [end, start];

					const newSelected = files
						.slice(start, end + 1)
						.map(i => i.id);

					selected = [...new Set([...selected, ...newSelected])];
				} else {
					selected = id ? [id] : [];
				}

				const update: Partial<IPanel>[] = [];
				update[panel] = {
					selected,
					_lastSelected: id,
					_selectNavigation: type === "navigation",
				};

				this.setState({ panels: update });
			}
		);

		inBus.on(
			"set-path",
			({ id, panel, selected }: TMethodsConfig["set-path"]) => {
				const { data, activePanel } = this.getState();
				const item = data.byId(id);
				if (item) {
					const update: Partial<IPanel>[] = [];
					if (typeof panel === "undefined") panel = activePanel;
					update[panel] = { path: id };
					this.setState({ panels: update });
					inBus.exec("select-file", { panel });
					if (selected) {
						selected.forEach(selectedId =>
							inBus.exec("select-file", {
								id: selectedId,
								panel,
								toggle: true,
							})
						);
					}

					if (item.lazy) inBus.exec("request-data", { id });
				}
			}
		);

		inBus.on(
			"provide-data",
			({ id, data: records }: TMethodsConfig["provide-data"]) => {
				const { mode, data } = this.getState();
				const item = data.byId(id);
				if (item) {
					if (!item.lazy) item.data = [];
					item.lazy = false;
					data.parse(records, id, mode === "search");
					this.setState({ data });
				}
			}
		);

		inBus.on(
			"open-tree-folder",
			({ id, mode }: TMethodsConfig["open-tree-folder"]) => {
				const { data } = this.getState();

				data.update(id, { open: mode });
				this.setState({ data });
			}
		);

		inBus.on("show-preview", ({ mode }: TMethodsConfig["show-preview"]) => {
			this.setState({ preview: mode });
		});

		inBus.on("rename-file", (ev: TMethodsConfig["rename-file"]) => {
			const { id, name } = ev;
			const { data, panels } = this.getState();
			const item = data.byId(id);

			if (item.name !== name) {
				item.name = name;
				const newFile = data.normalizeFile(item, item.parent);
				ev.newId = newFile.id;
				newFile.data = null;
				data.add(newFile);

				let changes = { [id]: newFile.id };
				item.data?.forEach(
					child =>
						(changes = {
							...data.moveFiles([child.id], newFile.id),
							...changes,
						})
				);

				const update: Partial<IPanel>[] = panels.map(p => {
					return {
						selected: p.selected,
						_crumbs: p._crumbs,
						_lastSelected: p._lastSelected,
						_sorts: p._sorts,
					};
				});

				data.remove(id);
				this._updatePanels(update, changes);
				this.setState({ data, panels: update });
			}
		});
		inBus.on("create-file", (ev: TMethodsConfig["create-file"]) => {
			const { file, parent } = ev;
			const { data } = this.getState();
			const newFile = data.normalizeFile(file, parent);
			newFile.type = file.type || "file";
			ev.newId = newFile.id;

			data.add(newFile);
			this.setState({ data });
			inBus.exec("select-file", { id: newFile.id });
		});
		inBus.on("delete-files", ({ ids }: TMethodsConfig["delete-files"]) => {
			const { data, panels } = this.getState();

			const update: Partial<IPanel>[] = panels.map(p => {
				return {
					selected: p.selected,
					_crumbs: p._crumbs,
					_lastSelected: p._lastSelected,
					_sorts: p._sorts,
				};
			});

			ids.forEach(id => data.remove(id));
			this._updatePanels(update, {});
			this.setState({ data, panels: update });
		});
		inBus.on("copy-files", (ev: TMethodsConfig["copy-files"]) => {
			const { ids, target } = ev;
			if (this._isPlacedIntoSelf(ids, target)) {
				console.error("You cannot copy a folder into itself");
				ev.skipProvider = true;
				return;
			}

			const { data, panels, activePanel } = this.getState();
			const changes = data.copyFiles(ids, target);
			ev.newIds = ids.map(id => changes[id]);

			this.setState({ data });

			if (panels[activePanel].path == target) {
				inBus.exec("select-file", {});
				ids.forEach((id: TID) => {
					inBus.exec("select-file", {
						id: changes[id],
						toggle: true,
					});
				});
			}
		});
		inBus.on("move-files", (ev: TMethodsConfig["move-files"]) => {
			const { ids, target } = ev;
			if (this._isPlacedIntoSelf(ids, target)) {
				console.error("You cannot move a folder into itself");
				ev.skipProvider = true;
				return;
			}

			const { data, panels, activePanel } = this.getState();

			const changes = data.moveFiles(ids, target);
			if (changes) {
				ev.newIds = ids.map(id => changes[id]);
				const update: Partial<IPanel>[] = panels.map(p => {
					return {
						selected: p.selected,
						_crumbs: p._crumbs,
						_lastSelected: p._lastSelected,
						_sorts: p._sorts,
					};
				});
				this._updatePanels(update, changes, true);
				this.setState({ data, panels: update });

				if (panels[activePanel].path == target) {
					inBus.exec("select-file", {});
					ids.forEach((id: TID) => {
						inBus.exec("select-file", {
							id: changes[id],
							toggle: true,
						});
					});
				}
			}
		});

		let prevState: Partial<IData> = null;
		inBus.on("filter-files", ({ text }: TMethodsConfig["filter-files"]) => {
			if (!text) {
				if (prevState) this.setState({ ...prevState });
				return;
			}
			inBus.exec("select-file", {});
			const { panels, mode } = this.getState();
			if (!prevState) {
				prevState = { panels, mode, search: "" };
			}
			this.setState({ mode: "search", search: text });
		});

		inBus.on("set-mode", ({ mode }: TMethodsConfig["set-mode"]) => {
			const { activePanel } = this.getState();
			const panels: Partial<IPanel>[] = [];
			panels[activePanel] = { _selectNavigation: false };
			const update: Partial<IData> = {
				mode,
				search: "",
				panels,
			};
			prevState = null;
			this.setState(update);
		});

		inBus.on(
			"set-active-panel",
			({ panel }: TMethodsConfig["set-active-panel"]) => {
				this.setState({
					activePanel: panel,
				});
			}
		);
		inBus.on(
			"sort-files",
			({ key, order, panel, path }: TMethodsConfig["sort-files"]) => {
				const { activePanel, panels } = this.getState();

				panel = panel ?? activePanel;
				path = path ?? panels[panel].path;

				const update: Partial<IPanel>[] = [];
				update[panel] = {
					_sorts: {
						...panels[panel]._sorts,
						[path]: { key, order },
					},
				};

				this.setState({ panels: update });
			}
		);

		this.initOnce();
	}

	initOnce() {
		const panels: Partial<IPanel>[] = [];
		for (let i = 0; i < 2; i++) {
			panels[i] = markReactive({
				_crumbs: [],
				_files: [],
				_selected: [],
				_sorts: {},
				path: "/",
				selected: [],
				...panels[i],
			});
		}

		const upd: Partial<IDataConfig> = {
			panels: markReactive(panels),
			data: [],
			search: "",
		};
		this._router.init(upd);
	}
	init(state: Partial<IDataConfig>) {
		const upd: Partial<IDataConfig> = {
			...state,
		};

		this._router.init(upd);
	}
	setState(state: Partial<IData>, ctx?: TDataConfig) {
		return this._router.setState(state, ctx);
	}
	getFile(id: TID) {
		const { data } = this.getState();
		return data.byId(id) || null;
	}
	serialize(id: TID) {
		const { data } = this.getState();
		return data.serialize(id);
	}
	_updatePanels(update: Partial<IPanel>[], changes: any, move?: boolean) {
		const { data } = this.getState();

		// if files are moved, we should not replace references to them, just remove
		update.forEach((panel: IPanel) => {
			const sel: TID[] = [];
			panel.selected.forEach((s: TID) => {
				if (data.byId(s)) sel.push(s);
				else if (!move && changes[s]) sel.push(changes[s]);
			});
			panel.selected = sel;

			if (!data.byId(panel._lastSelected))
				panel._lastSelected = move
					? null
					: changes[panel._lastSelected] || null;

			const sort: { [key: TID]: TSort } = {};
			Object.keys(panel._sorts).forEach((id: TID) => {
				if (data.byId(id)) sort[id] = panel._sorts[id];
				else if (changes[id] && !move)
					sort[changes[id]] = panel._sorts[id];
			});
			panel._sorts = sort;

			const last = panel._crumbs[panel._crumbs.length - 1];
			if (last?.id !== "/") {
				if (changes[last.id]) panel.path = changes[last.id];
				//maybe here we should find closest valid path
				else if (!data.byId(last.id)) panel.path = "/";
			}
		});
	}
	_isPlacedIntoSelf(ids: TID[], target: TID): boolean {
		return ids.some(id => {
			return (
				id === target ||
				this.getState()
					.data.getParents(target)
					.some((p: IParsedEntity) => p.id === id)
			);
		});
	}
}

type CombineTypes<T, N> = {
	[P in keyof T]: T[P] extends Record<any, any>
		? T[P] & N
		: (T[P] & N) | null;
};
export type TMethodsConfig = CombineTypes<
	{
		["select-file"]: {
			id?: TID;
			toggle?: boolean;
			range?: boolean;
			panel?: TActivePanel;
			type?: "navigation";
		};
		["set-path"]: { id: TID; selected?: TID[]; panel?: TActivePanel };
		["set-active-panel"]: { panel: TActivePanel };
		["open-tree-folder"]: { id: TID; mode: boolean };
		["show-preview"]: { mode: boolean };
		["filter-files"]: { text: string };
		["set-mode"]: { mode: TMode };
		["rename-file"]: { id: TID; name: string; newId?: string };
		["create-file"]: {
			file: IFile;
			parent: TID;
			newId?: string;
		};
		["delete-files"]: { ids: TID[] };
		["move-files"]: { ids: TID[]; target: TID; newIds?: TID[] };
		["copy-files"]: { ids: TID[]; target: TID; newIds?: TID[] };

		["request-data"]: { id: TID };
		["provide-data"]: { id: TID; data: IEntity[] };
		["download-file"]: { id: TID };
		["open-file"]: { id: TID };
		["sort-files"]: {
			key: string;
			order: "asc" | "desc";
			panel?: TActivePanel;
			path?: string;
		};
	},
	{
		skipProvider?: boolean;
		[key: string]: any;
	}
>;
