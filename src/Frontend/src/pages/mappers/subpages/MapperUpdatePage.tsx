import { Store } from "../../../utility/propertyStore"
import React, { useContext, useEffect } from "react";
import { LoadProgress } from "../../../components/LoadProgress";
import { MapperSelectionTable } from "./components/MapperSelectionTable";
import { useAPI } from "../../../hooks/useAPI";
import { MapperUpdate } from "pokeaclient";
import { MapperFilesContext } from "../../../Contexts/availableMapperContext";

export function MapperUpdatePage() {
	const filesClient = Store.client.files;
	const mapperFileContext = useContext(MapperFilesContext);
	const [availableUpdates, setAvailableUpdates] = React.useState<MapperUpdate[]>([]);
	const [selectedUpdates, sectSelectedUpdates] = React.useState<string[]>([]);
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
					UPDATE SELECTED
				</button>
				<button className="border-green margin-right" disabled={!availableUpdates.length} onClick={handleUpdateAll}>
					UPDATE ALL
				</button>
				<button className="border-blue margin-right">
					CHECK FOR MAPPERS
				</button>
				<button className="border-purple" onClick={filesClient.openMapperFolder}>
					OPEN MAPPER FOLDER
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
