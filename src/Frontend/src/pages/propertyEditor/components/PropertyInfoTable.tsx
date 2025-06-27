import { useGamePropertyField } from "../hooks/useGamePropertyField";
import { clipboardCopy } from "../utils/clipboardCopy";
import { CopyValueIcon } from "./CopyValueIcon";

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
	return (
		<tr>
			<th>Bytes</th>
			<td className="no-padding">
				<CopyValueIcon onClick={() => clipboardCopy(bytes?.join(""))} />
			</td>
			<td className="property-bytes">
				<span>0x&nbsp;</span>
				{bytes?.map((byte, i) => {
					var value = byte.toString(16).toUpperCase().padStart(2, "0");
					return (
						<input
							key={i}
							type="text"
							size={2}
							maxLength={2}
							className="no-padding"
							value={value}
							onInput={() => { }}
						/>
					);
				})}
			</td>
		</tr>
	);
}