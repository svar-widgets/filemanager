import Filemanager from "./components/Filemanager.svelte";

import Material from "./themes/Material.svelte";
import Willow from "./themes/Willow.svelte";
import WillowDark from "./themes/WillowDark.svelte";

export { Filemanager, Material, Willow, WillowDark };

export { getMenuOptions } from "@svar-ui/filemanager-store";

import { setEnv } from "@svar-ui/lib-dom";
import { env } from "@svar-ui/lib-svelte";
setEnv(env);
