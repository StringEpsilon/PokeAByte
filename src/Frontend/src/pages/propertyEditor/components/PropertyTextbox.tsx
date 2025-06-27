import { GamePropertyType } from "pokeaclient";
import { useGamePropertyField } from "../hooks/useGamePropertyField";

export function getPropertyFieldValue(value: any, type: GamePropertyType | null) {
	if (type === "bitArray") {
		return value.map((x: boolean) => x ? "1" : "0").join("") ?? "";
	}
	return value;
}

export type PropertyTextboxProps = {
	path: string,
	type: string,
	isEdit: boolean,
	isReadonly: boolean,
	propertyType: GamePropertyType | null,
	editValue: string|boolean | null,
	save: () => void,
	setHasFocus: (focus: boolean) => void,
	setValue: (value: string|boolean) => void,
}


export function PropertyTextbox(props: PropertyTextboxProps) {
	const propertyValue = useGamePropertyField(props.path, "value");
	const value = getPropertyFieldValue(propertyValue, props.propertyType) ?? "";
	const update = (value: string | boolean) => {
		if (!props.isReadonly) {
			props.setValue(value);
		}
	};
	if (props.type === "checkbox") {
		return (
			<label>
				<input
					type={"checkbox"}
					role="switch"
					checked={props.isEdit ? props.editValue : propertyValue}
					onFocus={() => { props.setHasFocus(true); props.setValue(propertyValue); }}
					onBlur={() => props.setHasFocus(false)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							props.save();
						}
					}}
					onInput={(e) => update(e.currentTarget.checked)}
					readOnly={props.isReadonly}
					disabled={props.isReadonly} />
			</label>
		);
	}
	return (
		<input
			className="margin-left"
			type={props.type}
			value={props.isEdit ? props.editValue : value}
			onFocus={() => { props.setHasFocus(true); props.setValue(propertyValue); }}
			onBlur={() => props.setHasFocus(false)}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					props.save();
				}
			}}
			onInput={(e) => props.setValue(e.currentTarget.value)}
			readOnly={props.isReadonly}
			disabled={props.isReadonly} 
		/>
	);
}
