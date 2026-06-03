import type { IParsedEntity, TSort, TSortValue, TID } from "./types";

const K = 1024;
export function formatSize(size: number): string {
	if (size < K) {
		return `${size} B`;
	}
	if (size < K ** 2) {
		return `${(size / K).toFixed(1)} KB`;
	}
	if (size < K ** 3) {
		return `${(size / K ** 2).toFixed(1)} MB`;
	}
	return `${(size / K ** 3).toFixed(1)} GB`;
}

export function sort(data: IParsedEntity[], conf?: TSort) {
	if (!conf)
		conf = {
			key: "name",
			order: "asc",
		};
	const folders = data.filter(i => i.type === "folder");
	const files = data.filter(i => i.type !== "folder");
	const sortedFolders = folders.sort(sortBy(conf));
	const sortedFiles = files.sort(sortBy(conf));
	return [...sortedFolders, ...sortedFiles];
}

function sortAsc(a: TSortValue, b: TSortValue): number {
	if (typeof a === "string")
		return a.localeCompare(b as string, undefined, { numeric: true });
	if (typeof a === "object") return a.getTime() - (b as Date).getTime();
	return ((a ?? 0) as number) - ((b ?? 0) as number);
}

function sortDesc(a: TSortValue, b: TSortValue): number {
	if (typeof a === "string")
		return -a.localeCompare(b as string, undefined, { numeric: true });
	if (typeof b === "object") return b.getTime() - (a as Date).getTime();
	return ((b ?? 0) as number) - ((a ?? 0) as number);
}

function sortBy({ key, order }: TSort) {
	const sortMethod = order === "asc" ? sortAsc : sortDesc;
	return (a: IParsedEntity, b: IParsedEntity) => sortMethod(a[key], b[key]);
}

export function getSelectionOnNavigation(
	id: TID,
	crumbs: IParsedEntity[]
): TID | null {
	const length = id === "/" ? 1 : id.split("/").length;

	if (length >= crumbs.length) return null;
	return crumbs[length].id;
}

export function getParentPath(crumbs: IParsedEntity[]): TID | null {
	if (crumbs.length > 1) {
		return crumbs[crumbs.length - 2].id;
	}

	return null;
}
