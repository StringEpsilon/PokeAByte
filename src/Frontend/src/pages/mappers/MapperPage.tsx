import { useSyncExternalStore } from "preact/compat";
import { Store } from "../../utility/propertyStore";
import { MapperSelection } from "./subpages/MapperSelectPage";
import { MapperDownloadPage } from "./subpages/MapperDownloadPage";
import { MapperBackupPage } from "./subpages/MapperBackupPage";
import { MapperUpdatePage } from "./subpages/MapperUpdatePage";
import { MapperRestorePage } from "./subpages/MapperRestorePage";
import { MapperFilesContextProvider } from "../../Contexts/availableMapperContext";
import { Panel } from "./Panel";

export default function MapperPage() {
	const mapper = useSyncExternalStore(Store.subscribeMapper, Store.getMapper);
	return (
			<article class="margin-top">
				<Panel id="_mapper-select-panel" title="Load mapper" defaultOpen>
					<MapperSelection mapper={mapper} />
				</Panel>
				<Panel id="_mapper-download-panel" title="Download mappers" >
					<MapperDownloadPage />
				</Panel>
				<Panel id="_mapper-update-panel" title="Update mappers" >
					<MapperUpdatePage />
				</Panel>
				<Panel id="_mapper-backup-panel" title="Backup mappers" >
					<MapperBackupPage />
				</Panel>
				<Panel id="_mapper-restore-panel" title="Restore backup/archive" >
					<MapperRestorePage />
				</Panel>
			</article>
	);
}

export type PanelProps = {
	title: string, 
	defaultOpen?: boolean, 
	children: React.ReactNode
	id: string
}

