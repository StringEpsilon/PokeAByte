import { PropertyEdit } from "./PropertyEdit";
import { AttributesTable } from "./AttributesTable";
import { Advanced } from "../../../components/Advanced";
import { useStorageRecordState } from "../../../hooks/useStorageState";

export function PropertyValue({ path, mapperId }: { mapperId: string, path: string }) {
	const [isTableOpen, setTableOpen] = useStorageRecordState(mapperId+"-attributes", path, false);
	const toggleTable = () => setTableOpen(!isTableOpen);
	return (
		<>
			<tr class="property striped">
				<Advanced>
					<th onClick={() => toggleTable()} class="interactive">
						<label htmlFor={"edit-" + path} >
							{path.split(".").pop()}:
						</label>
					</th>
				</Advanced>
				<Advanced when={false}>
					<th >
						<label htmlFor={"edit-" + path} >
							{path.split(".").pop()}:
						</label>
					</th>
				</Advanced>
				<td>
					<PropertyEdit path={path} />
				</td>
			</tr>
			<Advanced>
				{isTableOpen 
					? <tr>
						<td colSpan={2}>
							<AttributesTable path={path} />
						</td>
					</tr>
					: <tr class="hidden" />
				}
			</Advanced>
			<Advanced when={false}>
				<tr class="hidden" />
			</Advanced>
		</>
	);
}

