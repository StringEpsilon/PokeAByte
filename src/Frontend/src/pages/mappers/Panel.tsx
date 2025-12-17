import { useStorageState } from "../../hooks/useStorageState";
import { PanelProps } from "./MapperPage";
import { useEffect } from "preact/hooks";

export function Panel(props: PanelProps) {
	const [isOpen, setOpen] = useStorageState(props.id, !!props.defaultOpen);
	useEffect(() => {
		if ("_" + document.location.hash.replace("#", "") === props.id) {
			setOpen(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<details
			class="panel"
			open={isOpen}
			onToggle={event => setOpen(event.currentTarget.open)}
		>
			<summary>{props.title}</summary>
			{isOpen ? props.children : null}
		</details>
	);
}
