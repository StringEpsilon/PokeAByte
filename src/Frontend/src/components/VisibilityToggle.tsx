import { useContext, useCallback } from "preact/hooks";
import { HidePropertyContext } from "../Contexts/HidePropertyContext";
import { IconButton } from "./IconButton";


export function VisibilityToggle(props: { path: string; }) {
	const context = useContext(HidePropertyContext);
	const isVisible = !context.hiddenProperties.includes(props.path);
	
	const onHideClick = useCallback((event: Event) => {
		context.hideProperty(props.path);
		event.stopPropagation();
	}, [context, props.path]);

	const onShowClick = useCallback((event: Event) => {
		context.showProperty(props.path);
		event.stopPropagation();
	}, [context, props.path]);
	
	return (
		<IconButton
			noBorder
			title={isVisible ? "Hide property" : "Show property"}
			class="hide-icon"
			onClick={isVisible ? onHideClick : onShowClick}
			icon={isVisible ? "visibility" : "visibility_off"}
		/>
	);
}
