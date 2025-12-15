import { useStorageState } from "../../hooks/useStorageState";
import { PanelProps } from "./MapperPage";

export function Panel(props: PanelProps) {
	const [isOpen, setOpen] = useStorageState(props.id, !!props.defaultOpen);
	return (
		<details
			className="panel"
			open={isOpen}
			onToggle={event => setOpen(event.currentTarget.open)}
		>
			<summary>{props.title}</summary>
			{isOpen ? props.children : null}
		</details>
	);
}
