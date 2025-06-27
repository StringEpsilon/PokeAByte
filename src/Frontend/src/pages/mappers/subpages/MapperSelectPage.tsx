import { Store } from "../../../utility/propertyStore"
import { SelectInput } from "../../../components/SelectInput";
import { Toasts } from "../../../notifications/ToastStore";
import { useContext, useEffect, useState } from "preact/hooks";
import { useAPI } from "../../../hooks/useAPI";
import { LoadProgress } from "../../../components/LoadProgress";
import { useLocation } from "wouter";
import { AvailableMapper, Mapper } from "pokeaclient";
import { MapperFilesContext } from "../../../Contexts/availableMapperContext";

type MapperSelectProps = {
	mapper: Mapper | null
}

export function MapperSelection(props: MapperSelectProps) {
	const mapperFileContext = useContext(MapperFilesContext);
	const mapper = props.mapper;

	// @ts-expect-error The upstream type definition is incomplete, accessing fileId works just fine.
	const fileId = mapper?.fileId;
	const [, setLocation] = useLocation();
	const changeMapper = useAPI(Store.client.changeMapper);
	const [currentMapper, setCurrentMapper] = useState<string|null>(null);
	const onLoadMapper = () => {
		if (currentMapper) {
			changeMapper.call(currentMapper);
		}
	}

	useEffect(() => {
		setCurrentMapper(mapperFileContext.availableMappers?.find(x => x.id === fileId)?.id ?? null);
	}, [fileId, mapper,mapperFileContext.availableMappers])

	useEffect(() => {
		if (changeMapper.wasCalled) {
			if (!changeMapper.isLoading && changeMapper.result) {
				Toasts.push("Loaded mapper", "task_alt", "success");
				setLocation("../../properties/");
			} else if (!changeMapper.isLoading && !changeMapper.result) {
				Toasts.push("Failed to load mapper", "", "error");
			}
		}
	}, [setLocation, changeMapper.wasCalled, changeMapper.isLoading, changeMapper.result])

	if (changeMapper.isLoading) {
		return <LoadProgress label="Loading mapper" />
	}
	
	return (
		<div>
			<span>
				Select the mapper you would like to load:
			</span>
			<br/>
			<SelectInput
				size={35}
				id="mapper-select"
				onSelection={(option) => setCurrentMapper(option.value)}
				value={currentMapper}
				options={mapperFileContext.availableMappers.map((x: AvailableMapper) => ({ value: x.id, display: x.displayName })) || []}
			/>
			<button className="border-green margin-left" onClick={onLoadMapper}>
				Load Mapper
			</button>
			<div className="margin-top">
				<button
					className="border-purple margin-right"
					onClick={() => Store.client.files.openMapperFolder()}>
					Open Mapper Folder
				</button>
			</div>
		</div>
	);
}