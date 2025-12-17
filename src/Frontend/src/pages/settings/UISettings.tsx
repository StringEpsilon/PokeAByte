import { useContext } from "preact/hooks";
import { Panel } from "../mappers/Panel";
import { UISettingsContext, useUISetting } from "../../Contexts/UISettingsContext";
import { SelectInput } from "../../components/SelectInput";
import { unique } from "../propertyEditor/utils/unique";
import { MapperFilesContext } from "../../Contexts/availableMapperContext";

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
					<table>
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
									<p>Enabling this shows properties even if you chose to hide them. </p>
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
								</td>
							</tr>
							<tr>
								<th>
									<label htmlFor="recentlyUsed">Show "Recently used mappers":</label>
								</th>
								<td>
									<input
										name="recentlyUsed"
										type="checkbox"
										role="switch"
										checked={settingsContext.settings.recentlyUsedEnabled}
										onInput={() => setRecentlyUsed(!recentlyUsedEnabled)}
									/>
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
	const [favoritIds, setFavorites] = useUISetting("favoriteMappers");

	const addFavorite = (mapperName: string) => {
		const newFavorites = favoritIds ? [...favoritIds] : [];
		newFavorites.push(mapperName);		
		setFavorites(newFavorites.filter(unique));
	};

	const removeFavorite = (favorite: string) => {
		setFavorites(favoritIds?.filter(x => x !== favorite) ?? []);
	};
	const mapperFileContext = useContext(MapperFilesContext);
	const favorites = mapperFileContext.availableMappers?.filter((mapper) => favoritIds?.includes(mapper.id));
	return (
		<>
			<tr>
				<th>
					<label htmlFor="selectFavorite">Select mapper to add:</label>
				</th>
				<td>
					<SelectInput
						size={55}
						id="mapper-select"
						onSelection={(option) => addFavorite(option.value)}
						options={mapperFileContext.availableMappers.map((x) => ({ value: x.id, display: x.displayName })) || []}
					/>
				</td>
			</tr>
			<tr>
				<th>
					<label>Favorites:</label>
				</th>
				<td>
					<table class="striped">
						<tbody>
							{favorites?.map(favorite => {
		
								return <tr>
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
									</td>
									<br/>
								</tr>
							})}
						</tbody>
					</table>
					{!favoritIds?.length && 
						<span> You currently have no favorites </span>
					}
				</td>
			</tr>
		</>

	);
}