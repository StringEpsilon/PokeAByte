import { Store } from "../../../utility/propertyStore";
import { SaveValueButton } from "./SaveValueButton";
import { FreezeValueButton } from "./FreezeValueButton";
import { useGameProperty } from "../hooks/useGameProperty";
import { Toasts } from "../../../notifications/ToastStore";
import { GamePropertyType } from "pokeaclient";
import { PropertyTextbox } from "./PropertyTextbox";
import { PropertyInputSelect } from "./PropertyInputSelect";
import { useState } from "preact/hooks";

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
					Toasts.push(`Saved successful`, "task_alt", "success");
				});
		}
	};

	return (
		<>
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
			{!isReadonly &&
				<>
					<SaveValueButton active={madeEdit} onClick={handleSave} />
					<FreezeValueButton isFrozen={isFrozen} path={path} />
				</>
			}
		</>
	)
}



