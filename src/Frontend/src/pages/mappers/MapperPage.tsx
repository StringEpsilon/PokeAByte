import { useSyncExternalStore } from "preact/compat";
import { useState } from "preact/hooks";
import { Store } from "../../utility/propertyStore";
import { MapperSelection } from "./subpages/MapperSelectPage";
import { MapperDownloadPage } from "./subpages/MapperDownloadPage";
import { MapperBackupPage } from "./subpages/MapperBackupPage";
import { MapperUpdatePage } from "./subpages/MapperUpdatePage";
import { MapperRestorePage } from "./subpages/MapperRestorePage";
import { MapperFilesContextProvider } from "../../Contexts/availableMapperContext";

export default function MapperPage() {
	const mapper = useSyncExternalStore(Store.subscribeMapper, Store.getMapper);

	return (
		<MapperFilesContextProvider>
			<article className="layout-box">
				<button className={mapper ? "border-red" : ""} disabled={!mapper} onClick={Store.client.unloadMapper}>
					{mapper
						? `Unload '${mapper?.gameName}'`
						: "No mapper loaded"
					}
				</button>
				<br/>
				<br/>
				<Panel title="Load mapper" defaultOpen>
					<MapperSelection mapper={mapper} />
				</Panel>
				<Panel title="Download mappers" >
					<MapperDownloadPage />
				</Panel>
				<Panel title="Update mappers" >
					<MapperUpdatePage />
				</Panel>
				<Panel title="Backup mappers" >
					<MapperBackupPage />
				</Panel>
				<Panel title="Restore backup/archive" >
					<MapperRestorePage />
				</Panel>
			</article>
		</MapperFilesContextProvider>
	);
}

function Panel(props: {title: string, defaultOpen?: boolean, children: React.ReactNode}) {
	const [isOpen, setOpen] = useState(!!props.defaultOpen);
	return (
		<details 
			className="panel" 
			open={isOpen}
			onToggle={event => setOpen(event.currentTarget.open)}
		>
			<summary>{props.title}</summary>
			{ isOpen ? props.children : null}
		</details>
	);
}