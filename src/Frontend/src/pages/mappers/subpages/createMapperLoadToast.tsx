import { Toasts } from "../../../notifications/ToastStore";

export function createMapperLoadToast(_: boolean, result: boolean | string | null) {
	if (result === true) {
		Toasts.push("Loaded mapper", "task_alt", "success");
	} else if (result !== null) {
		Toasts.push("Failed to load mapper:\n " + result, "", "error", false);
	} else {
		Toasts.push("Failed to load mapper.\n Check Poke-A-Byte log for more information.", "", "error");
	}
}
