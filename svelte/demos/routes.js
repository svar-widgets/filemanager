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
	["/base/:skin", "Basic File Manager", BasicInit],
	["/selection/:skin", "Initial path/selection", PathAndSelection],
	["/context/:skin", "Custom context menu", ContextMenu],
	["/readonly/:skin", "Readonly mode", Readonly],
	["/custom-styles/:skin", "Styling", CustomStyles],
	["/simple-icons/:skin", "Simple icons", SimpleIcons],
	["/locales/:skin", "Locales", Locales],
	["/api/:skin", "API calls", API],
	["/extra-info/:skin", "Extra info", ExtraInfo],
	["/serverdata/:skin", "Backend data", BackendData],
	["/data-provider/:skin", "Saving to backend", DataProvider],
	["/serverfilter/:skin", "Filtering on backend", BackendFilter],
];
