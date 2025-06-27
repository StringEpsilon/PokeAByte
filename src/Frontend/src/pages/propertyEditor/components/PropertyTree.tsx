import type { JSX } from "preact";
import { useState } from "preact/hooks";
import { Store } from "../../../utility/propertyStore";
import { PropertyValue } from "./PropertyValue";
import { unique } from "../utils/unique";

function getPropertyOpenState(mapperId: string | undefined, path: string): boolean {
	if (!mapperId) {
		return false;
	}
	const mapperConfigJson = window.localStorage.getItem(mapperId);
	if (mapperConfigJson == null) {
		return false;
	}
	const mapperConfig = JSON.parse(mapperConfigJson);
	return !!(mapperConfig[path]);
}

function savePropertyOpenState(mapperId: string | undefined, path: string, isOpen: boolean) {
	if (!mapperId) {
		return;
	}
	const mapperConfigJson = window.localStorage.getItem(mapperId);
	let mapperConfig: Record<string, boolean> = {};
	if (mapperConfigJson != null) {
		mapperConfig = JSON.parse(mapperConfigJson);
	}
	mapperConfig[path] = isOpen;
	window.localStorage.setItem(mapperId, JSON.stringify(mapperConfig));
	return !!(mapperConfig[path]);
}

export function PropertyTree({ path, level = 1 }: { path: string, level?: number }) {
	const properties = Store.getAllProperties();
	const mapperId = Store.getMapper()?.id;

	const [isOpen, setIsOpen] = useState(getPropertyOpenState(mapperId, path));
	const onToggleOpen = (event: JSX.TargetedToggleEvent<HTMLDetailsElement>) => {
		savePropertyOpenState(mapperId, path, event.currentTarget.open);
		setIsOpen(event.currentTarget.open);
	}
	if (properties[path]) {
		return <PropertyValue path={path} />
	}
	const immediateChildren = Object.keys(properties)
		.filter(x => x.startsWith(path + "."))
		.map(x => ({name: x.split(".")[level], level: x.split('.').length}))
		.toSorted((a, b) => {
			if (a.level > b.level) {
				return 1;
			}
			if (a.level < b.level) {
				return -1;
			}
			return 0;
		})
		.map(x => x.name)
		.filter(unique);

	let pathSements = path.split(".");
	let lastPathItem = pathSements[pathSements.length-1];


	return (
		<li>
			<details open={isOpen} onToggle={onToggleOpen}>
				<summary className="folder" >
					<i className="material-icons"> {isOpen? "folder" : "folder_open"} </i>
					<span class="margin-left">{lastPathItem}</span> 
					<span class="margin-left color-darker">{immediateChildren.length} Entries</span>
				</summary>
				<ul>
					{isOpen &&
						immediateChildren.map(x => {
							const childPath = path + "." + x;
							return <PropertyTree key={childPath} path={childPath} level={level + 1} />;
						})
					}
				</ul>
			</details>
		</li>
	)
}