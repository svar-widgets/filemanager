### SVAR FileManager for Svelte

SVAR FileManager provides ready to use control for file uploading

### Useful Links

-   [Documentation](https://docs.svar.dev/svelte/filemanager/overview)
-   [How to start guide](https://docs.svar.dev/svelte/filemanager/getting_started/)
-   [Demos](https://docs.svar.dev/svelte/filemanager/samples/#/base/willow)

### License

SVAR FileManager for Svelte is available under MIT license.

### How to Use

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

### How to Modify

Typically, you don't need to modify the code. However, if you wish to do so, follow these steps:

1. Run `yarn` to install dependencies. Note that this project is a monorepo using `yarn` workspaces, so npm will not work
2. Start the project in development mode with `yarn start`

### Run Tests

To run the test:

1. Start the test examples with:
    ```sh
    yarn start:tests
    ```
2. In a separate console, run the end-to-end tests with:
    ```sh
    yarn test:cypress
    ```
