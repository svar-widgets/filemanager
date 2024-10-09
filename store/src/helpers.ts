import type { IParsedEntity, TSort, TSortValue, TID } from "./types";

export function formatSize(size: number): string {
	if (size < 1024) {
		return `${size} b`;
	} else if (size >= 1024 && size < 1000000) {
		return `${(size / 1000).toFixed(1)} kb`;
	} else if (size >= 1000000 && size < 1000000000) {
		return `${(size / 1000000).toFixed(1)} Mb`;
	} else if (size >= 1000000000) {
		return `${(size / 1000000000).toFixed(1)} Gb`;
	}
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
