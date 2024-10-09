import type { DataStore, THandlersConfig } from "./DataStore";
import type FileTree from "./FileTree";
import type { IEventBus, IPublicWritable } from "wx-lib-state";

export type TID = string;
export type TContextMenuType =
	| "folder"
	| "file"
	| "body"
	| "add"
	| "multiselect";

export interface IActionConfig<T = any> {
	data?: T;
	noSave?: boolean;
}

export interface IEntity {
	id: TID;
	type?: "file" | "folder";
	size?: number;
	lazy?: boolean;
	date: Date;
	[key: string]: any;
}

export interface IParsedTreeEntity extends IEntity {
	parent: TID;
	name: string;
	ext: string;
}

export interface IParsedEntity extends IParsedTreeEntity {
	$level: number;
	open?: boolean;
	data: IParsedEntity[];
}

export interface IFile {
	name: string;
	date: Date;
	type?: "file" | "folder";
	size?: number;
	file?: File;
}

export type TMode = "cards" | "table" | "panels" | "search";

export type TActivePanel = 0 | 1;
export type TSort = {
	key: string;
	order: "asc" | "desc";
};
export type TSortValue = string | number | Date;

export interface IPanel {
	path: TID;
	selected: TID[];
	_selected: IParsedEntity[];
	_files: IParsedEntity[];
	_crumbs: IParsedEntity[];
	_sorts: { [key: TID]: TSort };
	_lastSelected: TID;
	_selectNavigation: boolean;
}

export interface IDataConfig {
	tree: IEntity[];
	mode: TMode;
	preview: boolean;
	search: string;
	drive: IDrive;
	panels: Partial<IPanel>[];
	activePanel: TActivePanel;
}

export interface IData {
	tree: FileTree;
	mode: TMode;
	preview: boolean;
	search: string;
	drive: IDrive;
	panels: Partial<IPanel>[];
	activePanel: TActivePanel;
}

export interface IDrive {
	used: number;
	total: number;
}

export type TMenuData = {
	id?: string;
	text?: string;
	hotkey?: string;
	icon?: string;
	type?: string;
	getData?: any;
};

export interface IApi {
	exec: (action: keyof THandlersConfig, params: any) => Promise<any>;
	on: (action: keyof THandlersConfig, callback: (config: any) => any) => void;
	intercept: (
		action: keyof THandlersConfig,
		callback: (config: any) => any
	) => void;
	getState: () => IData;
	getReactiveState: () => {
		[Key in keyof IData]: IPublicWritable<IData[Key]>;
	};
	setNext: (next: IEventBus<THandlersConfig>) => IEventBus<THandlersConfig>;
	getStores: () => { data: DataStore };
	getFile: (id: TID) => IParsedEntity | null;
	serialize: (id: TID) => IEntity[] | null;
}
