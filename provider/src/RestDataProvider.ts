import { Rest } from "wx-lib-data-provider";
import type { ActionMap } from "wx-lib-data-provider";
import type {
	IDrive,
	THandlersConfig,
	TID,
	IEntity,
	IFile,
} from "wx-filemanager-store";

type TProviderMethodsConfig = THandlersConfig & {
	"upload-file": {
		file: IFile;
		parent: TID;
	};
	"file-renamed": {
		id: TID;
		newId: TID;
	};
};

export default class RestDataProvider extends Rest<TProviderMethodsConfig> {
	constructor(url: string) {
		super(url);
	}
	getHandlers(): ActionMap<TProviderMethodsConfig> {
		return {
			"create-file": {
				handler: (ev: THandlersConfig["create-file"]) => {
					if (ev.file.file) {
						const multipartFormData = new FormData();
						multipartFormData.append("file", ev.file.file);
						multipartFormData.append("name", ev.file.name);

						return this.send(
							`upload?id=${encodeURIComponent(ev.parent)}`,
							"POST",
							multipartFormData
						);
					} else {
						return this.send(
							`files/${encodeURIComponent(ev.parent)}`,
							"POST",
							this.getParams({
								name: `${ev.file.name}`,
								type: ev.file.type,
							})
						).then((res: any) => {
							this.handleNonUniqueNames(
								[res.result.id],
								[ev.newId]
							);
							return res;
						});
					}
				},
			},
			"rename-file": {
				handler: (ev: THandlersConfig["rename-file"]) => {
					return this.send(
						`files/${encodeURIComponent(ev.id)}`,
						"PUT",
						this.getParams({
							operation: "rename",
							name: ev.name,
						})
					).then((res: any) => {
						this.handleNonUniqueNames([res.result.id], [ev.newId]);
						return res;
					});
				},
			},
			"move-files": {
				handler: async (ev: THandlersConfig["move-files"]) => {
					return this.send(
						"files",
						"PUT",
						this.getParams({
							operation: "move",
							ids: ev.ids,
							target: ev.target,
						})
					).then((res: any) => {
						this.handleNonUniqueNames(
							res.result.map((i: any) => i.id),
							ev.newIds
						);
						return res;
					});
				},
			},
			"copy-files": {
				handler: async (ev: THandlersConfig["copy-files"]) => {
					return this.send(
						"files",
						"PUT",
						this.getParams({
							operation: "copy",
							ids: ev.ids,
							target: ev.target,
						})
					).then((res: any) => {
						this.handleNonUniqueNames(
							res.result.map((i: any) => i.id),
							ev.newIds
						);
						return res;
					});
				},
			},
			"delete-files": {
				handler: async (ev: THandlersConfig["delete-files"]) => {
					return this.send(
						"files",
						"DELETE",
						this.getParams({
							ids: ev.ids,
						})
					);
				},
			},
		};
	}

	async loadFiles(id: TID): Promise<IEntity[]> {
		const data = await this.send<IEntity[]>(
			id ? `files/${encodeURIComponent(id)}` : "files",
			"GET"
		);
		return this.parseDates(data);
	}

	loadInfo(id: TID): Promise<void | IDrive[]> {
		return this.send<IDrive[]>(
			id ? `info/${encodeURIComponent(id)}` : "info",
			"GET"
		);
	}

	parseDates(data: IEntity[]) {
		data.forEach(item => {
			if (item.date) item.date = new Date(item.date);
		});
		return data;
	}

	async send<T>(
		url: string,
		method: string,
		data?: any,
		customHeaders?: any
	): Promise<T> {
		const headers = {
			...customHeaders,
		};

		const req: RequestInit = {
			method,
			headers,
		};

		if (data) {
			req.body = data;
		}

		return fetch(`${this._url}/${url}`, req).then(res => {
			return res
				.json()
				.then(response => {
					if (!res.ok)
						throw new Error(`Network error: ${response.error}`);
					return response;
				})
				.catch(error => {
					console.error(error);
				});
		});
	}

	private getParams(obj: Record<string, any>): string {
		return typeof obj === "object" ? JSON.stringify(obj) : obj;
	}

	private handleNonUniqueNames(serverIds: TID[], localIds: TID[]) {
		localIds.forEach((id: TID, i: number) => {
			if (id !== serverIds[i])
				(this as any).exec("file-renamed", {
					id,
					newId: serverIds[i],
				});
		});
	}
}
