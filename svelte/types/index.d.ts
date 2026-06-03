import type { Component, ComponentProps } from "svelte";
import type { IMenuOption } from "@svar-ui/svelte-menu";
import { Tooltip as BaseTooltip } from "@svar-ui/svelte-core";

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
	hotkey?: string;
}

export type FilePreview = Partial<IParsedEntity> & {
	type: "file" | "folder" | "search" | "multiple" | "none";
};

export declare const Filemanager: Component<
	{
		readonly?: boolean;
		menuOptions?: (
			mode: TContextMenuType,
			item?: IParsedEntity
		) => IFileMenuOption[] | false;
		extraInfo?: (
			file: IParsedEntity
		) => Promise<IExtraInfo> | IExtraInfo | null;
		icons?:
			| ((file: FilePreview, size: "big" | "small") => string | false)
			| "simple";
		previews?: (
			file: FilePreview,
			width: number,
			height: number
		) => string | null;
		init?: (api: IApi) => void;
	} & IConfig &
		FilemanagerActions<TMethodsConfig>
>;

type TooltipContentData = {
	file: IParsedEntity;
};

export declare const Tooltip: Component<
	Omit<ComponentProps<typeof BaseTooltip>, "content"> & {
		api?: IApi;
		overflow?: boolean;
		content?: Component<{
			api: IApi;
			data: TooltipContentData;
		}>;
	}
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
