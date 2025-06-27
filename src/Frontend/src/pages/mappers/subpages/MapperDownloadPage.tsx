import { Store } from "../../../utility/propertyStore"
import { useState, useContext, useEffect } from "preact/hooks";
import { LoadProgress } from "../../../components/LoadProgress";
import { MapperSelectionTable } from "./components/MapperSelectionTable";
import { useAPI } from "../../../hooks/useAPI";
import { MapperUpdate } from "pokeaclient";
import { MapperFilesContext } from "../../../Contexts/availableMapperContext";

export function MapperDownloadPage() {
	const filesClient = Store.client.files;
	const mapperFileContext = useContext(MapperFilesContext);
	const [downloads, setDownloads] = useState<MapperUpdate[]>([]);
	const [selectedDownloads, setSelectedDownloads] = useState<string[]>([]);
	const downloadMappers = useAPI(filesClient.downloadMapperUpdatesAsync, mapperFileContext.refresh);

	useEffect(() => {
		setDownloads(mapperFileContext.updates.filter(mapper => !mapper.currentVersion) ?? []);
		setSelectedDownloads([]);		
	}, [mapperFileContext.updates])

	const handleDownload = () => {
		const mappers = downloads.filter(x => selectedDownloads.includes(x.latestVersion.path));
		downloadMappers.call(mappers);
	}

	const handleDownloadAll = () => {
		downloadMappers.call(downloads);
	}

	if (downloadMappers.isLoading || mapperFileContext.isLoading) {
		return <LoadProgress label="Downloading mapper(s)" />
	}
	return (
		<article>
			<span>
				{selectedDownloads.length} / {downloads.length} Mappers Selected
			</span>
			<div className="margin-top">
				<button className="border-green margin-right" disabled={!selectedDownloads.length} onClick={handleDownload}>
					DOWNLOAD SELECTED
				</button>
				<button className="border-green margin-right" disabled={!downloads.length} onClick={handleDownloadAll}>
					DOWNLOAD ALL
				</button>
				<button className="border-blue margin-right">CHECK FOR MAPPERS</button>
				<button className="border-purple" onClick={filesClient.openMapperFolder}>
					OPEN MAPPER FOLDER
				</button>
			</div>
			<div className="margin-top">
				<MapperSelectionTable
					availableMappers={downloads}
					selectedMappers={selectedDownloads}
					onMapperSelection={setSelectedDownloads}
				/>
			</div>
		</article>
	);
}
