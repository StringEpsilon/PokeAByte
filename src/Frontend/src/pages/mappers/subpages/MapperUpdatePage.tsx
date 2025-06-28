import { Store } from "../../../utility/propertyStore"
import { LoadProgress } from "../../../components/LoadProgress";
import { MapperSelectionTable } from "./components/MapperSelectionTable";
import { useAPI } from "../../../hooks/useAPI";
import { MapperUpdate } from "pokeaclient";
import { MapperFilesContext } from "../../../Contexts/availableMapperContext";
import { useContext, useEffect, useState } from "preact/hooks";

export function MapperUpdatePage() {
	const filesClient = Store.client.files;
	const mapperFileContext = useContext(MapperFilesContext);
	const [availableUpdates, setAvailableUpdates] = useState<MapperUpdate[]>([]);
	const [selectedUpdates, sectSelectedUpdates] = useState<string[]>([]);
	const downloadMappers = useAPI(filesClient.downloadMapperUpdatesAsync, mapperFileContext.refresh);
	
	useEffect(() => {
		setAvailableUpdates(
			mapperFileContext.updates
				.filter(mapper => !!mapper.currentVersion)
				.filter(mapper => !!mapper.latestVersion)
		);
		sectSelectedUpdates([]);		
	}, [mapperFileContext.updates])

	useEffect(() => {
		if (downloadMappers.wasCalled && !downloadMappers.isLoading) {
			sectSelectedUpdates([]);
			downloadMappers.reset();
		}
	}, [downloadMappers, downloadMappers.wasCalled, downloadMappers.isLoading])

	const handleUpdate = () => {
		const mappers = availableUpdates.filter(x => selectedUpdates.includes(x.latestVersion.path));
		downloadMappers.call(mappers);
	}

	const handleUpdateAll = () => {
		downloadMappers.call(availableUpdates);
	}

	if (downloadMappers.isLoading || mapperFileContext.isLoading) {
		return <LoadProgress label="Downloading mapper(s)" />
	}

	return (
		<article>
			<span>
				{selectedUpdates.length} / {availableUpdates.length} Mappers Selected
			</span>
			<div className="margin-top">
				<button className="border-green margin-right" disabled={!selectedUpdates.length} onClick={handleUpdate}>
					Update selected
				</button>
				<button className="border-green margin-right" disabled={!availableUpdates.length} onClick={handleUpdateAll}>
					Update all
				</button>
				<button className="border-blue margin-right">
					Check for mappers
				</button>
				<button className="border-purple" onClick={filesClient.openMapperFolder}>
					Open mapper folder
				</button>
			</div>
			<MapperSelectionTable
				availableMappers={availableUpdates}
				selectedMappers={selectedUpdates}
				onMapperSelection={sectSelectedUpdates}
			/>
		</article>
	);
}
