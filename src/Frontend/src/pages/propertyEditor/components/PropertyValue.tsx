import { PropertyEdit } from "./PropertyEdit";
import { CopyValueIcon } from "./CopyValueIcon";
import { Store } from "../../../utility/propertyStore";
import { PropertyInfoTable } from "./PropertyInfoTable";
import { clipboardCopy } from "../utils/clipboardCopy";
import { getPropertyFieldValue } from "./PropertyTextbox";
import { useState } from "preact/hooks";


export function PropertyValue({ path }: { path: string }) {
	const [tableOpen, setTableOpen] = useState(false);

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
					<span class="margin-left color-darker">0x1337</span>
				</div>
				{tableOpen &&
					<PropertyInfoTable path={path} />
				}
			</div>
		</li>
	);
}

