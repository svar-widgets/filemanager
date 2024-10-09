import LocalData from "./cases/LocalData.svelte";
import Readonly from "./cases/Readonly.svelte";
import CustomMenu from "./cases/CustomMenu.svelte";
import CustomMenuReadonly from "./cases/CustomMenuReadonly.svelte";

export const links = [
	["/local-data", "", LocalData],
	["/readonly", "", Readonly],
	["/custom-menu", "", CustomMenu],
	["/custom-menu-readonly", "", CustomMenuReadonly],
];
