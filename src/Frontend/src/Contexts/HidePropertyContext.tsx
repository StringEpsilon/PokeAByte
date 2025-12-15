import { useCallback, useContext } from "preact/hooks";
import { ComponentChildren, createContext } from "preact";
import { useStorageRecordState } from "../hooks/useStorageState";
import { UISettingsContext } from "./UISettingsContext";

export interface HiddenPropertyData {
	hideProperty: (path: string) => void,
	showProperty: (path: string) => void,
	toggleOverride: () => void,
	hiddenProperties: string[],
	override: boolean,
}

/**
 * Context holding the advanced mode state.
 */
export const HidePropertyContext = createContext<HiddenPropertyData>(null!);

/**
 * Default context provider for the {@link HidePropertyContext}.
 */
export function HidePropertyContextProvider(props: { mapperId: string, children: ComponentChildren}) {
	const settingsContext = useContext(UISettingsContext);
	const toggleOverride = () => settingsContext.save({forceVisible: !settingsContext.settings.forceVisible});
	const [data, setData] = useStorageRecordState<string, string[]>("_hiddenProperties", props.mapperId, []);
	const hideProperty = useCallback((path: string) => {
		if (!data.includes(path)) {
			setData([...data, path]);
		}
	}, [data, setData]);
	const showProperty = useCallback((path: string) => {
		if (data.includes(path)) {
			setData(data.filter(x => x !== path));
		}
	}, [data, setData]);
	return (
		<HidePropertyContext.Provider value={{
			hiddenProperties: data,
			hideProperty,
			showProperty,
			toggleOverride: toggleOverride,
			override: settingsContext.settings.forceVisible || !settingsContext.settings.advancedMode
		}} >
			{props.children}
		</HidePropertyContext.Provider>
	)
}
