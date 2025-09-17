import { DataTree } from "@svar-ui/lib-state";
import type {
	IEntity,
	IParsedTreeEntity,
	IParsedEntity,
	TID,
	IFile,
} from "./types";

export default class FileTree extends DataTree<IParsedEntity> {
	constructor(files?: IEntity[]) {
		const root = {
			id: "/",
			name: "My files",
			open: true,
			$level: 1,
			parent: 0 as unknown,
			ext: "",
			type: "folder",
		};
		super([root as IParsedEntity]);
		this.parse(files, "/");
	}

	parse(files: IEntity[], parent: TID, force?: boolean) {
		if (!files || !files.length) return;
		files.forEach(file =>
			this.parseId(file as IParsedTreeEntity, force ? parent : undefined)
		);
		super.parse(files as IParsedEntity[], parent);
	}

	parseId(file: IParsedTreeEntity, parent?: TID) {
		if (file.parent === (0 as unknown)) return;
		const id = file.id;
		const slash = id.lastIndexOf("/");

		file.parent = parent ?? (slash === 0 ? "/" : id.slice(0, slash));
		file.name = id.slice(slash + 1);
		file.type = file.type || "file";

		if (file.type !== "folder") {
			const dot = file.name.lastIndexOf(".");
			const ext = dot !== -1 ? file.name.slice(dot + 1) : "";
			file.ext = ext !== "new" ? ext?.toLocaleLowerCase() : "";
		}

	}

	getParents(id: TID): any {
		const res: IParsedEntity[] = [];
		let file = this.byId(id);
		if (!file) return res;

		while (file.id !== (0 as unknown)) {
			res.push(file);
			file = this.byId(file.parent);
		}

		return res.reverse();
	}

	findFiles(text: string, parent: TID = "/"): IParsedEntity[] {
		const res: IParsedEntity[] = [];
		const t = text.toLocaleLowerCase();
		this.eachChild(i => {
			if (i.name.toLowerCase().indexOf(t) !== -1) {
				res.push(i);
			}
		}, parent);
		return res;
	}
	add(file: IParsedTreeEntity, index?: number) {
		const parent = this.byId(file.parent || "/");
		const data = file.data ? [...file.data] : null;
		file.data = null;
		super.add(
			file as IParsedEntity,
			index ?? parent.data ? parent.data.length : 0
		);
		if (data) {
			data.forEach(i => this.add(i));
		}
	}
	renameFiles(id: TID, target: TID, newIds: any): IParsedEntity {
		const file = this.byId(id);
		const copyFile = this.normalizeFile(file, target);
		const newData: IParsedEntity[] = [];
		copyFile.data?.forEach((item: IParsedEntity) =>
			newData.push(this.renameFiles(item.id, copyFile.id, newIds))
		);

		if (newData.length) copyFile.data = newData;
		newIds[id] = copyFile.id;
		return copyFile as IParsedEntity;
	}
	copyFiles(ids: TID[], target: TID, remove?: boolean): any {
		const newIds: any = {};
		ids.forEach(id => {
			const file = this.renameFiles(id, target, newIds);
			this.add(file);
			if (remove) this.remove(id);
			newIds[id] = file.id;
		});
		return newIds;
	}
	moveFiles(ids: TID[], target: TID) {
		const parent = this.byId(ids[0]).parent;
		if (parent !== target) {
			return this.copyFiles(ids, target, true);
		}
	}
	serialize(id: TID = "/"): IEntity[] | null {
		const out: IEntity[] = [];
		const temp = this.byId(id);
		if (!temp) return null;

		temp.data?.forEach(item => {
			const { id, date, type, size, lazy } = item;
			const serializedItem: IEntity = {
				id,
				date,
				type: type ?? "file",
			};

			if (lazy) serializedItem.lazy = lazy;
			if (size) serializedItem.size = size;

			out.push(serializedItem);

			const items = this.serialize(id);
			if (items.length) out.push(...items);
		});

		return out;
	}
	normalizeFile(file: IFile, parent: TID): IParsedTreeEntity {
		const name = file.name;
		const index = name.lastIndexOf(".");
		const ext = index !== -1 ? name.slice(index + 1) : "";
		const endExt = ext ? `.${ext}` : "";
		let newName = index !== -1 ? name.slice(0, index) : name;
		let id = parent + (parent === "/" ? "" : "/") + newName;

		while (this.byId(id + endExt)) {
			const addNew = ".new";
			id += addNew;
			newName += addNew;
		}

		return {
			...file,
			id: id + endExt,
			name: newName + endExt,
			parent,
			ext: ext.toLocaleLowerCase(),
		};
	}
}
