import { TargetedMouseEvent } from "preact";
import { useUISetting } from "../../../Contexts/UISettingsContext";

export function FavoriteIcon(props: { mapperId: string; }) {
	const [favoriteIds, setFavorites] = useUISetting("favoriteMappers");
	const handleClick = (event: TargetedMouseEvent<HTMLButtonElement>) => {
		if (favoriteIds?.includes(props.mapperId)) {
			setFavorites(favoriteIds?.filter(x => x !== props.mapperId) ?? []);
		} else {
			setFavorites([...(favoriteIds ?? []), props.mapperId]);
		}
		event.stopPropagation();
		return false;
	};

	if (favoriteIds?.includes(props.mapperId)) {
		return (
			<button class="no-border" onClick={handleClick} title="Remove from favorites">
				<i class="material-icons text-red">favorite</i>
			</button>
		);
	}
	return (
		<button class="no-border" onClick={e => handleClick(e)} title="Add to favorites">
			<i class="material-icons">favorite_outline</i>
		</button>
	);
}
