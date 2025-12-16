import classNames from "classnames";
import { useUISetting } from "../Contexts/UISettingsContext";

/**
 * The toggle button to activate/deactivate advanced mode.
 */
export function AdvancedToggle() {
	const [advancedMode, setAdvancedMode] = useUISetting("advancedMode");
	return (
		<i
			role="button"
			tabIndex={0}
			title="Toggle advanced mode"
			class={classNames("material-icons icon-button-bare", { "text-green": advancedMode })}
			onClick={() => setAdvancedMode(!advancedMode)}
		>
			rocket
		</i>
	);
}
