import { PropertyEdit } from "./PropertyEdit";
import { PropertyInfoTable } from "./PropertyInfoTable";
import { useState } from "preact/hooks";


export function PropertyValue({ path }: { path: string }) {
	const [tableOpen, setTableOpen] = useState(false);

	return (
		<li className="property">
			<label htmlFor={"edit-" + path} onClick={() => setTableOpen(!tableOpen)}>
				{path.split(".").pop()}:
			</label>
			<div>
				<div>
					<PropertyEdit path={path} />
				</div>
			</div>
			{tableOpen &&
				<PropertyInfoTable path={path} />
			}
		</li>
	);
}

