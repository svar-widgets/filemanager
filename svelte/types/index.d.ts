import type { Component } from "svelte";
import type { IMenuOption } from "@svar-ui/svelte-menu";

import type {
	TMethodsConfig,
	IApi,
	IConfig,
	TContextMenuType,
	IExtraInfo,
	IParsedEntity,
} from "@svar-ui/filemanager-store";

export * from "@svar-ui/filemanager-store";

export interface IFileMenuOption extends IMenuOption {
	hotkey: string;
}

export declare const Filemanager: Component<
	{
		readonly?: boolean;
		menuOptions?: () => (
			mode: TContextMenuType,
			item?: IParsedEntity
		) => IFileMenuOption[];
		extraInfo?: (
			file: IParsedEntity
		) => Promise<IExtraInfo> | IExtraInfo | null;
		icons?: (file: IParsedEntity, size: "big" | "small") => string;
		previews?: (
			file: IParsedEntity | { type: "search" | "multiple" | "none" },
			width: number,
			height: number
		) => string | null;
		init?: (api: IApi) => void;
	} & IConfig &
		FilemanagerActions<TMethodsConfig>
>;

export declare const Material: Component<{
	fonts?: boolean;
	children?: () => any;
}>;

export declare const Willow: Component<{
	fonts?: boolean;
	children?: () => any;
}>;

export declare const WillowDark: Component<{
	fonts?: boolean;
	children?: () => any;
}>;

/* get component events from store actions*/
type RemoveHyphen<S extends string> = S extends `${infer Head}-${infer Tail}`
	? `${Head}${RemoveHyphen<Tail>}`
	: S;

type EventName<K extends string> = `on${RemoveHyphen<K>}`;

export type FilemanagerActions<TMethodsConfig extends Record<string, any>> = {
	[K in keyof TMethodsConfig as EventName<K & string>]?: (
		ev: TMethodsConfig[K]
	) => void;
} & {
	[key: `on${string}`]: (ev?: any) => void;
};
