import { useState } from "preact/hooks";
import { useGamePropertyField } from "../hooks/useGamePropertyField";
import { clipboardCopy } from "../utils/clipboardCopy";
import { CopyValueIcon } from "./CopyValueIcon";
import { SaveValueButton } from "./SaveValueButton";
import { Store } from "../../../utility/propertyStore";
import { Toasts } from "../../../notifications/ToastStore";

export function PropertyInfoTable({ path }: { path: string }) {
	const type = useGamePropertyField(path, "type");
	const address = useGamePropertyField(path, "address")?.toString(16);
	const bits = useGamePropertyField(path, "bits");
	const length = useGamePropertyField(path, "length");
	const size = useGamePropertyField(path, "size");
	const reference = useGamePropertyField(path, "reference");
	const memoryContainer = useGamePropertyField(path, "memoryContainer");

	return (
		<table className="stripes small-round surface small-space">
			<tbody>
				<tr>
					<th>Type</th>
					<td></td>
					<td>{type}</td>
				</tr>
				<tr>
					<th>Length</th>
					<td></td>
					<td>{length}</td>
				</tr>
				{!!size &&
					<tr>
						<th>Size</th>
						<td></td>
						<td>{size}</td>
					</tr>
				}
				<tr>
					<th>Path</th>
					<td className="no-padding">
						<CopyValueIcon onClick={() => clipboardCopy(path)} />
					</td>
					<td>{path}</td>
				</tr>
				{!!address &&
					<tr>
						<th>Address</th>
						<td className="no-padding">
							<CopyValueIcon onClick={() => clipboardCopy(address ? `0x${address.toUpperCase()}`: "")} />
						</td>
						<td>{address ? `0x${address.toUpperCase()}` : "-"}</td>
					</tr>
				}
				{!!bits &&
					<tr>
						<th>Bits</th>
						<td className="no-padding">
							<CopyValueIcon onClick={() => clipboardCopy(address ? `0x${address.toUpperCase()}`: "")} />
						</td>
						<td>{bits}</td>
					</tr>
				}
				<tr>
					<th>memoryContainer</th>
					<td className="no-padding">
						<CopyValueIcon onClick={() => clipboardCopy(memoryContainer)} />
					</td>
					<td>{memoryContainer ?? "default"}</td>
				</tr>
				{!!reference &&
					<tr>
						<th>Reference</th>
						<td className="no-padding">
							<CopyValueIcon onClick={() => clipboardCopy(reference)} />
						</td>
						<td>{reference}</td>
					</tr>
				}
				<PropertyByteRow path={path} />
			</tbody>
		</table>
	);
}

export function PropertyByteRow({ path }: { path: string }) {
	const bytes = useGamePropertyField(path, "bytes");
	const [madeEdit, setMadeEdit] = useState<boolean>(false);
	const originalValue = bytes?.map(x => x.toString(16).toUpperCase()) ?? [];
	const [values, setValues] = useState(bytes?.map(x => x.toString(16).toUpperCase()) ?? []);
	const handleEdit = (byte: string, index: number) => {
		const newValues = structuredClone(values);
		newValues[index] = byte.toUpperCase();
		setValues(newValues);
		setMadeEdit(newValues[index] !== originalValue[index]);
	};
	const handleSave = () => {
		Store.client.updatePropertyBytes(path, values.map(x => parseInt(x, 16)))
			.then(() => {
				setMadeEdit(false);
				Toasts.push(`Succesfully saved bytes!`, "task_alt", "success");
			});
		setMadeEdit(false);
	}
	if (bytes == null) {
		return null;
	}
	return (
		<tr>
			<th>Bytes</th>
			<td className="no-padding">
				<CopyValueIcon onClick={() => clipboardCopy(bytes.map(x => x.toString(16).toUpperCase()).join(" "))} />
			</td>
			<td className="property-bytes">
				<SaveValueButton active={madeEdit} onClick={handleSave} />
				<span>0x&nbsp;</span>
				{values.map((value, i) => {
					return (
						<input
							key={i}
							type="text"
							size={2}
							maxLength={2}
							className="no-padding"
							value={value}
							onInput={(e) => handleEdit(e.currentTarget.value, i)}
						/>
					);
				})}
				<button 
					className="icon-button" 
					disabled={!madeEdit} 
					type="button" 
					onClick={() => {setValues(originalValue); setMadeEdit(false)}}
				>
					<i className="material-icons"> undo </i>
				</button>
			</td>
		</tr>
	);
}