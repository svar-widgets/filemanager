import BasicInit from "./cases/BasicInit.svelte";
import PathAndSelection from "./cases/PathAndSelection.svelte";
import ContextMenu from "./cases/ContextMenu.svelte";
import Readonly from "./cases/Readonly.svelte";
import CustomStyles from "./cases/CustomStyles.svelte";
import SimpleIcons from "./cases/SimpleIcons.svelte";
import Locales from "./cases/Locales.svelte";
import API from "./cases/API.svelte";
import ExtraInfo from "./cases/ExtraInfo.svelte";
import BackendData from "./cases/BackendData.svelte";
import DataProvider from "./cases/DataProvider.svelte";
import BackendFilter from "./cases/BackendFilter.svelte";

export const links = [
	["/base/:skin", "Basic File Manager", BasicInit, "BasicInit"],
	[
		"/selection/:skin",
		"Initial path/selection",
		PathAndSelection,
		"PathAndSelection",
	],
	["/context/:skin", "Custom context menu", ContextMenu, "ContextMenu"],
	["/readonly/:skin", "Readonly mode", Readonly, "Readonly"],
	["/custom-styles/:skin", "Styling", CustomStyles, "CustomStyles"],
	["/simple-icons/:skin", "Simple icons", SimpleIcons, "SimpleIcons"],
	["/locales/:skin", "Locales", Locales, "Locales"],
	["/api/:skin", "API calls", API, "API"],
	["/extra-info/:skin", "Extra info", ExtraInfo, "ExtraInfo"],
	["/serverdata/:skin", "Backend data", BackendData, "BackendData"],
	["/data-provider/:skin", "Saving to backend", DataProvider, "DataProvider"],
	[
		"/serverfilter/:skin",
		"Filtering on backend",
		BackendFilter,
		"BackendFilter",
	],
];
