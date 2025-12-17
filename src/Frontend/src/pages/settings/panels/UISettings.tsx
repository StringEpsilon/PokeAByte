import { useContext } from "preact/hooks";
import { Panel } from "../../mappers/Panel";
import { UISettingsContext, useUISetting } from "@/Contexts/UISettingsContext";
import { MapperFilesContext } from "@/Contexts/availableMapperContext";
import { WideButton } from "@/components/WideButton";

export function UISettings() {
	const settingsContext = useContext(UISettingsContext);
	const [advancedMode, setAdanvedMode] = useUISetting("advancedMode");
	const [preserveFreeze, setPreserveFreeze] = useUISetting("preserveFreeze");
	const [forceVisible, setForceVisible] = useUISetting("forceVisible");
	const [recentlyUsedEnabled, setRecentlyUsed] = useUISetting("recentlyUsedEnabled");

	return (
		<Panel id="_settings_ui" title="UI settings">
			<div>
				<strong>
					Settings will apply as soon as you change them.
				</strong>
				<hr />
				<form onSubmit={(e) => e.preventDefault()}>
					<table class="striped">
						<tbody>
							<tr>
								<th>
									<label htmlFor="advanced">Enable advanced mode: </label>
								</th>
								<td>
									<input
										name="advanced"
										type="checkbox"
										role="switch"
										checked={advancedMode}
										onInput={() => setAdanvedMode(!advancedMode)}
									/>
									<span>Displays additional information and enables certain features.</span>
								</td>
							</tr>
							<tr>
								<th>
									<label htmlFor="forceVisible">Display hidden properties: </label>
								</th>
								<td>
									<input
										name="forceVisible"
										type="checkbox"
										role="switch"
										checked={forceVisible}
										onInput={() => setForceVisible(!forceVisible)}
									/>
									<span>Enabling this shows properties even if you chose to hide them. </span>
								</td>
							</tr>
							<tr>
								<th>
									<label htmlFor="preserveFreeze">Preserve freezes on reload: </label>
								</th>
								<td>
									<input
										name="preserveFreeze"
										type="checkbox"
										role="switch"
										checked={preserveFreeze}
										onInput={() => setPreserveFreeze(!preserveFreeze)}
									/>
									<span>When reloading a mapper, reapply previously frozen values. </span>
								</td>
							</tr>
							<tr>
								<th>
									<label htmlFor="recentlyUsed">Track recently used mappers:</label>
								</th>
								<td>
									<input
										name="recentlyUsed"
										type="checkbox"
										role="switch"
										checked={settingsContext.settings.recentlyUsedEnabled}
										onInput={() => setRecentlyUsed(!recentlyUsedEnabled)}
									/>
									<span> When enabled, keep track of the last 5 used mappers for quick loading </span>
								</td>
							</tr>							
							<FavoriteManagement />							
						</tbody>
					</table>
				</form>
			</div>
		</Panel>
	)
}

export function FavoriteManagement() {
	const [favoriteIds, setFavorites] = useUISetting("favoriteMappers");
	const removeFavorite = (favorite: string) => {
		setFavorites(favoriteIds?.filter(x => x !== favorite) ?? []);
	};
	
	const moveFavoriteUp = (favoriteId: string) => {
		if (!favoriteIds) {
			return;
		}
		const newArrangement = [...favoriteIds];
		const index = newArrangement.indexOf(favoriteId);
		console.log(index + " => "+ (index-1));
		if (index > 0) {
			newArrangement.splice(index, 1) 
			newArrangement.splice(index-1, 0, favoriteId);
			setFavorites([...newArrangement]);
		}
	};

	const moveFavoriteDown = (favoriteId: string) => {
		if (!favoriteIds) {
			return;
		}
		const newArrangement = [...favoriteIds];
		const index = newArrangement?.indexOf(favoriteId);
		if (index < newArrangement?.length) {
			newArrangement.splice(index, 1) 
			newArrangement.splice(index+1, 0, favoriteId);
			setFavorites([...newArrangement]);
		}
		console.log(newArrangement.join(" "));
	};
	const mapperFileContext = useContext(MapperFilesContext);
	const favorites = favoriteIds?.map(id => mapperFileContext.availableMappers?.find(mapper => mapper.id == id))
		.filter(x => !!x);
		
	return (
		<>
			<tr>
				<th>
					<label>Favorites:</label>
				</th>
				<td>
					<table class="striped">
						<tbody>
							{favorites?.map((favorite, index) => {
								return <tr key={favorite.id}>
									<td>
										<span class="margin-left" >{favorite.displayName}</span>
									</td>
									<td>
										<button 
											onClick={() => removeFavorite(favorite.id)}
											class="margin-left margin-right"
										> 
											<i class="material-icons text-red"> delete </i> 
										</button>
										{index+1 < favorites.length &&
											<button 
											onClick={() => moveFavoriteDown(favorite.id)}
											class="margin-right"
											> 
												<i class="material-icons"> arrow_downward </i> 
											</button>
										}
										{index > 0 &&
											<button 
												onClick={() => moveFavoriteUp(favorite.id)}
												class="margin-right"
												style={{ float: "right"}}
											> 
												<i class="material-icons"> arrow_upward </i> 
											</button>
										}
									</td>
									<br/>
								</tr>
							})}
						</tbody>
					</table>
					{!!favoriteIds?.length && 
						<WideButton text="Clear all" color="red" onClick={() => setFavorites([])} />
					}
					{!favoriteIds?.length && 
						<span> You currently have no favorites </span>
					}
					
				</td>
			</tr>
		</>

	);
}