import { useLocation } from "wouter";
import { HeaderNavigation } from "./HeaderNavigation";
import { Store } from "../utility/propertyStore";
import { useCallback, useSyncExternalStore } from "preact/compat";

export function Header() {
	const mapper = useSyncExternalStore(Store.subscribeMapper, Store.getMapper);
	const [, setLocation] = useLocation();
	const reloadMapper = useCallback(
		async () => {
			// setReloading(true);
			// @ts-expect-error The upstream type definition is incomplete, accessing fileId works just fine.
			await Store.client.changeMapper(mapper.fileId);
			// setReloading(false);
		}
		, []);
	const textHighlightClass = mapper ? "text-green" : "text-red";
	return (
		<header className="layout-box">
			<div>
				<h1 class={textHighlightClass}>
					Poke-A-Byte
				</h1>
				<div class={"mapper-info"}>
					<div class={textHighlightClass}>
						{mapper
							? mapper.gameName
							: "No mapper"
						}
						{mapper
							? <i title="Status: Connected" className={`material-icons ${textHighlightClass}`}> cell_tower </i>
							: <i title="Status: Disconnected" className={`material-icons ${textHighlightClass}`}> remove_circle_outline </i>
						}
					</div>
					{mapper &&
						<span>
							<button type="button" className="border-red" onClick={Store.client.unloadMapper}>
								Unload
							</button>
							<button type="button" className="margin-left border-purple" onClick={reloadMapper}>
								Reload
							</button>
						</span>
					}
				</div>
			</div>
			<nav className={`tab`}>
				<HeaderNavigation mapper={mapper} />
			</nav>
		</header>
	);
}