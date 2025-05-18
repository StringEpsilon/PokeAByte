import { useRef, useSyncExternalStore } from "react";
import { ToastNotification, Toasts } from "./ToastStore";
import { Toast } from "./Toast";

export function Notifications() {
	const ref = useRef<ToastNotification[]>([]);
	const getToasts = () => {
		const newToasts = Toasts.getToasts();
		if (newToasts.map(x => x.id.toString()).join() !== ref.current.map(x => x.id.toString()).join()) {
			ref.current = newToasts;
		}
		return ref.current;
	};
	const toasts = useSyncExternalStore(Toasts.subscribe, getToasts);
	return (
		<div className="notifications">
			{toasts.map(toast => {
				return <Toast key={toast.id} {...toast} />
			})}
		</div>
	);
}
