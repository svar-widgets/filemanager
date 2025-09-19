import type { DataStore, TMethodsConfig } from "./DataStore";
import type FileTree from "./FileTree";
import type { IEventBus, IPublicWritable, IEventConfig } from "@svar-ui/lib-state";

export type TID = string;

export type TContextMenuType =
	| "folder"
	| "file"
	| "body"
	| "add"
	| "multiselect";

export interface IMenuOption {
	id?: string;
	text?: string;
	hotkey?: string;
	icon?: string;
	comp?: string;
	type?: string; // fallback to [deprecated] prop
}

export interface IExtraInfo {
	Size: string;
	Count: string;
	[key: string]: any;
}

export interface IEntity {
	id: TID;
	type?: "file" | "folder";
	size?: number;
	lazy?: boolean;
	date?: Date;
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
	data?: IParsedEntity[];
}

export interface IFile {
	name: string;
	date?: Date;
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

export interface IConfig {
	data?: IEntity[];
	mode?: TMode;
	drive?: IDrive;
	preview?: boolean;
	panels?: Partial<IPanel>[];
	activePanel?: TActivePanel;
}

export interface IDataConfig extends IConfig {
	search: string;
}

export interface IData extends Omit<IDataConfig, "data"> {
	data: FileTree;
}

export interface IDrive {
	used?: number;
	total?: number;
}

export interface IApi {
	exec: <A extends keyof TMethodsConfig | (string & {})>(
		action: A,
		params?: A extends keyof TMethodsConfig ? TMethodsConfig[A] : any
	) => Promise<any>;
	on: <A extends keyof TMethodsConfig | (string & {})>(
		action: A,
		callback: (
			config: A extends keyof TMethodsConfig ? TMethodsConfig[A] : any
		) => any,
		config?: IEventConfig
	) => void;
	intercept: <A extends keyof TMethodsConfig | (string & {})>(
		action: A,
		callback: (
			config: A extends keyof TMethodsConfig ? TMethodsConfig[A] : any
		) => any,
		config?: IEventConfig
	) => void;
	detach: (tag: IEventConfig["tag"]) => void;
	getState: () => IData;
	getReactiveState: () => {
		[Key in keyof IData]: IPublicWritable<IData[Key]>;
	};
	setNext: (next: IEventBus<TMethodsConfig>) => IEventBus<TMethodsConfig>;
	getStores: () => { data: DataStore };
	getFile: (id: TID) => IParsedEntity | null;
	serialize: (id: TID) => IEntity[] | null;
}
