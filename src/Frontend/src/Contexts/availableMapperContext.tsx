import { AvailableMapper, MapperUpdate } from "pokeaclient";
import React, { useEffect, useState } from "react";
import { Store } from "../utility/propertyStore";


export interface MapperFilesContextData {
	refresh: () => void,
	isLoading: boolean,
	availableMappers: AvailableMapper[],
	updates: MapperUpdate[],
}

export const MapperFilesContext = React.createContext<MapperFilesContextData>(null!);

export function MapperFilesContextProvider(props: { children: React.ReactNode}) {
	const refresh = async () => {
		setState({
			...state, 
			isLoading: true,
		});
		const availableMappers = await Store.client.getMappers() ?? [];
		const updates = await Store.client.files.getMapperUpdatesAsync() ?? [];
		setState({
			...state, 
			availableMappers,
			updates,
			isLoading: false
		});
	}
	const [state, setState] = useState<MapperFilesContextData>({
		refresh,
		availableMappers: [],
		updates: [],
		isLoading: true,
	});
	useEffect(() => {
		refresh();
	}, [])

	return (
		<MapperFilesContext.Provider value={state} >
			{props.children}
		</MapperFilesContext.Provider>
	)
}