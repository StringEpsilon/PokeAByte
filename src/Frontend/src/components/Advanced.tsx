import { ComponentChildren } from "preact";
import { useUISetting } from "../Contexts/UISettingsContext";

/**
 * Renders the children only when advanced mode is enabled.
 */
export function Advanced(props: { children: ComponentChildren; }) {
	const [advancedMode] = useUISetting("advancedMode");
	if (advancedMode) {
		return props.children;
	}
	return null;
}
