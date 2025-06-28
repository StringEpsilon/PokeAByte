import { Store } from "../../../utility/propertyStore";
import { SaveValueButton } from "./SaveValueButton";
import { FreezeValueButton } from "./FreezeValueButton";
import { useGameProperty } from "../hooks/useGameProperty";
import { Toasts } from "../../../notifications/ToastStore";
import { GamePropertyType } from "pokeaclient";
import { getPropertyFieldValue, PropertyTextbox } from "./PropertyTextbox";
import { PropertyInputSelect } from "./PropertyInputSelect";
import { useState } from "preact/hooks";
import { CopyValueIcon } from "./CopyValueIcon";
import { clipboardCopy } from "../utils/clipboardCopy";

export function PropertyEdit({ path }: { path: string }) {
	const property = useGameProperty(path);
	const propertyType = property?.type ?? GamePropertyType.int;
	const reference = property?.reference;
	const isFrozen = property?.isFrozen || false;
	const isReadonly = !!(property?.address === null);
	const type = (propertyType === "bit" || propertyType === "bool") ? "checkbox" : "text";
	const isSelect = reference && reference !== "defaultCharacterMap"
	const [value, setValue] = useState<string|boolean>("");
	const [hasFocus, setHasFocus] = useState(false);
	const [madeEdit, setMadeEdit] = useState(false);
	const handleUpdate = (newValue: string|boolean)  => {
		setValue(newValue);
		setMadeEdit(newValue != property?.value);
	};
	const handleSave = () => {
		if (path) {
			Store.client.updatePropertyValue(path, value)
				.then(() => {
					setMadeEdit(false);
					Toasts.push(`Succesfully saved property value!`, "task_alt", "success");
				});
		}
	};
	const handleCopyClick = () => {
		const currentPropValue = Store.getProperty(path);
		if (currentPropValue) {
			clipboardCopy(getPropertyFieldValue(property?.value, propertyType));
		}
	};
	let addressString = property?.address ? `0x${property?.address.toString(16).toUpperCase()}` : "";
	if (property?.bits) {
		addressString += property.bits.includes("-")
			? ` (bits: ${property.bits})`
			: ` (bit: ${property.bits})`
	}
	return (
		<>
			<SaveValueButton active={madeEdit} onClick={handleSave} />
			<CopyValueIcon onClick={handleCopyClick} />
			<FreezeValueButton disabled={isReadonly} isFrozen={isFrozen} path={path} />
			{isSelect
				? <PropertyInputSelect 
					path={path} 
					displayValue={value.toString()}
					isReadonly={isReadonly} 
					onChange={handleUpdate}
				/>
				: <PropertyTextbox
					type={type}
					propertyType={propertyType}
					path={path}
					editValue={(hasFocus || madeEdit) ? value : null}
					setHasFocus={setHasFocus}
					save={handleSave}
					setValue={handleUpdate}
					isEdit={hasFocus || madeEdit}
					isReadonly={!!isReadonly}
				/>
			}
			<span class="margin-left color-darker center-self">
				{addressString}
			</span>
		</>
	)
}
