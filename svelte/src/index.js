import Filemanager from "./components/Filemanager.svelte";

import Material from "./themes/Material.svelte";
import Willow from "./themes/Willow.svelte";
import WillowDark from "./themes/WillowDark.svelte";

export { Filemanager, Material, Willow, WillowDark };

export { getMenuOptions } from "wx-filemanager-store";

import { setEnv } from "wx-lib-dom";
import { env } from "wx-lib-svelte";
setEnv(env);
