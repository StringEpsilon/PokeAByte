import { Store } from "../../../utility/propertyStore";
import { Toasts } from "../../../notifications/ToastStore";

export function FreezeValueButton({ isFrozen, path, disabled}: { isFrozen: boolean, path: string, disabled: boolean }) {
	const handleClick = () => {
		Store.client.freezeProperty(path, !isFrozen)
			.then(() => Toasts.push(`Succesfully ${isFrozen ? "unfroze" : "froze"} property value!`, "task_alt", "success"));
	}
	const classes = isFrozen ? "icon-button margin-right border-blue highlight" : "icon-button margin-right";
	return (
		<button className={classes} type="button" onClick={handleClick} disabled={disabled}>
			<i className="material-icons"> ac_unit </i>
		</button>
	)
}
