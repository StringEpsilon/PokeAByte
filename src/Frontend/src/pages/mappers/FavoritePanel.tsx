import { useContext } from "preact/hooks";
import { Link } from "wouter";
import { MapperFilesContext } from "../../Contexts/availableMapperContext";
import { useUISetting } from "../../Contexts/UISettingsContext";
import { useAPI } from "../../hooks/useAPI";
import { changeMapper } from "../../utility/fetch";
import { Panel } from "./Panel";
import { createMapperLoadToast } from "./subpages/createMapperLoadToast";
import { JSX } from "preact";

type ButtonColor = { border: string, bg: string, text: string }

const COLOR_MAP: Record<string, ButtonColor> = {
	"pokemon yellow": { border: "#FFD733", bg:"#FFD733",  text: "black" },
	"pokemon red blue": { border: "#DA3914", bg:"#DA3914",  text: "white" },
	"pokemon firered leafgreen": { border: "#F15C01", bg:"#F15C01",  text: "white" },
	"pokemon ruby saphire": { border: "#CD2236", bg:"#DF6F7C",  text: "white" },
	"pokemon emerald": { border: "#009652", bg:"#59BB8F",  text: "white" },
	"pokemon diamond perl": { border: "#5E7C9A", bg:"#90BEED",  text: "white" },
	"pokemon platinum": { border: "#C1C1B5", bg:"#A0A08D",  text: "black" },
	"pokemon soulsilver": { border: "#C8D2E0", bg:"#AAB9CF",  text: "white" },
	"pokemon heartgold": { border: "#F0CF5B", bg:"#E8B502",  text: "black" },
	"pokemon white 2": { border: "#F2D9D8", bg:"#F2D9D8",  text: "white" },
	"pokemon black 2": { border: "#1F2835", bg:"#1F2835",  text: "white" },
	"pokemon white": { border: "#EBEBEB", bg:"#EBEBEB",  text: "black" },
	"pokemon black": { border: "#444444", bg:"#444444",  text: "white" },
} 

function getBorderColor(mapper: string) {
	mapper = mapper.toLowerCase();
	const colorKey = Object.getOwnPropertyNames(COLOR_MAP).find(x =>mapper.includes(x));
	if (colorKey) {
		return COLOR_MAP[colorKey] ?? null;
	}
	return null;
}

export function FavoritePanel() {
	const [favoriteIds] = useUISetting("favoriteMappers");
	const mapperFileContext = useContext(MapperFilesContext);
	const changeMapperApi = useAPI(changeMapper, createMapperLoadToast);
	const favorites = mapperFileContext.availableMappers?.filter((mapper) => favoriteIds?.includes(mapper.id));

	if (!favorites?.length) {
		return null;
	}

	
	return (
		<Panel id="_mapper-favorites" title="Favorite mappers" defaultOpen>
			<div class="favorites">
				{favorites?.map((favorite) => {
					const buttonColors = getBorderColor(favorite.displayName);
					const style: JSX.CSSProperties = {};
					if (buttonColors) {
						style.borderColor = buttonColors.border;
						style.backgroundColor = buttonColors.bg;
						style.color = buttonColors.text;
					}
					return (
						<button 
							class="margin-right" 
							onClick={() => changeMapperApi.call(favorite.id)}
							style={style}
						>
							{favorite.displayName}
						</button>
					);
				})}			
			</div>
			<br />
			<span>
				You can manage your favorites <Link href="~/ui/settings/#settings_ui">here</Link>.
			</span>
		</Panel>
	);
}
