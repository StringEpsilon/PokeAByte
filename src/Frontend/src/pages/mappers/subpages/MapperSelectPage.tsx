import { Store } from "../../../utility/propertyStore"
import { Dropdown, SelectInput } from "../../../components/SelectInput";
import { Toasts } from "../../../notifications/ToastStore";
import { useContext, useEffect, useState } from "preact/hooks";
import { useAPI } from "../../../hooks/useAPI";
import { LoadProgress } from "../../../components/LoadProgress";
import { useLocation } from "wouter";
import { AvailableMapper, Mapper } from "pokeaclient";
import { MapperFilesContext } from "../../../Contexts/availableMapperContext";
import { unique } from "../../propertyEditor/utils/unique";

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
	const [filter, setFilter] = useState<string|null>(window.localStorage.getItem("mapper-category") ?? "");
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

	const onCategorySelect = (category: string|null ) => {
		var filter = category ?? "";
		if (category === "<No filter>") {
			filter = "";
		}
		setFilter(category);
		window.localStorage.setItem("mapper-category", filter);
	}

	if (changeMapper.isLoading) {
		return <LoadProgress label="Loading mapper" />
	}
	const allMappers = mapperFileContext.availableMappers;
	const availableCategories = [
		{ value: "", display: "<No filter>" },
		...allMappers.map(x => x.displayName?.substring(1, x.displayName.indexOf(')')))
			.filter(unique)
			.toSorted()
			.map(x => ({ value: x, display: x }))
	];
	const filteredMappers = filter 
		? allMappers.filter(x => x.displayName.startsWith(`(${filter})`))
		: allMappers;
	return (
		<div>
			<span>
				Select the mapper you would like to load:
			</span>
			<br/>
			<span class={"margin-right"}>
				<Dropdown
					size={10}
					placeholder="Select filter"
					id="mapper-select"
					onSelection={(option) => onCategorySelect(option.value)}
					value={filter}
					options={availableCategories}
				/>
				</span>
			<SelectInput
				size={35}
				id="mapper-select"
				onSelection={(option) => setCurrentMapper(option.value)}
				value={currentMapper}
				options={filteredMappers.map((x: AvailableMapper) => ({ value: x.id, display: x.displayName })) || []}
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