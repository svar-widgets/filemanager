### :open_file_folder: SVAR File Manager for Svelte

SVAR File Manager is a file explorer component for Svelte apps. Provides a familiar UI for browsing, organizing and previewing files. Integrate with any backend - local storage, databases, or cloud services.

### :sparkles: Key features:
- Basic file operations: create, delete, copy, rename, cut, paste
- Download and upload files
- Files tree view
- List and tiles views
- File preview pane with file information (file size, type, modified date, etc)
- Split view to manage files between different locations
- Built-in search box
- Context menu and toolbar
- Keyboard navigation
- Used storage info

### :link: Useful Links

-   [Documentation](https://docs.svar.dev/svelte/filemanager/overview)
-   [How to start guide](https://docs.svar.dev/svelte/filemanager/getting_started/)
-   [Demos](https://docs.svar.dev/svelte/filemanager/samples/#/base/willow)

### :page_with_curl: License

SVAR File Manager for Svelte is available under MIT license.

### :hammer_and_pick: How to Use

To use the widget, simply import the package and include the component in your Svelte file:

```svelte
<script>
	import { FileManager } from "wx-svelte-filemanager";

	const data = [
		{
			id: "/Code",
			date: new Date(2023, 11, 2, 17, 25),
			type: "folder",
		},
	];
	const driver = {
		used: 15200000000,
		total: 50000000000,
	};
</script>

<Filemanager {data} drive={getDrive()} />
```

### :computer: How to Modify

Typically, you don't need to modify the code. However, if you wish to do so, follow these steps:

1. Run `yarn` to install dependencies. Note that this project is a monorepo using `yarn` workspaces, so npm will not work
2. Start the project in development mode with `yarn start`

### :white_check_mark: Run Tests

To run the test:

1. Start the test examples with:
    ```sh
    yarn start:tests
    ```
2. In a separate console, run the end-to-end tests with:
    ```sh
    yarn test:cypress
    ```
