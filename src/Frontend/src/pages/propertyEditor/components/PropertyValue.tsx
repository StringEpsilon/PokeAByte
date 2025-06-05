import React from "react";
import { PropertyEdit } from "./PropertyEdit";
import { CopyValueIcon } from "./CopyValueIcon";
import { Store } from "../../../utility/propertyStore";
import { PropertyInfoTable } from "./PropertyInfoTable";
import { clipboardCopy } from "../utils/clipboardCopy";
import { getPropertyFieldValue } from "./PropertyTextbox";


export function PropertyValue({ path }: { path: string }) {
	const [tableOpen, setTableOpen] = React.useState(false);

	const handleCopyClick = () => {
		const currentPropValue = Store.getProperty(path);
		if (currentPropValue) {
			clipboardCopy(getPropertyFieldValue(currentPropValue.value, currentPropValue.type));
		}
	};

	return (
		<li className="property">
			<label htmlFor={"edit-" + path} onClick={() => setTableOpen(!tableOpen)}>
				{path.split(".").pop()}:
			</label>
			<div>
				<div>
					<CopyValueIcon onClick={handleCopyClick} />
					<PropertyEdit path={path} />
				</div>
				{tableOpen &&
					<PropertyInfoTable path={path} />
				}
			</div>
		</li>
	);
}

